import React, { useState } from 'react';
import Papa from 'papaparse';
import { FlowerItem, FlowerCategory } from '../types';
import { getMatchingFlowerImage } from '../utils/imageMatcher';
import { formatVND, convertGoogleDriveUrl } from '../utils/format';
import {
  X,
  FileSpreadsheet,
  FileImage,
  Link2,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Clipboard,
  Wand2,
} from 'lucide-react';

interface AdminImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFlowers: (newFlowers: FlowerItem[]) => void;
}

export const AdminImportModal: React.FC<AdminImportModalProps> = ({
  isOpen,
  onClose,
  onImportFlowers,
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'screenshot' | 'gsheet'>('excel');

  // Excel / CSV State
  const [pastedText, setPastedText] = useState('');
  
  // Screenshot State
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotMime, setScreenshotMime] = useState<string>('image/png');
  const [isParsingAI, setIsParsingAI] = useState(false);

  // Google Sheets State
  const [gsheetUrl, setGsheetUrl] = useState('');
  const [isLoadingGsheet, setIsLoadingGsheet] = useState(false);

  // Parsed Preview Items
  const [previewItems, setPreviewItems] = useState<Partial<FlowerItem>[]>([]);
  const [autoMatchMissingImages, setAutoMatchMissingImages] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to map category name/keyword to internal category ID
  const mapCategory = (rawCat?: string): FlowerCategory => {
    const text = (rawCat || '').toLowerCase();
    if (text.includes('lẵng') || text.includes('lang')) return 'lang-hoa';
    if (text.includes('giỏ') || text.includes('gio') || text.includes('basket')) return 'gio-hoa';
    if (text.includes('lan') || text.includes('hồ điệp')) return 'hoa-lan';
    if (text.includes('tú cầu') || text.includes('cam-tu-cau')) return 'cam-tu-cau';
    if (text.includes('hướng dương') || text.includes('huong-duong')) return 'huong-duong';
    if (text.includes('tulip')) return 'tulip';
    return 'hoa-hong';
  };

  // Helper to sanitize price strings (e.g. "350k" -> 350000, "1.200.000đ" -> 1200000)
  const parsePrice = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 200000;
    let str = String(val).toLowerCase().trim();
    if (str.includes('k')) {
      const num = parseFloat(str.replace('k', ''));
      return isNaN(num) ? 200000 : Math.round(num * 1000);
    }
    if (str.includes('tr') || str.includes('m')) {
      const num = parseFloat(str.replace(/tr|m/g, ''));
      return isNaN(num) ? 200000 : Math.round(num * 1000000);
    }
    // Remove non-digit chars
    const cleaned = str.replace(/[^\d]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 200000 : num;
  };

  // Process raw rows (CSV/Excel array objects)
  const processRawRows = (rows: Record<string, any>[]) => {
    const items: Partial<FlowerItem>[] = [];

    rows.forEach((row, idx) => {
      // Find matching keys flexibly
      const nameKey = Object.keys(row).find((k) =>
        /tên|name|sản phẩm|mẫu hoa/i.test(k)
      ) || Object.keys(row)[0];

      const priceKey = Object.keys(row).find((k) =>
        /giá|price|đơn giá|tiền/i.test(k)
      );

      const unitKey = Object.keys(row).find((k) =>
        /số lượng|cành|bó|đơn vị|unit/i.test(k)
      );

      const catKey = Object.keys(row).find((k) =>
        /danh mục|loại|category/i.test(k)
      );

      const descKey = Object.keys(row).find((k) =>
        /mô tả|ghi chú|desc/i.test(k)
      );

      const imageKey = Object.keys(row).find((k) =>
        /ảnh|hình|image|url|link/i.test(k)
      );

      const rawName = row[nameKey];
      if (!rawName || String(rawName).trim() === '') return;

      const name = String(rawName).trim();
      const price = parsePrice(row[priceKey || '']);
      const unitQuantity = row[unitKey] ? String(row[unitKey]).trim() : '10 cành';
      const category = mapCategory(row[catKey]);
      const description = row[descKey] ? String(row[descKey]).trim() : 'Hoa tươi chọn lọc nhập mới trong ngày';
      const rawImgUrl = row[imageKey] ? String(row[imageKey]).trim() : '';
      const imageUrl = convertGoogleDriveUrl(rawImgUrl);

      items.push({
        id: `imported-${Date.now()}-${idx}`,
        name,
        price,
        unitQuantity,
        category,
        categoryName: category === 'lang-hoa' ? 'Lẵng Hoa' : category === 'gio-hoa' ? 'Giỏ Hoa' : 'Hoa Tươi',
        description,
        imageUrl,
        inStock: true,
        stockCount: 15,
      });
    });

    if (items.length === 0) {
      setErrorMessage('Không tìm thấy dữ liệu sản phẩm phù hợp. Hãy kiểm tra lại cấu trúc bảng!');
    } else {
      setErrorMessage(null);
      setPreviewItems(items);
    }
  };

  // 1. Handle Excel/CSV File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processRawRows(results.data as Record<string, any>[]);
      },
      error: (err) => {
        setErrorMessage('Lỗi khi đọc file CSV/Excel: ' + err.message);
      },
    });
  };

  // Handle Pasted Text Table
  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    Papa.parse(pastedText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          processRawRows(results.data as Record<string, any>[]);
        } else {
          // Retry without header mode
          Papa.parse(pastedText, {
            skipEmptyLines: true,
            complete: (res2) => {
              const rows = res2.data as string[][];
              const parsedObjs = rows.map((r) => ({
                'Tên hoa': r[0] || '',
                'Giá': r[1] || '',
                'Số lượng': r[2] || '',
                'Mô tả': r[3] || '',
              }));
              processRawRows(parsedObjs);
            },
          });
        }
      },
    });
  };

  // 2. Handle AI Screenshot Upload / File Reader
  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScreenshotMime(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Clipboard Image Paste
  const handlePasteClipboardImage = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            setScreenshotMime(type);
            const reader = new FileReader();
            reader.onload = () => {
              setScreenshotBase64(reader.result as string);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      alert('Không tìm thấy hình ảnh nào trong khay nhớ tạm (clipboard). Hãy chụp màn hình và thử lại!');
    } catch (err) {
      alert('Hãy sử dụng tổ hợp phím Ctrl+V (hoặc Cmd+V) hoặc chọn file ảnh trực tiếp!');
    }
  };

  // Call Gemini API server route for Screenshot Analysis
  const handleParseScreenshotWithAI = async () => {
    if (!screenshotBase64) return;
    setIsParsingAI(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/parse-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: screenshotBase64,
          mimeType: screenshotMime,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Phân tích ảnh thất bại');
      }

      const items = (data.items || []).map((item: any, idx: number) => ({
        id: `ai-parsed-${Date.now()}-${idx}`,
        name: item.name || 'Hoa Tươi',
        price: Number(item.price) || 250000,
        unitQuantity: item.unitQuantity || '10 cành',
        category: mapCategory(item.category),
        categoryName: item.category === 'lang-hoa' ? 'Lẵng Hoa' : item.category === 'gio-hoa' ? 'Giỏ Hoa' : 'Hoa Tươi',
        description: item.description || 'Sản phẩm đọc từ ảnh chụp màn hình',
        imageUrl: item.imageUrl || '',
        inStock: true,
        stockCount: 10,
      }));

      if (items.length === 0) {
        setErrorMessage('AI không tìm thấy thông tin sản phẩm hoa nào trong ảnh này. Vui lòng chụp lại ảnh rõ nét hơn!');
      } else {
        setPreviewItems(items);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi kết nối dịch vụ AI đọc ảnh.');
    } finally {
      setIsParsingAI(false);
    }
  };

  // 3. Handle Google Sheets Fetch
  const handleFetchGsheet = async () => {
    if (!gsheetUrl.trim()) return;
    setIsLoadingGsheet(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/fetch-gsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: gsheetUrl }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Không thể tải Google Sheet');
      }

      Papa.parse(data.csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processRawRows(results.data as Record<string, any>[]);
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải dữ liệu từ Google Sheet.');
    } finally {
      setIsLoadingGsheet(false);
    }
  };

  // Final Confirmation of Imported Items
  const handleConfirmImport = () => {
    if (previewItems.length === 0) return;

    const finalFlowers: FlowerItem[] = previewItems.map((item) => {
      // If image is missing or user checked autoMatch, fill with matching image
      let finalImg = item.imageUrl || '';
      if (!finalImg || autoMatchMissingImages) {
        finalImg = getMatchingFlowerImage(item.name || '', item.category);
      }

      return {
        id: item.id || `imported-${Date.now()}-${Math.random()}`,
        name: item.name || 'Hoa Tươi QM',
        category: item.category || 'hoa-hong',
        categoryName: item.categoryName || 'Hoa Tươi',
        price: item.price || 200000,
        unitQuantity: item.unitQuantity || '10 cành',
        imageUrl: finalImg,
        description: item.description || '',
        inStock: true,
        stockCount: 10,
        rating: 5.0,
        reviewsCount: 1,
      };
    });

    onImportFlowers(finalFlowers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto border border-stone-200 animate-scale-in">
        
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-600 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Nhập Hàng Hàng Loạt (Import)</h2>
              <p className="text-xs text-stone-400">
                Tự động trích xuất hoa từ Excel, Ảnh chụp màn hình AI, hoặc Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="bg-stone-100 p-2 flex gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('excel')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'excel'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>File Excel / CSV / Bảng</span>
          </button>

          <button
            onClick={() => setActiveTab('screenshot')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'screenshot'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <FileImage className="w-4 h-4 text-rose-600" />
            <span>AI Đọc Ảnh Chụp Màn Hình</span>
          </button>

          <button
            onClick={() => setActiveTab('gsheet')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'gsheet'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>Link Google Sheets</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50 space-y-6">

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab 1: Excel / CSV File & Pasted Text */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="font-serif font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>Cách 1: Tải lên File Excel (.xlsx, .csv, .tsv)</span>
                </h3>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls, .tsv, .txt"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="font-serif font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-stone-600" />
                  <span>Cách 2: Dán bảng copy từ Excel hoặc Google Sheets</span>
                </h3>
                <textarea
                  rows={4}
                  placeholder={`Dán các dòng copy từ bảng tính Excel vào đây, ví dụ:\nTên hoa\tGiá\tSố lượng cành\nHồng Đỏ Ecuador\t350000\t10 cành\nBó Hướng Dương\t250000\t1 bó`}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:outline-none focus:border-rose-500 font-mono"
                />
                <button
                  onClick={handleParsePastedText}
                  disabled={!pastedText.trim()}
                  className="mt-3 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Phân Tích Dữ Liệu Dán
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: AI Screenshot Analysis */}
          {activeTab === 'screenshot' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm mb-1 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>AI Tự Đọc Ảnh Chụp Màn Hình (Screenshot Vision)</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Tải lên hoặc dán ảnh chụp màn hình bảng giá, bài viết bán hàng, đơn hàng viết tay... AI sẽ tự động bóc tách danh sách hoa tươi.
                </p>
              </div>

              {/* Upload or Clipboard buttons */}
              <div className="flex flex-wrap gap-3">
                <label className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  <span>Chọn File Ảnh Chụp Màn Hình</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handlePasteClipboardImage}
                  type="button"
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Clipboard className="w-4 h-4 text-stone-600" />
                  <span>Dán Ảnh Từ Khay Nhớ (Paste Clipboard)</span>
                </button>
              </div>

              {/* Image Preview & AI Action */}
              {screenshotBase64 && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={screenshotBase64}
                      alt="Screenshot preview"
                      className="w-28 h-28 object-cover rounded-xl border border-stone-300 shadow-xs"
                    />
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-stone-800 block">
                        Đã sẵn sàng hình ảnh chụp màn hình!
                      </span>
                      <button
                        onClick={handleParseScreenshotWithAI}
                        disabled={isParsingAI}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
                      >
                        {isParsingAI ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI Đang Phân Tích Kĩ Ảnh...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Bắt Đầu Bóc Tách Hoa Với AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Google Sheets Link */}
          {activeTab === 'gsheet' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm mb-1 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blue-600" />
                  <span>Nhập Trực Tiếp Từ Link Google Sheets Public</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Đảm bảo trang tính Google Sheet đã mở quyền: <strong>"Bất kỳ ai có liên kết đều có thể xem"</strong>
                </p>
              </div>

              {/* Image Support Banner Tip */}
              <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 space-y-1">
                <span className="font-bold block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hỗ Trợ Thêm Hình Ảnh Trực Tiếp Qua Google Sheets:</span>
                </span>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  Bạn tạo thêm cột tiêu đề <strong>"Hình ảnh"</strong>, <strong>"Link Ảnh"</strong> hoặc <strong>"URL"</strong> trong Google Sheets. Dán đường dẫn hình ảnh bất kỳ hoặc link chia sẻ từ <strong>Google Drive</strong> (ví dụ <code>https://drive.google.com/file/d/...</code>). Hệ thống sẽ tự động trích xuất và hiển thị ảnh tươi đẹp!
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/1ABC.../edit"
                  value={gsheetUrl}
                  onChange={(e) => setGsheetUrl(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleFetchGsheet}
                  disabled={isLoadingGsheet || !gsheetUrl.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  {isLoadingGsheet ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Tải Dữ Liệu</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Parsed Preview Table */}
          {previewItems.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kết Quả Đã Trích Xuất ({previewItems.length} Sản Phẩm)</span>
                  </h3>
                  <p className="text-xs text-stone-500">Xem trước danh sách sản phẩm trước khi đưa vào cửa hàng</p>
                </div>

                {/* Auto Match Image Checkbox */}
                <label className="flex items-center gap-2 text-xs font-semibold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoMatchMissingImages}
                    onChange={(e) => setAutoMatchMissingImages(e.target.checked)}
                    className="accent-rose-600 w-4 h-4"
                  />
                  <span>✨ Tự động lấy ảnh phù hợp trên mạng cho hoa chưa có ảnh</span>
                </label>
              </div>

              {/* Table Preview */}
              <div className="border border-stone-200 rounded-xl overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700 font-bold uppercase border-b border-stone-200">
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Tên Hoa</th>
                      <th className="py-2.5 px-3">Giá Bán</th>
                      <th className="py-2.5 px-3">Số Lượng Cành/Bó</th>
                      <th className="py-2.5 px-3">Hình Ảnh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {previewItems.map((item, idx) => {
                      const matchedImg = item.imageUrl || getMatchingFlowerImage(item.name || '', item.category);
                      return (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="py-2 px-3 text-stone-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-stone-900">{item.name}</td>
                          <td className="py-2 px-3 font-bold text-rose-600">{formatVND(item.price || 0)}</td>
                          <td className="py-2 px-3 text-stone-700 font-medium">{item.unitQuantity}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={matchedImg}
                                alt="Matched flower"
                                className="w-8 h-8 object-cover rounded border border-stone-200"
                              />
                              {!item.imageUrl && autoMatchMissingImages && (
                                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                                  Tự động gán ảnh
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Confirm Import Button */}
              <button
                onClick={handleConfirmImport}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Xác Nhận Nhập ({previewItems.length}) Sản Phẩm Vào Cửa Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span>Hỗ trợ định dạng file Excel, CSV, Google Sheets, PNG, JPG, WEBP</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
};
