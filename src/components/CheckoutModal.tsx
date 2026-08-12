import React, { useState } from 'react';
import { X, CheckCircle2, Truck, CreditCard, Calendar, Clock, QrCode, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CartItem } from '../types';
import { formatVND } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedVoucher: { code: string; discountAmount: number } | null;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedVoucher,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [orderCode, setOrderCode] = useState('');

  // Form states
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [senderName, setSenderName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Giao hỏa tốc trong 2 giờ');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'momo'>('vietqr');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const discount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const shippingFee = subtotal >= 600000 ? 0 : 30000;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `FLEUR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    setStep('success');
  };

  const handleFinish = () => {
    onOrderSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-6 border-b border-stone-100 pb-4">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
                HOÀN TẤT ĐƠN HÀNG
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Thông Tin Giao Hoa & Thanh Toán
              </h2>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Receiver Info Group */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-rose-600" />
                  1. Thông tin người nhận hoa:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Họ tên người nhận *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Thị Hoa"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Địa chỉ giao hoa chi tiết *</label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện..."
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Tên người gửi (để trống nếu muốn tặng ẩn danh)</label>
                  <input
                    type="text"
                    placeholder="Tên của bạn hoặc 'Một người giấu tên'"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Delivery Schedule Group */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  2. Lịch giao hoa mong muốn:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Ngày giao hoa</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Khung giờ giao</label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Giao hỏa tốc trong 2 giờ">⚡ Giao hỏa tốc trong 2 giờ</option>
                      <option value="Sáng (08:00 - 11:30)">🌅 Buổi Sáng (08:00 - 11:30)</option>
                      <option value="Chiều (13:30 - 17:30)">☀️ Buổi Chiều (13:30 - 17:30)</option>
                      <option value="Tối (18:00 - 20:30)">🌙 Buổi Tối (18:00 - 20:30)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  3. Phương thức thanh toán:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'vietqr', name: 'VietQR Chuyển Khoản', desc: 'Quét QR tự động' },
                    { id: 'momo', name: 'Ví Momo', desc: 'Thanh toán ví điện tử' },
                    { id: 'cod', name: 'Thanh toán COD', desc: 'Thanh toán khi nhận' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === m.id
                          ? 'bg-rose-50 border-rose-600 ring-1 ring-rose-600 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="block text-xs font-bold">{m.name}</span>
                      <span className="block text-[10px] text-stone-500">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total & Submit */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Tổng thanh toán:</span>
                  <span className="font-serif font-bold text-2xl text-rose-700">{formatVND(totalAmount)}</span>
                </div>

                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-lg shadow-rose-900/20 transition-all"
                >
                  Xác Nhận Đặt Hàng
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation Success State */
          <div className="text-center py-6 space-y-6 animate-scale-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                ĐẶT HÀNG THÀNH CÔNG
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Cảm Ơn Bạn Đã Chọn Fleur Studio!
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                Mã đơn hàng của bạn là <strong className="text-rose-600">{orderCode}</strong>. Chúng tôi đã gửi xác nhận đến số điện thoại người nhận.
              </p>
            </div>

            {/* QR Mock code if VietQR */}
            {paymentMethod === 'vietqr' && (
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 inline-block text-center max-w-sm mx-auto">
                <span className="text-xs font-bold text-stone-800 block mb-2">Quét mã VietQR để hoàn tất thanh toán:</span>
                <div className="bg-white p-3 rounded-xl border border-stone-200 inline-block mb-2 shadow-2xs">
                  <div className="w-36 h-36 bg-stone-900 text-white flex flex-col items-center justify-center rounded-lg p-2 text-center text-xs">
                    <QrCode className="w-16 h-16 text-rose-300 mb-1" />
                    <span className="font-mono text-[10px] text-stone-300">MBBANK - 0382998899</span>
                    <span className="font-bold text-amber-300">{formatVND(totalAmount)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-500">
                  Nội dung chuyển khoản: <strong className="text-stone-900">{orderCode}</strong>
                </p>
              </div>
            )}

            {/* Summary List */}
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-left text-xs text-stone-700 max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span>Người nhận:</span>
                <strong className="text-stone-900">{receiverName} ({receiverPhone})</strong>
              </div>
              <div className="flex justify-between">
                <span>Địa chỉ giao:</span>
                <span className="text-stone-900 font-medium truncate max-w-[200px]">{receiverAddress}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian:</span>
                <span className="text-rose-700 font-bold">{deliveryTimeSlot} ({deliveryDate})</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-8 rounded-full text-xs sm:text-sm shadow-md"
            >
              Trở Về Trang Chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
