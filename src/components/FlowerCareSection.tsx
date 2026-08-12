import React from 'react';
import { Scissors, Droplets, SunMedium, Sparkles, ShieldAlert } from 'lucide-react';

export const FlowerCareSection: React.FC = () => {
  const tips = [
    {
      icon: <Scissors className="w-6 h-6 text-rose-600" />,
      title: 'Cắt cành chéo 45 độ',
      desc: 'Dùng kéo sắc cắt gốc cành hoa một góc 45 độ dưới vòi nước chảy để diện tích hút nước của gốc cành đạt tối đa.',
    },
    {
      icon: <Droplets className="w-6 h-6 text-rose-600" />,
      title: 'Thay nước sạch mỗi ngày',
      desc: 'Thay nước bình mỗi sáng, rửa sạch gốc cành và bình hoa để ngăn ngừa vi khuẩn sinh sôi gây thối gốc.',
    },
    {
      icon: <SunMedium className="w-6 h-6 text-rose-600" />,
      title: 'Tránh ánh nắng trực tiếp',
      desc: 'Đặt bình hoa ở nơi mát mẻ, tránh luồng gió điều hòa thổi trực tiếp hoặc ánh nắng gắt chiếu vào làm héo cánh.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      title: 'Dùng dưỡng hoa Chrysal',
      desc: 'Hòa tan 1 gói thuốc dưỡng hoa tặng kèm vào nước cắm giúp duy trì hoa tươi lâu từ 7 đến 10 ngày.',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-stone-50 to-rose-50/30 border-y border-rose-100/80 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">
            BÍ QUYẾT TỪ FLORIST
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Cẩm Nang Giữ Hoa Tươi Dài Lâu
          </h2>
          <p className="text-stone-600 mt-2 text-sm sm:text-base font-light">
            Một vài mẹo nhỏ giúp bình hoa tươi thắm rực rỡ suốt cả tuần trong ngôi nhà bạn.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-rose-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                  {tip.icon}
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">{tip.title}</h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
