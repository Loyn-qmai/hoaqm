import React, { useState, useEffect, useMemo } from 'react';
import { FlowerItem, OccasionId, FlowerCategory } from '../types';
import { OCCASIONS, CATEGORIES } from '../data/flowers';
import { FlowerCard } from './FlowerCard';
import { SlidersHorizontal, Sparkles, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface FlowerGridProps {
  flowers: FlowerItem[];
  favorites: string[];
  onToggleFavorite: (flower: FlowerItem) => void;
  onQuickView: (flower: FlowerItem) => void;
  selectedOccasion: OccasionId;
  setSelectedOccasion: (occ: OccasionId) => void;
  selectedCategory: FlowerCategory;
  setSelectedCategory: (cat: FlowerCategory) => void;
  sortBy: string;
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
}

export const FlowerGrid: React.FC<FlowerGridProps> = ({
  flowers,
  favorites,
  onToggleFavorite,
  onQuickView,
  selectedOccasion,
  setSelectedOccasion,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) => {
  const [showOnlyDiscount, setShowOnlyDiscount] = useState(false);
  const [showOnlyBestSeller, setShowOnlyBestSeller] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOccasion, selectedCategory, showOnlyDiscount, showOnlyBestSeller, sortBy, itemsPerPage]);

  // Filter flowers
  const filteredFlowers = useMemo(() => {
    return flowers
      .filter((flower) => {
        // Occasion filter
        if (selectedOccasion !== 'all' && flower.occasion && !flower.occasion.includes(selectedOccasion)) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'all' && flower.category !== selectedCategory) {
          return false;
        }
        // Discounts only
        if (showOnlyDiscount && (!flower.originalPrice || flower.originalPrice <= flower.price)) {
          return false;
        }
        // Best sellers only
        if (showOnlyBestSeller && !flower.isBestSeller) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aInStock = a.inStock !== false;
        const bInStock = b.inStock !== false;

        // Push out-of-stock items to the bottom
        if (aInStock && !bInStock) return -1;
        if (!aInStock && bInStock) return 1;

        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        // Default: Sort from newest added to oldest
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [flowers, selectedOccasion, selectedCategory, showOnlyDiscount, showOnlyBestSeller, sortBy]);

  // Pagination Math
  const totalPages = Math.ceil(filteredFlowers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredFlowers.length);

  const paginatedFlowers = useMemo(() => {
    return filteredFlowers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFlowers, startIndex, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogElement = document.getElementById('flower-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSelectedOccasion('all');
    setSelectedCategory('all');
    setShowOnlyDiscount(false);
    setShowOnlyBestSeller(false);
    setSortBy('popular');
    setCurrentPage(1);
  };

  return (
    <section id="flower-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Compact Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Danh Sách Mẫu Hoa Tươi</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Xem trực tiếp hình ảnh, bảng giá niêm yết và số lượng còn lại trong kho.
          </p>
        </div>
      </div>

      {/* Occasions Bar Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {OCCASIONS.map((occ) => {
          const isActive = selectedOccasion === occ.id;
          return (
            <button
              key={occ.id}
              onClick={() => setSelectedOccasion(occ.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all shadow-2xs ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-rose-50 border border-stone-200 hover:border-rose-200'
              }`}
            >
              <span>{occ.icon}</span>
              <span>{occ.name}</span>
            </button>
          );
        })}
      </div>



      {/* Counter & Active Filter Indicators + Top Pagination Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-stone-500 mb-6 bg-stone-50/70 p-3 sm:p-4 rounded-2xl border border-stone-200/80">
        <div className="flex items-center gap-2 flex-wrap">
          {filteredFlowers.length > 0 ? (
            <div>
              Hiển thị <span className="font-bold text-stone-900">{startIndex + 1} - {endIndex}</span> trong tổng số{' '}
              <span className="font-bold text-stone-900">{filteredFlowers.length}</span> mẫu hoa tươi
            </div>
          ) : (
            <span>Không có sản phẩm nào</span>
          )}

          {(selectedOccasion !== 'all' || selectedCategory !== 'all' || showOnlyDiscount || showOnlyBestSeller) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium transition-colors ml-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
          {/* Items per page selector */}
          {filteredFlowers.length > 8 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-500 hidden md:inline">Hiển thị:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value={8}>8 / trang (2 hàng)</option>
                <option value={12}>12 / trang (3 hàng)</option>
                <option value={16}>16 / trang (4 hàng)</option>
                <option value={24}>24 / trang</option>
              </select>
            </div>
          )}

          {/* Top Compact Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-white text-xs transition-all shadow-2xs"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-stone-800 px-2 bg-white py-1 rounded-lg border border-stone-200 shadow-2xs">
                {currentPage}/{totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-white text-xs transition-all shadow-2xs"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Flower Grid Items */}
      {paginatedFlowers.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {paginatedFlowers.map((flower) => (
              <FlowerCard
                key={flower.id}
                flower={flower}
                isFavorite={favorites.includes(flower.id)}
                onToggleFavorite={onToggleFavorite}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {/* Pagination Controls Bar */}
          {totalPages > 1 && (
            <div className="mt-10 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-500">
                Trang <span className="font-bold text-stone-900">{currentPage}</span> / <span className="font-bold text-stone-900">{totalPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Trang trước</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show max 5 numbers cleanly around currentPage
                  if (
                    totalPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 1
                  ) {
                    if (pageNum === 2 && currentPage > 3) return <span key={pageNum} className="text-stone-400 px-1 text-xs">...</span>;
                    if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key={pageNum} className="text-stone-400 px-1 text-xs">...</span>;
                    return null;
                  }

                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-md scale-105'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span className="hidden xs:inline">Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-rose-500 mb-4 shadow-sm">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Không tìm thấy mẫu hoa phù hợp</h3>
          <p className="text-stone-600 text-sm mb-6">
            Rất tiếc, chưa có bó hoa nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử đổi từ khóa hoặc thiết lập lại bộ lọc.
          </p>
          <button
            onClick={resetFilters}
            className="bg-stone-900 hover:bg-rose-600 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all"
          >
            Xem Tất Cả Mẫu Hoa
          </button>
        </div>
      )}
    </section>
  );
};
