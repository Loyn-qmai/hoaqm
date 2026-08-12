import React from 'react';
import { FlowerItem, OccasionId, FlowerCategory } from '../types';
import { OCCASIONS, CATEGORIES } from '../data/flowers';
import { FlowerCard } from './FlowerCard';
import { SlidersHorizontal, Sparkles, Filter, RefreshCw } from 'lucide-react';

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
  const [showOnlyDiscount, setShowOnlyDiscount] = React.useState(false);
  const [showOnlyBestSeller, setShowOnlyBestSeller] = React.useState(false);

  // Filter flowers
  const filteredFlowers = React.useMemo(() => {
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
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        // popular
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [flowers, selectedOccasion, selectedCategory, showOnlyDiscount, showOnlyBestSeller, sortBy]);

  const resetFilters = () => {
    setSelectedOccasion('all');
    setSelectedCategory('all');
    setShowOnlyDiscount(false);
    setShowOnlyBestSeller(false);
    setSortBy('popular');
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

      {/* Category Pills & Control Row */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FlowerCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Controls: Discount Checkbox, Best seller, Sort By */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm ml-auto">
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={showOnlyDiscount}
              onChange={(e) => setShowOnlyDiscount(e.target.checked)}
              className="accent-rose-600 rounded text-rose-600"
            />
            <span>Đang giảm giá</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={showOnlyBestSeller}
              onChange={(e) => setShowOnlyBestSeller(e.target.checked)}
              className="accent-amber-500 rounded text-amber-500"
            />
            <span>Bán chạy nhất</span>
          </label>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Nổi bật & Bán chạy</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Counter & Active Filter Indicators */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 mb-6">
        <div>
          Hiển thị <span className="font-bold text-stone-900">{filteredFlowers.length}</span> sản phẩm hoa tươi
        </div>

        {(selectedOccasion !== 'all' || selectedCategory !== 'all' || showOnlyDiscount || showOnlyBestSeller) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>

      {/* Flower Grid Items (3 columns on mobile) */}
      {filteredFlowers.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {filteredFlowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              flower={flower}
              isFavorite={favorites.includes(flower.id)}
              onToggleFavorite={onToggleFavorite}
              onQuickView={onQuickView}
            />
          ))}
        </div>
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
