import React from 'react';
import { Heart, Sparkles, PhoneCall, Menu, X, Flower2 } from 'lucide-react';

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  onOpenFavorites,
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-rose-50 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>HOA TƯƠI QM - Chuyên Hoa Trang Trí, Sự Kiện & Ngày Lễ | Giao hoa Hà Nội tận nơi</span>
        <a href="tel:0344447914" className="hidden md:inline-flex items-center gap-1 ml-3 text-amber-200 hover:text-white transition-colors">
          <PhoneCall className="w-3 h-3" /> Hotline / Zalo: 0344 447 914
        </a>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('catalog')}>
            <div className="w-11 h-11 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shadow-xs group-hover:bg-rose-200 transition-colors">
              <Flower2 className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 block leading-tight">
                Hoa Tươi <span className="text-rose-600 font-sans font-extrabold text-2xl">QM</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-stone-500 font-medium block">
                Trang Trí • Sự Kiện • Ngày Lễ
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'catalog'
                  ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                  : 'text-stone-700 hover:text-rose-600 hover:bg-stone-50'
              }`}
            >
              🌸 Tất Cả Mẫu Hoa
            </button>

            <button
              onClick={() => setActiveTab('care-tips')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'care-tips'
                  ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                  : 'text-stone-700 hover:text-rose-600 hover:bg-stone-50'
              }`}
            >
              📖 Mẹo Giữ Hoa Tươi
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Direct Contact Button */}
            <a
              href="tel:0344447914"
              className="hidden sm:flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all hover:shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>0344 447 914</span>
            </a>

            {/* Wishlist Button */}
            <button
              onClick={onOpenFavorites}
              aria-label="Wishlist"
              className="p-2.5 rounded-full text-stone-700 hover:text-rose-600 hover:bg-rose-50 relative transition-colors border border-stone-200"
              title="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-100 py-3 space-y-2 animate-fade-in">
            <button
              onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 text-stone-800 font-medium hover:bg-rose-50 rounded-lg flex items-center gap-2"
            >
              🌸 Tất Cả Mẫu Hoa
            </button>
            <button
              onClick={() => { setActiveTab('care-tips'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2 text-stone-800 font-medium hover:bg-stone-50 rounded-lg flex items-center gap-2"
            >
              📖 Mẹo Giữ Hoa Tươi Dài Lâu
            </button>
            <a
              href="tel:0344447914"
              className="w-full text-left px-4 py-2 text-rose-700 font-bold hover:bg-rose-50 rounded-lg flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" /> Gọi hotline đặt hoa: 0344 447 914
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
