import React, { useState } from 'react';
import { Sparkles, X, Heart, Gift, User, DollarSign, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { FlowerItem } from '../types';
import { formatVND } from '../utils/format';

interface GiftAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allFlowers: FlowerItem[];
  onSelectFlower: (flower: FlowerItem) => void;
}

export const GiftAdvisorModal: React.FC<GiftAdvisorModalProps> = ({
  isOpen,
  onClose,
  allFlowers,
  onSelectFlower,
}) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 3000000]);

  if (!isOpen) return null;

  const recipientsList = [
    { id: 'lover', label: 'Người Yêu / Vợ', icon: '💖', desc: 'Ngọt ngào, lãng mạn, tinh tế' },
    { id: 'mother', label: 'Mẹ / Thầy Cô / Người Lớn Tuổi', icon: '🌸', desc: 'Trang trọng, ấm áp, tri ân' },
    { id: 'friend', label: 'Bạn Bè / Đồng Nghiệp', icon: '🌻', desc: 'Tươi vui, rạng rỡ, thân thiện' },
    { id: 'boss', label: 'Sếp / Đối Tác', icon: '👑', desc: 'Sang trọng, đẳng cấp, ấn tượng' },
  ];

  const occasionsList = [
    { id: 'birthday', label: 'Sinh Nhật', icon: '🎂' },
    { id: 'love', label: 'Kỷ Niệm / Tỏ Tình', icon: '🌹' },
    { id: 'opening', label: 'Khai Trương / Thăng Tiến', icon: '🎉' },
    { id: 'thanks', label: 'Cảm Ơn / Tri Ân', icon: '💌' },
  ];

  const budgetList = [
    { id: 'b1', label: 'Dưới 700.000đ', range: [0, 700000] as [number, number] },
    { id: 'b2', label: '700.000đ - 1.200.000đ', range: [700000, 1200000] as [number, number] },
    { id: 'b3', label: 'Trên 1.200.000đ', range: [1200000, 5000000] as [number, number] },
  ];

  // Recommendations calculation
  const recommendedFlowers = allFlowers.filter((f) => {
    if (f.price < budget[0] || f.price > budget[1]) return false;
    if (occasion && !f.occasion.includes(occasion as any)) return false;
    return true;
  }).slice(0, 3);

  const handleReset = () => {
    setStep(1);
    setRecipient('');
    setOccasion('');
    setBudget([0, 3000000]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Trợ Lý Lựa Chọn Hoa Thông Minh</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {step < 4 ? 'Tìm Bó Hoa Phù Hợp Nhất' : 'Gợi Ý Mẫu Hoa Hoàn Hảo'}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Chỉ với 3 bước đơn giản để tìm mẫu hoa thể hiện trọn vẹn thông điệp của bạn.
          </p>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                step === s
                  ? 'w-8 bg-rose-600'
                  : step > s
                  ? 'w-4 bg-rose-300'
                  : 'w-4 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Recipient */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider text-center">
              Bước 1: Bạn muốn tặng hoa cho ai?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipientsList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRecipient(r.id);
                    setStep(2);
                  }}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all group flex items-start gap-3"
                >
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-rose-700">{r.label}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Occasion */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider text-center">
              Bước 2: Tặng vào dịp đặc biệt nào?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {occasionsList.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOccasion(o.id);
                    setStep(3);
                  }}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all group flex items-center gap-3"
                >
                  <span className="text-2xl">{o.icon}</span>
                  <span className="font-bold text-sm text-stone-900 group-hover:text-rose-700">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Budget */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider text-center">
              Bước 3: Ngân sách dự kiến của bạn?
            </h3>
            <div className="space-y-2.5">
              {budgetList.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBudget(b.range);
                    setStep(4);
                  }}
                  className="w-full p-4 rounded-2xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all font-bold text-sm text-stone-800 hover:text-rose-700 flex items-center justify-between"
                >
                  <span>{b.label}</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Results Recommendations */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl text-xs text-stone-600">
              <span>Gợi ý dựa trên tiêu chí của bạn</span>
              <button
                onClick={handleReset}
                className="text-rose-600 font-bold flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Thử lại
              </button>
            </div>

            {recommendedFlowers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedFlowers.map((flower) => (
                  <div
                    key={flower.id}
                    onClick={() => {
                      onSelectFlower(flower);
                      onClose();
                    }}
                    className="group bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-3 cursor-pointer shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-1/1 w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
                      <img
                        src={flower.imageUrl}
                        alt={flower.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug mb-1">
                        {flower.name}
                      </h4>
                      <span className="font-bold text-rose-700 text-sm block">
                        {formatVND(flower.price)}
                      </span>
                    </div>
                    <button className="mt-3 w-full bg-stone-900 group-hover:bg-rose-600 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors">
                      Chọn Mẫu Phù Hợp
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-stone-600 text-sm mb-4">Không tìm thấy mẫu phù hợp chính xác với mức giá này.</p>
                <button
                  onClick={handleReset}
                  className="bg-stone-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full"
                >
                  Chọn Lại Ngân Sách Khác
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
