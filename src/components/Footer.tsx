import React, { useState } from 'react';
import { Flower2, Phone, Clock, Heart, Quote, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

const FLOWER_QUOTES = [
  {
    quote: 'Mỗi đóa hoa nở rộ chính là một linh hồn mỉm cười với thiên nhiên.',
    author: 'Gérard de Nerval',
  },
  {
    quote: 'Hoa không so sánh mình với bông hoa bên cạnh. Nó chỉ đơn giản là tỏa hương và nở rộ.',
    author: 'Zen Proverb',
  },
  {
    quote: 'Trao đi một nhành hoa tươi, lưu giữ trọn vẹn chân tình và khoảnh khắc yêu thương.',
    author: 'Hoa Tươi QM',
  },
  {
    quote: 'Sự dịu dàng của cánh hoa là ngôn ngữ tinh tế nhất gửi gắm tâm tư.',
    author: 'Cảm hứng hoa tươi',
  },
];

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [adminHintToast, setAdminHintToast] = useState<string | null>(null);

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);

    if (nextCount >= 5) {
      setLogoClicks(0);
      setAdminHintToast('🔓 Đã kích hoạt trang Admin Quản Lý!');
      if (onOpenAdmin) {
        onOpenAdmin();
      }
      setTimeout(() => setAdminHintToast(null), 3000);
    } else if (nextCount >= 2) {
      setAdminHintToast(`Bấm thêm ${5 - nextCount} lần nữa để mở trang Admin`);
      setTimeout(() => setAdminHintToast(null), 2000);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 text-xs sm:text-sm pt-16 pb-10 border-t border-stone-800 relative select-none">
      
      {/* Toast Alert for Admin Unlock */}
      {adminHintToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>{adminHintToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-stone-800/80">
          
          {/* Brand & Contact (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Logo with Secret Admin Trigger */}
            <div
              onClick={handleLogoClick}
              className="inline-flex items-center gap-3 cursor-pointer group p-1.5 -ml-1.5 rounded-xl hover:bg-stone-900/60 transition-all active:scale-95"
              title="Nhấp 5 lần liên tiếp để mở Trang Admin Quản Lý"
            >
              <div className="w-11 h-11 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 group-hover:scale-105 group-hover:bg-rose-900 transition-all shadow-inner">
                <Flower2 className="w-6 h-6 animate-spin-slow text-rose-400" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-tight">
                  Hoa Tươi <span className="text-rose-500 font-sans font-extrabold text-2xl">QM</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-stone-400 font-medium block">
                  Trang Trí • Sự Kiện • Ngày Lễ
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed">
              Tiệm Hoa Tươi QM chuyên trang trí hoa tươi nghệ thuật, sự kiện, tiệc cưới và các ngày lễ tại Hà Nội. Cam kết hoa tươi nhập trong ngày, ảnh thật 100%, niêm yết rõ số lượng cành và giao hoa tận nơi cấp tốc.
            </p>

            {/* Hotline & Hours Details */}
            <div className="space-y-2.5 text-xs text-stone-300 pt-2 border-t border-stone-900">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Hotline / Zalo đặt hoa: <a href="tel:0344447914" className="text-rose-400 hover:text-rose-300 font-bold text-sm ml-1 underline decoration-rose-500/40">0344 447 914</a>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Giờ mở cửa: 07:00 - 21:00 (Tất cả các ngày trong tuần)</span>
              </div>
            </div>
          </div>

          {/* Quotes & Meaningful Flower Sayings Section (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
                Cảm Hứng & Thông Điệp Của Hoa
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FLOWER_QUOTES.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-stone-900/80 border border-stone-800/80 p-3.5 rounded-2xl flex flex-col justify-between hover:border-stone-700 transition-colors"
                >
                  <Quote className="w-4 h-4 text-rose-500/60 mb-1 shrink-0" />
                  <p className="text-[11px] text-stone-300 italic leading-relaxed mb-2">
                    "{q.quote}"
                  </p>
                  <span className="text-[10px] font-semibold text-rose-400 text-right block uppercase tracking-wide">
                    — {q.author}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info & Guarantees (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-3">
              Cam Kết Từ Hoa Tươi QM
            </h4>

            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>100% Hoa tươi mới nhập cành trong ngày</span>
              </li>
              <li className="flex items-center gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>Ảnh chụp hoa thật trước khi giao hàng</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-xs gap-4">
          <p>© 2026 Tiệm Hoa Tươi QM (Hà Nội). Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-1.5 text-stone-400">
            <span>Thực hiện với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>cho thương hiệu Hoa Tươi QM</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
