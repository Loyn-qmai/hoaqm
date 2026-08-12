import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Check } from 'lucide-react';
import { FlowerItem } from '../types';
import { formatVND, calculateDiscountPercentage, convertGoogleDriveUrl } from '../utils/format';
import { getMatchingFlowerImage } from '../utils/imageMatcher';

interface FlowerCardProps {
  flower: FlowerItem;
  isFavorite: boolean;
  onToggleFavorite: (flower: FlowerItem) => void;
  onQuickView: (flower: FlowerItem) => void;
}

export const FlowerCard: React.FC<FlowerCardProps> = ({
  flower,
  isFavorite,
  onToggleFavorite,
  onQuickView,
}) => {
  const discountPercent = calculateDiscountPercentage(flower.price, flower.originalPrice);

  return (
    <div
      onClick={() => onQuickView(flower)}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-100 hover:border-rose-300 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-1/1 w-full overflow-hidden bg-stone-100">
        <img
          src={convertGoogleDriveUrl(flower.imageUrl) || flower.imageUrl || getMatchingFlowerImage(flower.name, flower.category)}
          alt={flower.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes('lh3.googleusercontent.com/d/')) {
              const fileIdMatch = target.src.match(/\/d\/([a-zA-Z0-9_-]+)/);
              if (fileIdMatch && fileIdMatch[1]) {
                target.src = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`;
                return;
              }
            } else if (target.src.includes('drive.google.com/thumbnail')) {
              const fileIdMatch = target.src.match(/id=([a-zA-Z0-9_-]+)/);
              if (fileIdMatch && fileIdMatch[1]) {
                target.src = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                return;
              }
            }
            target.src = getMatchingFlowerImage(flower.name, flower.category);
          }}
        />

        {/* Overlay backdrop on hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(flower);
            }}
            className="px-4 py-2 bg-white/95 text-stone-900 hover:bg-rose-600 hover:text-white rounded-full font-medium text-xs shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Xem Chi Tiết</span>
          </button>
        </div>

        {/* Badges Top Left */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {(flower.inStock === false || (flower.stockCount !== undefined && flower.stockCount <= 0)) && (
            <span className="bg-stone-900/90 text-white text-[8px] sm:text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1 border border-stone-700">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span>Hết Hàng</span>
            </span>
          )}
          {flower.isBestSeller && (
            <span className="bg-amber-500 text-stone-950 text-[8px] sm:text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center gap-0.5 sm:gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-stone-950" />
              <span className="hidden xs:inline">Bán Chạy</span>
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Button Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(flower);
          }}
          className={`absolute top-1.5 right-1.5 sm:top-3 sm:right-3 p-1 sm:p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3">
        <div>
          {/* Category Tag */}
          <span className="text-[9px] sm:text-[11px] font-semibold text-rose-600 uppercase tracking-wider block mb-0.5 sm:mb-1 truncate">
            {flower.categoryName}
          </span>

          {/* Title */}
          <h3 className="font-serif font-semibold text-stone-900 text-xs sm:text-base group-hover:text-rose-700 transition-colors line-clamp-2 leading-tight sm:leading-snug mb-1 sm:mb-2">
            {flower.name}
          </h3>

          {/* Unit Quantity Highlight */}
          <div className="bg-rose-50/80 border border-rose-100 rounded-md sm:rounded-lg p-1 sm:p-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] sm:text-xs my-0.5 sm:my-1 gap-0.5">
            <span className="text-stone-500 font-medium text-[9px] sm:text-xs hidden xs:inline">Quy cách:</span>
            <span className="font-bold text-rose-800 bg-white px-1.5 py-0.5 rounded border border-rose-200 text-[9px] sm:text-xs">
              {flower.unitQuantity || '10 cành'}
            </span>
          </div>
        </div>

        {/* Footer: Price & View Details Action */}
        <div className="pt-1.5 sm:pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-1 sm:gap-2">
          <div>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-stone-400 hidden sm:block font-medium">Giá bán</span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-bold text-rose-700 sm:text-stone-900 text-xs sm:text-xl leading-none">
                {formatVND(flower.price)}
              </span>
              {flower.originalPrice && flower.originalPrice > flower.price && (
                <span className="text-[9px] sm:text-xs text-stone-400 line-through leading-none">
                  {formatVND(flower.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(flower);
            }}
            className={`w-full sm:w-auto px-2 py-1 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-1 ${
              flower.inStock === false || (flower.stockCount !== undefined && flower.stockCount <= 0)
                ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                : 'bg-stone-900 hover:bg-rose-600 text-white'
            }`}
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>
              {flower.inStock === false || (flower.stockCount !== undefined && flower.stockCount <= 0)
                ? 'Tạm Hết'
                : 'Chi Tiết'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
