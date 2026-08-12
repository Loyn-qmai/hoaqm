import React, { useState } from 'react';
import { FlowerItem, FlowerCategory } from '../types';
import { CATEGORIES } from '../data/flowers';
import { formatVND, convertGoogleDriveUrl } from '../utils/format';
import { getMatchingFlowerImage } from '../utils/imageMatcher';
import { AdminImportModal } from './AdminImportModal';
import { X, Plus, Edit2, Trash2, Save, RotateCcw, Check, ShieldCheck, FileSpreadsheet, Wand2, Sparkles, Tag, UploadCloud, Percent, Image as ImageIcon } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: FlowerItem[];
  onSaveFlower: (flower: FlowerItem) => void;
  onDeleteFlower: (id: string) => void;
  onResetDefault: () => void;
}

const SAMPLE_IMAGE_PRESETS = [
  { name: 'Hồng Đỏ', url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hướng Dương', url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cẩm Tú Cầu', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tulip Hồng', url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lẵng Hoa Vàng', url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lan Hồ Điệp', url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hồng Kem', url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80' },
  { name: 'Giỏ Hoa Xuân', url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hồng Trắng', url: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=800&q=80' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  flowers,
  onSaveFlower,
  onDeleteFlower,
  onResetDefault,
}) => {
  const [editingFlower, setEditingFlower] = useState<Partial<FlowerItem> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('Đã cập nhật danh sách sản phẩm thành công!');

  if (!isOpen) return null;

  const triggerNotification = (text: string) => {
    setNotificationText(text);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const handleStartCreate = () => {
    setEditingFlower({
      id: `flower-${Date.now()}`,
      name: '',
      category: 'hoa-hong',
      categoryName: 'Hoa Hồng Nhập Khẩu',
      price: 200000,
      unitQuantity: '10 cành',
      imageUrl: SAMPLE_IMAGE_PRESETS[0].url,
      description: 'Mô tả hoa tươi nhập khẩu...',
      inStock: true,
      stockCount: 10,
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (flower: FlowerItem) => {
    setEditingFlower({ ...flower });
    setIsCreatingNew(false);
  };

  const handleCategoryChange = (catId: FlowerCategory) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    setEditingFlower((prev) =>
      prev
        ? {
            ...prev,
            category: catId,
            categoryName: found ? found.name : 'Hoa Tươi',
          }
        : null
    );
  };

  const handleAutoFillAllMissingImages = () => {
    let count = 0;
    flowers.forEach((f) => {
      if (!f.imageUrl || f.imageUrl.trim() === '') {
        const autoImg = getMatchingFlowerImage(f.name, f.category);
        onSaveFlower({ ...f, imageUrl: autoImg });
        count++;
      }
    });
    if (count > 0) {
      triggerNotification(`✨ Đã tự động tìm và gán ảnh tương thích cho ${count} mẫu hoa!`);
    } else {
      triggerNotification('Tất cả sản phẩm đã có ảnh đầy đủ!');
    }
  };

  const handleBatchImport = (importedFlowers: FlowerItem[]) => {
    importedFlowers.forEach((item) => {
      onSaveFlower(item);
    });
    triggerNotification(`🎉 Đã nhập thành công ${importedFlowers.length} mẫu hoa vào hệ thống!`);
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingFlower) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditingFlower({
        ...editingFlower,
        imageUrl: reader.result as string,
      });
      triggerNotification('📸 Đã tải ảnh từ thiết bị thành công!');
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (urlStr: string) => {
    if (!editingFlower) return;
    const directUrl = convertGoogleDriveUrl(urlStr);
    setEditingFlower({
      ...editingFlower,
      imageUrl: directUrl,
    });
  };

  const handleAutoMatchSingleImage = () => {
    if (!editingFlower || !editingFlower.name) {
      alert('Vui lòng điền tên sản phẩm trước khi tìm ảnh!');
      return;
    }
    const matched = getMatchingFlowerImage(editingFlower.name, editingFlower.category || 'hoa-hong');
    setEditingFlower({
      ...editingFlower,
      imageUrl: matched,
    });
    triggerNotification('✨ Đã tìm và gán ảnh HD phù hợp nhất với tên sản phẩm!');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlower || !editingFlower.name || !editingFlower.price) {
      alert('Vui lòng nhập tên sản phẩm và giá bán!');
      return;
    }

    const salePrice = Number(editingFlower.price);
    const origPrice = editingFlower.originalPrice && Number(editingFlower.originalPrice) > salePrice
      ? Number(editingFlower.originalPrice)
      : undefined;

    const completedFlower: FlowerItem = {
      id: editingFlower.id || `flower-${Date.now()}`,
      name: editingFlower.name,
      category: editingFlower.category || 'hoa-hong',
      categoryName: editingFlower.categoryName || 'Hoa Tươi',
      price: salePrice,
      originalPrice: origPrice,
      unitQuantity: editingFlower.unitQuantity || '10 cành',
      imageUrl: editingFlower.imageUrl || getMatchingFlowerImage(editingFlower.name, editingFlower.category),
      description: editingFlower.description || '',
      inStock: editingFlower.inStock !== false,
      stockCount: editingFlower.stockCount ?? 10,
      rating: editingFlower.rating || 5.0,
      reviewsCount: editingFlower.reviewsCount || 1,
    };

    onSaveFlower(completedFlower);
    setEditingFlower(null);
    setIsCreatingNew(false);
    triggerNotification('Đã cập nhật sản phẩm thành công!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto border border-stone-200 animate-scale-in">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Trang Quản Lý Sản Phẩm - Tiệm Hoa QM</h2>
              <p className="text-xs text-stone-400">Thêm, chỉnh sửa ảnh, giá bán và số lượng cành/bó trực tiếp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Toast */}
        {showSavedNotification && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center gap-2 justify-center animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{notificationText}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50 space-y-6">

          {/* Form Editor View */}
          {editingFlower ? (
            <form onSubmit={handleSubmitForm} className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-rose-600" />
                  {isCreatingNew ? 'Thêm Mẫu Hoa Mới' : `Sửa Sản Phẩm: ${editingFlower.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingFlower(null)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium underline"
                >
                  Hủy thao tác
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tên mẫu hoa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoa Hồng Đỏ Ecuador (10 cành)"
                    value={editingFlower.name || ''}
                    onChange={(e) => setEditingFlower({ ...editingFlower, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Danh mục sản phẩm</label>
                  <select
                    value={editingFlower.category || 'hoa-hong'}
                    onChange={(e) => handleCategoryChange(e.target.value as FlowerCategory)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Giá bán thực tế (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    placeholder="200000"
                    value={editingFlower.price || ''}
                    onChange={(e) => setEditingFlower({ ...editingFlower, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500 font-bold text-rose-700"
                  />
                  {editingFlower.price ? (
                    <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">
                      {formatVND(Number(editingFlower.price))}
                    </span>
                  ) : null}
                </div>

                {/* Unit Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Số lượng cành/bó tương ứng với giá này <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 10 cành, 1 bó (15 cành)..."
                    value={editingFlower.unitQuantity || ''}
                    onChange={(e) => setEditingFlower({ ...editingFlower, unitQuantity: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Ví dụ: Mua giá 200k thì nhận được 10 cành
                  </span>
                </div>

                {/* Discount Toggle Box */}
                <div className="md:col-span-2 p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-rose-600" />
                        <span>Điều Chỉnh Chương Trình Giảm Giá / Khuyến Mãi</span>
                      </label>
                      <span className="text-[11px] text-stone-500 block">
                        Bật giảm giá để hiển thị nhãn -% và gạch ngang giá gốc trên sản phẩm
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-stone-300 hover:border-rose-400 shadow-2xs transition-all">
                      <input
                        type="checkbox"
                        checked={Boolean(editingFlower.originalPrice && editingFlower.originalPrice > (editingFlower.price || 0))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const currentPrice = Number(editingFlower.price) || 200000;
                            const defaultOriginal = Math.round((currentPrice * 1.25) / 10000) * 10000;
                            setEditingFlower({
                              ...editingFlower,
                              originalPrice: defaultOriginal,
                            });
                          } else {
                            const copy = { ...editingFlower };
                            delete copy.originalPrice;
                            setEditingFlower(copy);
                          }
                        }}
                        className="accent-rose-600 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs font-bold ${editingFlower.originalPrice && editingFlower.originalPrice > (editingFlower.price || 0) ? 'text-rose-600' : 'text-stone-600'}`}>
                        {editingFlower.originalPrice && editingFlower.originalPrice > (editingFlower.price || 0) ? '🔥 Đang Bật Giảm Giá' : '⚪ Không Giảm Giá'}
                      </span>
                    </label>
                  </div>

                  {/* Active Discount Controls */}
                  {editingFlower.originalPrice && editingFlower.originalPrice > (editingFlower.price || 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-rose-200/80 animate-fade-in">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Giá Gốc Niêm Yết Trước Khi Giảm (VNĐ)
                        </label>
                        <input
                          type="number"
                          step={10000}
                          min={Number(editingFlower.price || 0) + 10000}
                          value={editingFlower.originalPrice || ''}
                          onChange={(e) => {
                            const orig = Number(e.target.value);
                            setEditingFlower({
                              ...editingFlower,
                              originalPrice: orig,
                            });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500 bg-white font-semibold"
                        />
                        <span className="text-[10px] text-stone-500 mt-0.5 block">
                          Giá gốc: <span className="line-through">{formatVND(editingFlower.originalPrice)}</span>
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Phần Trăm Giảm Giá (%)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={95}
                            value={Math.round(((editingFlower.originalPrice - (editingFlower.price || 0)) / editingFlower.originalPrice) * 100)}
                            onChange={(e) => {
                              const pct = Math.min(95, Math.max(1, Number(e.target.value)));
                              const orig = editingFlower.originalPrice || 250000;
                              const newPrice = Math.round((orig * (1 - pct / 100)) / 5000) * 5000;
                              setEditingFlower({
                                ...editingFlower,
                                price: newPrice,
                              });
                            }}
                            className="w-24 px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500 bg-white font-bold text-rose-600"
                          />
                          <span className="text-xs font-bold text-rose-600">
                            -% Giảm
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
                          Giá bán còn: <strong>{formatVND(editingFlower.price || 0)}</strong> (Tiết kiệm {formatVND(editingFlower.originalPrice - (editingFlower.price || 0))})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Số lượng tồn kho (bó/chậu)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingFlower.stockCount ?? 10}
                    onChange={(e) => setEditingFlower({
                      ...editingFlower,
                      stockCount: Number(e.target.value),
                      inStock: Number(e.target.value) > 0,
                    })}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Out of Stock (Hết hàng) Tag Choice */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-600" />
                      <span>Tag "Hết Hàng"</span>
                    </label>
                    <span className="text-[11px] text-stone-500 block">
                      Hiển thị 🔴 HẾT HÀNG ngoài shop
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-stone-300 hover:border-rose-400 shadow-2xs transition-all">
                    <input
                      type="checkbox"
                      checked={editingFlower.inStock === false || (editingFlower.stockCount !== undefined && editingFlower.stockCount <= 0)}
                      onChange={(e) => {
                        const isOutOfStock = e.target.checked;
                        setEditingFlower({
                          ...editingFlower,
                          inStock: !isOutOfStock,
                          stockCount: isOutOfStock ? 0 : (editingFlower.stockCount && editingFlower.stockCount > 0 ? editingFlower.stockCount : 10),
                        });
                      }}
                      className="accent-rose-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`text-xs font-bold ${editingFlower.inStock === false || (editingFlower.stockCount !== undefined && editingFlower.stockCount <= 0) ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {editingFlower.inStock === false || (editingFlower.stockCount !== undefined && editingFlower.stockCount <= 0) ? '🔴 Tạm Hết' : '🟢 Còn Hàng'}
                    </span>
                  </label>
                </div>

                {/* Image Management Section */}
                <div className="md:col-span-2 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-rose-600" />
                      <span>Thêm & Quản Lý Hình Ảnh Sản Phẩm</span>
                    </label>
                    
                    <button
                      type="button"
                      onClick={handleAutoMatchSingleImage}
                      className="text-xs px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded-lg transition-colors flex items-center gap-1"
                      title="Tự động tìm ảnh hoa chất lượng cao phù hợp theo tên"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      <span>✨ Tự Động Khớp Ảnh HD</span>
                    </button>
                  </div>

                  {/* Option A: Upload File from Computer / Device */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <label className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2 shrink-0">
                      <UploadCloud className="w-4 h-4" />
                      <span>📁 Tải File Ảnh Từ Máy Tính/Điện Thoại</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-stone-500">
                      Hoặc dán đường dẫn link ảnh (Google Drive, Unsplash, Web) bên dưới
                    </span>
                  </div>

                  {/* Option B: Enter Direct / Google Drive Image URL */}
                  <div>
                    <input
                      type="url"
                      required
                      placeholder="https://... (Dán link ảnh hoặc link chia sẻ Google Drive)"
                      value={editingFlower.imageUrl || ''}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500 bg-white font-mono"
                    />
                  </div>

                  {/* Sample Image Presets */}
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">Gợi ý chọn nhanh từ kho mẫu:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLE_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setEditingFlower({ ...editingFlower, imageUrl: preset.url })}
                          className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                            editingFlower.imageUrl === preset.url
                              ? 'bg-rose-600 text-white border-rose-600 font-semibold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  {editingFlower.imageUrl && (
                    <div className="mt-2 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200">
                      <img
                        src={editingFlower.imageUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-stone-300 shadow-2xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-stone-800 block">Xem trước hình ảnh hiển thị trên cửa hàng</span>
                        <span className="text-[11px] text-stone-500 block">Ảnh được tối ưu sắc nét, co giãn chuẩn tỉ lệ 1:1.</span>
                      </div>
                    </div>
                  )}
                </div>


                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mô tả sản phẩm</label>
                  <textarea
                    rows={2}
                    placeholder="Ghi chú chi tiết loại hoa, màu sắc, xuất xứ..."
                    value={editingFlower.description || ''}
                    onChange={(e) => setEditingFlower({ ...editingFlower, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingFlower(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Sản Phẩm</span>
                </button>
              </div>
            </form>
          ) : (
            /* Product List Table Header & Actions */
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    Danh Sách Sản Phẩm Hiện Tại ({flowers.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Bấm "Chỉnh Sửa" để sửa thông tin hoặc nhập hàng loạt từ Excel / AI Ảnh / Google Sheets
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Nhập hàng loạt từ Excel, AI đọc ảnh chụp màn hình hoặc Google Sheets"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>✨ Import (Excel / AI Ảnh / GSheet)</span>
                  </button>

                  <button
                    onClick={handleAutoFillAllMissingImages}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 flex items-center gap-1.5 transition-colors"
                    title="Tự động tìm và gán hình ảnh phù hợp cho các sản phẩm chưa có ảnh"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>Tự Động Gán Ảnh Cho Hoa Chưa Có Ảnh</span>
                  </button>

                  <button
                    onClick={onResetDefault}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors"
                    title="Khôi phục danh sách mẫu ban đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục mẫu</span>
                  </button>

                  <button
                    onClick={handleStartCreate}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Hoa Mới</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100/80 text-stone-700 text-xs font-bold uppercase border-b border-stone-200">
                        <th className="py-3 px-4">Ảnh</th>
                        <th className="py-3 px-4">Tên Sản Phẩm</th>
                        <th className="py-3 px-4">Danh Mục</th>
                        <th className="py-3 px-4">Giá Bán</th>
                        <th className="py-3 px-4">Số Lượng Đi Kèm</th>
                        <th className="py-3 px-4 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs">
                      {flowers.map((flower) => (
                        <tr key={flower.id} className="hover:bg-rose-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={flower.imageUrl}
                              alt={flower.name}
                              className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                            />
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-900 max-w-xs">
                            {flower.name}
                          </td>
                          <td className="py-3 px-4 text-stone-600">
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                              {flower.categoryName}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-rose-700 text-sm">
                            {formatVND(flower.price)}
                          </td>
                          <td className="py-3 px-4 font-medium text-emerald-800 bg-emerald-50/60 rounded">
                            {flower.unitQuantity || '10 cành'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleStartEdit(flower)}
                                className="p-1.5 text-stone-700 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                title="Sửa thông tin sản phẩm"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${flower.name}"?`)) {
                                    onDeleteFlower(flower.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span>Dữ liệu được tự động sao lưu trên trình duyệt của bạn</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            Đóng Trang Quản Lý
          </button>
        </div>
      </div>

      {/* Import Sub-Modal for Excel / AI Screenshot / Google Sheets */}
      <AdminImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportFlowers={handleBatchImport}
      />
    </div>
  );
};
