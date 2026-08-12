import React from 'react';
import { Sparkles, Clock, ShieldCheck, HeartHandshake, ArrowRight, Wand2 } from 'lucide-react';
import heroImg from '../assets/images/fleur_hero_banner_1786502262453.jpg';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCustomBuilderClick: () => void;
  onGiftAdvisorClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onCustomBuilderClick,
  onGiftAdvisorClick,
}) => {
  return (
    <section className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Fleur Studio Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>BST Hoa Tươi Nhập Khẩu Mới Về Sáng Nay</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-50 leading-[1.15] mb-6">
            Trao Gửi Yêu Thương <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-200 to-rose-200">
              Qua Những Bó Hoa Tươi
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light mb-8 max-w-xl">
            Từng cành hoa được tuyển chọn tỉ mỉ trong ngày, phối cắm tinh tế bởi các florist tài hoa.
            Trao trọn cảm xúc đến người thân yêu cùng dịch vụ giao hoa nhanh trong 2 giờ.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onExploreClick}
              className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-6 py-3.5 rounded-full shadow-lg shadow-rose-900/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Xem Ngay BST Hoa</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCustomBuilderClick}
              className="bg-stone-800/90 hover:bg-stone-700 text-amber-200 border border-amber-400/30 font-medium px-6 py-3.5 rounded-full backdrop-blur-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Tự Bó Hoa Theo Ý Thích</span>
            </button>

            <button
              onClick={onGiftAdvisorClick}
              className="text-stone-300 hover:text-white underline underline-offset-4 text-sm font-medium px-2 py-2"
            >
              Chưa biết chọn hoa gì? 👉
            </button>
          </div>
        </div>

        {/* Feature badges row */}
        <div className="mt-16 pt-8 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-300">
          <div className="flex items-center gap-3.5 bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Giao Hỏa Tốc 2h</h4>
              <p className="text-xs text-stone-400">Giao đúng giờ hẹn tại nội thành</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">100% Hoa Tươi Trong Ngày</h4>
              <p className="text-xs text-stone-400">Cam kết hoa tươi kéo dài 5-7 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800 backdrop-blur-xs">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Thiệp Handcrafted Miễn Phí</h4>
              <p className="text-xs text-stone-400">Viết lời chúc cá nhân hóa cẩn thận</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
