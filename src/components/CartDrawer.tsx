import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Tag, ArrowRight, Truck, Sparkles, Check } from 'lucide-react';
import { CartItem } from '../types';
import { formatVND } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: (appliedVoucher: { code: string; discountAmount: number } | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  if (!isOpen) return null;

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Free shipping threshold (600k)
  const freeShipThreshold = 600000;
  const progressToFreeShip = Math.min(100, (subtotal / freeShipThreshold) * 100);
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subtotal);

  // Apply promo
  const handleApplyVoucher = () => {
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'FLEUR10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedVoucher({ code: 'FLEUR10', discountAmount: discount });
      setVoucherCode('');
    } else if (code === 'WELCOME50') {
      setAppliedVoucher({ code: 'WELCOME50', discountAmount: 50000 });
      setVoucherCode('');
    } else {
      setVoucherError('Mã ưu đãi không hợp lệ. Thử code FLEUR10 hoặc WELCOME50');
    }
  };

  const finalTotal = Math.max(0, subtotal - (appliedVoucher ? appliedVoucher.discountAmount : 0));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-600" />
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Giỏ Hàng Của Bạn ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          <div className="bg-rose-50 p-3.5 border-b border-rose-100 px-6 text-xs text-stone-700">
            {remainingForFreeShip > 0 ? (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Mua thêm <span className="font-bold text-rose-700">{formatVND(remainingForFreeShip)}</span> để được <strong className="text-stone-900">MIỄN PHÍ GIAO HÀNG</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Chúc mừng! Bạn đã đủ điều kiện Miễn Phí Giao Hàng 🚚</span>
              </div>
            )}
            <div className="w-full bg-stone-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-rose-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShip}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex gap-3 relative group"
                >
                  <img
                    src={item.flower.imageUrl}
                    alt={item.flower.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-200"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm line-clamp-1 pr-4">
                          {item.flower.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-[11px] text-rose-700 font-medium block">
                        Kích thước: {item.sizeLabel}
                      </span>

                      {item.greetingCardText && (
                        <p className="text-[10px] text-stone-500 italic truncate max-w-[200px]">
                          💌 Thiệp: "{item.greetingCardText}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold text-stone-900 text-sm">
                        {formatVND(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-stone-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-sm font-medium text-stone-600">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs">Hãy khám phá bộ sưu tập hoa tươi rực rỡ nhé!</p>
              </div>
            )}
          </div>

          {/* Footer & Promo voucher */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-4">
              
              {/* Promo input */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Mã giảm giá (VD: FLEUR10)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 uppercase font-semibold"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    onClick={handleApplyVoucher}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 rounded-xl transition-colors"
                  >
                    Áp Dụng
                  </button>
                </div>
                {voucherError && <p className="text-[10px] text-red-500 mt-1">{voucherError}</p>}
                {appliedVoucher && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-200">
                    <span>Mã {appliedVoucher.code} đã áp dụng</span>
                    <span className="font-bold">-{formatVND(appliedVoucher.discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-stone-900">{formatVND(subtotal)}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Giảm giá mã Voucher:</span>
                    <span>-{formatVND(appliedVoucher.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold text-emerald-600">
                    {subtotal >= freeShipThreshold ? 'Miễn phí' : '30.000 ₫'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-rose-600 text-lg">{formatVND(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onCheckout(appliedVoucher)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
