import React from 'react';
import { X, Star, Heart, Check, Sparkles, PhoneCall, MessageCircle } from 'lucide-react';
import { FlowerItem } from '../types';
import { formatVND, calculateDiscountPercentage, convertGoogleDriveUrl } from '../utils/format';
import { getMatchingFlowerImage } from '../utils/imageMatcher';

interface FlowerDetailModalProps {
  flower: FlowerItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (flower: FlowerItem) => void;
}

export const FlowerDetailModal: React.FC<FlowerDetailModalProps> = ({
  flower,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!isOpen || !flower) return null;

  const discountPercent = calculateDiscountPercentage(flower.price, flower.originalPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Details */}
          <div className="p-6 bg-stone-50 flex flex-col justify-center items-center relative">
            <div className="relative w-full aspect-1/1 rounded-2xl overflow-hidden shadow-md">
              <img
                src={convertGoogleDriveUrl(flower.imageUrl) || flower.imageUrl || getMatchingFlowerImage(flower.name, flower.category)}
                alt={flower.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
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
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  Giảm {discountPercent}%
                </span>
              )}
            </div>

            {/* Included Flowers */}
            {flower.flowersIncluded && flower.flowersIncluded.length > 0 && (
              <div className="w-full mt-4 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
                <span className="font-semibold text-stone-900 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Thành phần hoa kèm theo:
                </span>
                <ul className="grid grid-cols-1 gap-1 text-stone-600">
                  {flower.flowersIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Information & Phone Contact */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Favorite */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                  {flower.categoryName}
                </span>

                <button
                  onClick={() => onToggleFavorite(flower)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                  <span>{isFavorite ? 'Đã yêu thích' : 'Lưu lại'}</span>
                </button>
              </div>

              {/* Title */}
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 leading-tight mb-2">
                {flower.name}
              </h2>

              {/* Out of Stock Tag Notification */}
              {(flower.inStock === false || (flower.stockCount !== undefined && flower.stockCount <= 0)) && (
                <div className="bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold p-2.5 rounded-xl flex items-center gap-2 my-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                  <span>Sản phẩm hiện đang TẠM HẾT HÀNG. Vui lòng liên hệ Hotline/Zalo để đặt trước hoặc chọn mẫu tương tự!</span>
                </div>
              )}

              {/* Price & Unit Quantity Card */}
              <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200/80 my-4">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block">Đơn Giá Niêm Yết</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                    {formatVND(flower.price)}
                  </span>
                  {flower.originalPrice && flower.originalPrice > flower.price && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatVND(flower.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Clear specification of number of stems/flowers included */}
                <div className="mt-3 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs font-semibold text-rose-900">
                  <span>Số lượng cành/bó áp dụng:</span>
                  <span className="bg-white text-rose-700 px-3 py-1 rounded-full border border-rose-300 shadow-2xs">
                    {flower.unitQuantity || '10 cành'}
                  </span>
                </div>
              </div>

              {/* Description & Meaning */}
              <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                <p>{flower.description}</p>
                {flower.meaning && (
                  <div className="bg-amber-50 border-l-3 border-amber-400 p-2.5 rounded-r-lg text-amber-900 text-xs italic">
                    💡 <span className="font-semibold not-italic">Thông điệp:</span> {flower.meaning}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Contact Hotline & Zalo Buttons */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <a
                href="tel:0344447914"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Gọi Đặt Hoa Ngay: 0344 447 914</span>
              </a>

              <a
                href="https://zalo.me/0344447914"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn Zalo Tư Vấn Báo Giá (0344 447 914)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
