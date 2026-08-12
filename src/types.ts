export type OccasionId = 'all' | 'birthday' | 'love' | 'opening' | 'thanks' | 'sympathy' | 'congratulation';

export type FlowerCategory = 'all' | 'hoa-hong' | 'huong-duong' | 'cam-tu-cau' | 'tulip' | 'hoa-lan' | 'lang-hoa' | 'gio-hoa';

export interface FlowerItem {
  id: string;
  name: string;
  category: FlowerCategory;
  categoryName: string;
  occasion?: OccasionId[];
  occasionNames?: string[];
  price: number; // in VND
  originalPrice?: number;
  unitQuantity: string; // e.g. "10 cành", "1 bó (15 cành)", "1 chậu 5 cành"
  rating?: number;
  reviewsCount?: number;
  imageUrl: string;
  description: string;
  meaning?: string;
  flowersIncluded?: string[];
  tags?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock: boolean;
  stockCount?: number;
}

export type BouquetSize = 'standard' | 'medium' | 'premium';

export interface CartItem {
  id: string; // unique cart item id
  flower: FlowerItem;
  size: BouquetSize;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
  greetingCardText?: string;
  ribbonColor?: string;
  isCustomBouquet?: boolean;
  customDetails?: {
    mainFlowers: string[];
    secondaryFlowers: string[];
    wrapperColor: string;
    ribbonColor: string;
  };
}

export interface CustomBouquetConfig {
  mainFlower: string;
  mainFlowerQty: number;
  secondaryFlowers: string[];
  wrapperColor: string;
  ribbonColor: string;
  greetingCard: string;
  specialNote: string;
}

export interface FilterState {
  searchQuery: string;
  category: FlowerCategory;
  occasion: OccasionId;
  priceRange: [number, number];
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  onlyDiscount: boolean;
  onlyBestSeller: boolean;
}
