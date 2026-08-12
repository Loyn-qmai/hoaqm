import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_FLOWERS } from './data/flowers';
import { FlowerItem, OccasionId, FlowerCategory } from './types';
import { Navbar } from './components/Navbar';
import { FlowerGrid } from './components/FlowerGrid';
import { FlowerDetailModal } from './components/FlowerDetailModal';
import { AdminModal } from './components/AdminModal';
import { FlowerCareSection } from './components/FlowerCareSection';
import { Footer } from './components/Footer';
import { Heart, X } from 'lucide-react';

const STORAGE_KEY = 'qm_flowers_v2';

export default function App() {
  // Load saved flowers from localStorage or initialize with SAMPLE_FLOWERS
  const [flowers, setFlowers] = useState<FlowerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load flowers from storage', e);
    }
    return SAMPLE_FLOWERS;
  });

  const [favorites, setFavorites] = useState<string[]>(['flower-1', 'flower-4']);

  // UI state controls
  const [activeTab, setActiveTab] = useState<'catalog' | 'care-tips'>('catalog');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionId>('all');
  const [selectedCategory, setSelectedCategory] = useState<FlowerCategory>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Modals
  const [quickViewFlower, setQuickViewFlower] = useState<FlowerItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  // Save to localStorage when flowers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowers));
    } catch (e) {
      console.error('Failed to save flowers to storage', e);
    }
  }, [flowers]);

  // Handlers
  const handleToggleFavorite = (flower: FlowerItem) => {
    if (favorites.includes(flower.id)) {
      setFavorites(favorites.filter((id) => id !== flower.id));
    } else {
      setFavorites([...favorites, flower.id]);
    }
  };

  const handleSaveFlower = (savedFlower: FlowerItem) => {
    setFlowers((prev) => {
      const index = prev.findIndex((f) => f.id === savedFlower.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = savedFlower;
        return updated;
      }
      return [savedFlower, ...prev];
    });
  };

  const handleDeleteFlower = (id: string) => {
    setFlowers((prev) => prev.filter((f) => f.id !== id));
  };

  const handleResetDefaultFlowers = () => {
    if (confirm('Bạn có chắc muốn khôi phục danh sách hoa về dữ liệu mẫu ban đầu?')) {
      setFlowers(SAMPLE_FLOWERS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const favoriteFlowersList = useMemo(() => {
    return flowers.filter((f) => favorites.includes(f.id));
  }, [flowers, favorites]);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-rose-200 selection:text-rose-900 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {activeTab === 'catalog' ? (
          <FlowerGrid
            flowers={flowers}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onQuickView={(flower) => setQuickViewFlower(flower)}
            selectedOccasion={selectedOccasion}
            setSelectedOccasion={setSelectedOccasion}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        ) : (
          /* Care Tips dedicated view */
          <div className="py-12">
            <FlowerCareSection />
          </div>
        )}
      </main>

      {/* Footer with Secret Admin Trigger on Logo */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Quick View Flower Detail Modal */}
      <FlowerDetailModal
        flower={quickViewFlower}
        isOpen={!!quickViewFlower}
        onClose={() => setQuickViewFlower(null)}
        isFavorite={quickViewFlower ? favorites.includes(quickViewFlower.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        flowers={flowers}
        onSaveFlower={handleSaveFlower}
        onDeleteFlower={handleDeleteFlower}
        onResetDefault={handleResetDefaultFlowers}
      />

      {/* Favorites Modal */}
      {isFavoritesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsFavoritesModalOpen(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold mb-4">
              <Heart className="w-5 h-5 fill-rose-600" />
              <h2 className="font-serif text-xl font-bold text-stone-900">Mẫu Hoa Yêu Thích Của Bạn</h2>
            </div>

            {favoriteFlowersList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {favoriteFlowersList.map((flower) => (
                  <div
                    key={flower.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={flower.imageUrl}
                        alt={flower.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-xs text-stone-900 line-clamp-1">{flower.name}</h4>
                        <span className="text-xs font-bold text-rose-600 block">{flower.price.toLocaleString('vi-VN')}₫</span>
                        <span className="text-[10px] text-stone-500 font-medium">{flower.unitQuantity || '10 cành'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setQuickViewFlower(flower);
                        setIsFavoritesModalOpen(false);
                      }}
                      className="text-xs font-semibold bg-stone-900 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      Xem
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-500 py-8 text-sm">Bạn chưa chọn mẫu hoa yêu thích nào.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
