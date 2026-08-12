import React, { useState } from 'react';
import { Wand2, X, Check, Sparkles, Plus, Minus, Flower, ShoppingBag } from 'lucide-react';
import { BOKET_WRAPPERS, RIBBONS, MAIN_FLOWERS_OPTIONS, SECONDARY_FLOWERS_OPTIONS } from '../data/flowers';
import { formatVND } from '../utils/format';

interface CustomBouquetBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customCartItem: any) => void;
}

export const CustomBouquetBuilder: React.FC<CustomBouquetBuilderProps> = ({
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedMainFlower, setSelectedMainFlower] = useState(MAIN_FLOWERS_OPTIONS[0]);
  const [mainFlowerQty, setMainFlowerQty] = useState(12);
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([
    SECONDARY_FLOWERS_OPTIONS[0].id,
    SECONDARY_FLOWERS_OPTIONS[3].id,
  ]);
  const [selectedWrapper, setSelectedWrapper] = useState(BOKET_WRAPPERS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBONS[0]);
  const [cardMessage, setCardMessage] = useState('');

  if (!isOpen) return null;

  // Calculate prices
  const mainFlowerCost = selectedMainFlower.unitPrice * mainFlowerQty;
  const secondaryCost = selectedSecondary.reduce((sum, id) => {
    const item = SECONDARY_FLOWERS_OPTIONS.find((s) => s.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const wrapperCost = selectedWrapper.extraPrice;
  const baseServiceFee = 120000; // công florist cắm hoa & phụ kiện
  const totalCost = mainFlowerCost + secondaryCost + wrapperCost + baseServiceFee;

  const toggleSecondary = (id: string) => {
    if (selectedSecondary.includes(id)) {
      setSelectedSecondary(selectedSecondary.filter((i) => i !== id));
    } else {
      setSelectedSecondary([...selectedSecondary, id]);
    }
  };

  const handleAddCustomToCart = () => {
    const secondaryNames = selectedSecondary
      .map((id) => SECONDARY_FLOWERS_OPTIONS.find((s) => s.id === id)?.name)
      .filter(Boolean) as string[];

    const customFlowerItem = {
      id: `custom-bouquet-${Date.now()}`,
      name: `Bó Hoa Tự Phối - ${selectedMainFlower.name} (${mainFlowerQty} bông)`,
      category: 'hoa-hong',
      categoryName: 'Tự Phối Bó Hoa DIY',
      occasion: ['birthday', 'love'],
      occasionNames: ['Theo Tự Chọn'],
      price: totalCost,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
      description: `Bó hoa tự thiết kế với ${mainFlowerQty} ${selectedMainFlower.name}, hoa phụ ${secondaryNames.join(', ')}, giấy gói ${selectedWrapper.name}.`,
      meaning: 'Sáng tạo riêng biệt mang dấu ấn cá nhân độc đáo.',
      flowersIncluded: [
        `${mainFlowerQty} ${selectedMainFlower.name}`,
        ...secondaryNames,
        `Giấy gói: ${selectedWrapper.name}`,
        `Nơ thắt: ${selectedRibbon.name}`,
      ],
      tags: ['Tự thiết kế DIY', 'Độc bản'],
      inStock: true,
    };

    onAddToCart({
      id: `cart-custom-${Date.now()}`,
      flower: customFlowerItem,
      size: 'standard',
      sizeLabel: 'Tiêu chuẩn DIY',
      unitPrice: totalCost,
      quantity: 1,
      greetingCardText: cardMessage,
      ribbonColor: selectedRibbon.name,
      isCustomBouquet: true,
      customDetails: {
        mainFlowers: [`${mainFlowerQty} ${selectedMainFlower.name}`],
        secondaryFlowers: secondaryNames,
        wrapperColor: selectedWrapper.name,
        ribbonColor: selectedRibbon.name,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-100 relative my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-rose-950 text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
            <Wand2 className="w-4 h-4" />
            <span>Xưởng Sáng Tạo Fleur Studio</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Tự Thiết Kế Bó Hoa Theo Ý Thích (DIY)</h2>
          <p className="text-stone-300 text-xs sm:text-sm font-light mt-1">
            Tự tay lựa chọn bông hoa, sắc màu giấy gói và nơ thắt. Florist chuyên nghiệp sẽ hoàn thiện theo đúng ý bạn!
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns (Steps 1 to 4) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Main Flower */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  Chọn loài hoa chủ đạo:
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                {MAIN_FLOWERS_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedMainFlower(f)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      selectedMainFlower.id === f.id
                        ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 text-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-2xl">{f.img}</span>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold block truncate">{f.name}</span>
                      <span className="text-[10px] text-stone-500">{formatVND(f.unitPrice)}/bông</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Flower Quantity slider */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-800">Số lượng bông chủ đạo:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMainFlowerQty(Math.max(5, mainFlowerQty - 1))}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif font-bold text-rose-700 text-base">{mainFlowerQty} Bông</span>
                  <button
                    onClick={() => setMainFlowerQty(mainFlowerQty + 1)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Secondary Flowers */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                Chọn hoa phụ & Phụ kiện điểm xuyết:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECONDARY_FLOWERS_OPTIONS.map((sf) => {
                  const isChecked = selectedSecondary.includes(sf.id);
                  return (
                    <button
                      key={sf.id}
                      onClick={() => toggleSecondary(sf.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-rose-50 border-rose-500 text-rose-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-semibold">{sf.name}</span>
                      </div>
                      <span className="text-[11px] font-medium text-stone-500">+{formatVND(sf.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Wrapper Paper & Ribbon */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  Chọn màu giấy gói:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BOKET_WRAPPERS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWrapper(w)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        selectedWrapper.id === w.id
                          ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: w.colorHex }}
                      />
                      <span className="text-xs font-medium truncate">{w.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  Màu nơ thắt:
                </span>
                <div className="flex flex-wrap gap-2">
                  {RIBBONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRibbon(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        selectedRibbon.id === r.id
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.colorHex }} />
                      <span>{r.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Greeting card */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                4. Thiệp lời chúc đi kèm (Miễn phí):
              </label>
              <textarea
                rows={2}
                placeholder="Nhập câu chúc bạn muốn viết lên thiệp tay..."
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 text-stone-800"
              />
            </div>
          </div>

          {/* Right Column: Live Price Summary & Preview Card */}
          <div className="bg-stone-900 text-white p-6 rounded-2xl flex flex-col justify-between border border-stone-800">
            <div>
              <div className="border-b border-stone-800 pb-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  BẢNG TÓM TẮT THIẾT KẾ
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-100">Bó Hoa Độc Bản Của Bạn</h3>
              </div>

              {/* Specs Breakdown */}
              <div className="space-y-3 text-xs text-stone-300 mb-6">
                <div className="flex justify-between">
                  <span>Hoa chính ({mainFlowerQty} bông):</span>
                  <span className="font-semibold text-stone-100">{formatVND(mainFlowerCost)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Hoa phụ ({selectedSecondary.length} loại):</span>
                  <span className="font-semibold text-stone-100">{formatVND(secondaryCost)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Giấy gói & Nơ:</span>
                  <span className="font-semibold text-stone-100">
                    {wrapperCost > 0 ? formatVND(wrapperCost) : 'Miễn phí'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Phí thiết kế & cắm hoa:</span>
                  <span className="font-semibold text-stone-100">{formatVND(baseServiceFee)}</span>
                </div>
              </div>

              {/* Recipe Checklist */}
              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 mb-6 text-xs space-y-1.5">
                <span className="text-amber-300 font-semibold block mb-1">✨ Phối công thức:</span>
                <p className="text-stone-200">🌹 {mainFlowerQty} {selectedMainFlower.name}</p>
                <p className="text-stone-300 text-[11px]">
                  🌿 {selectedSecondary.map((id) => SECONDARY_FLOWERS_OPTIONS.find((s) => s.id === id)?.name).join(', ')}
                </p>
                <p className="text-stone-400 text-[11px]">🎨 {selectedWrapper.name} + {selectedRibbon.name}</p>
              </div>
            </div>

            {/* Total Price & Add Button */}
            <div>
              <div className="pt-4 border-t border-stone-800 flex items-baseline justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">TỔNG CỘNG:</span>
                <span className="font-serif font-bold text-2xl text-amber-300">{formatVND(totalCost)}</span>
              </div>

              <button
                onClick={handleAddCustomToCart}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Hoàn Tất & Thêm Giỏ Hàng</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
