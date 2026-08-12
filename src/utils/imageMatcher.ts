// Utility for automatically finding high-quality matching flower imagery for products without an image

export const FLOWER_IMAGE_PRESETS: Record<string, string[]> = {
  rose_red: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80",
  ],
  rose_pink: [
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1548625361-1851e39a38c4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
  ],
  sunflower: [
    "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80",
  ],
  tulip: [
    "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=800&q=80",
  ],
  orchid: [
    "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566808906338-7f9a1eb40578?auto=format&fit=crop&w=800&q=80",
  ],
  hydrangea: [
    "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=800&q=80",
  ],
  lily: [
    "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
  ],
  baby: [
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  ],
  basket: [
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
  ],
  event: [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
  ],
  table: [
    "https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
  ],
  bouquet_general: [
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
  ],
};

/**
 * Returns a high-quality matching flower image URL based on flower name & category keywords
 */
export function getMatchingFlowerImage(name: string, category?: string): string {
  const lowerName = (name || "").toLowerCase();
  const lowerCategory = (category || "").toLowerCase();

  // Keyword check
  if (lowerName.includes("hướng dương") || lowerName.includes("sunflower")) {
    return getRandom(FLOWER_IMAGE_PRESETS.sunflower);
  }
  if (lowerName.includes("tulip")) {
    return getRandom(FLOWER_IMAGE_PRESETS.tulip);
  }
  if (lowerName.includes("lan") || lowerName.includes("hồ điệp") || lowerName.includes("orchid")) {
    return getRandom(FLOWER_IMAGE_PRESETS.orchid);
  }
  if (lowerName.includes("cẩm tú cầu") || lowerName.includes("tú cầu") || lowerName.includes("hydrangea")) {
    return getRandom(FLOWER_IMAGE_PRESETS.hydrangea);
  }
  if (lowerName.includes("hồng đỏ") || lowerName.includes("red rose") || lowerName.includes("ecuador")) {
    return getRandom(FLOWER_IMAGE_PRESETS.rose_red);
  }
  if (lowerName.includes("hồng") || lowerName.includes("rose")) {
    return getRandom(FLOWER_IMAGE_PRESETS.rose_pink);
  }
  if (lowerName.includes("ly") || lowerName.includes("lily")) {
    return getRandom(FLOWER_IMAGE_PRESETS.lily);
  }
  if (lowerName.includes("baby") || lowerName.includes("bi")) {
    return getRandom(FLOWER_IMAGE_PRESETS.baby);
  }

  // Category check
  if (lowerCategory === "basket" || lowerName.includes("lẵng") || lowerName.includes("giỏ")) {
    return getRandom(FLOWER_IMAGE_PRESETS.basket);
  }
  if (lowerCategory === "event" || lowerName.includes("sự kiện") || lowerName.includes("khai trương") || lowerName.includes("kệ hoa")) {
    return getRandom(FLOWER_IMAGE_PRESETS.event);
  }
  if (lowerCategory === "table" || lowerName.includes("để bàn") || lowerName.includes("trang trí")) {
    return getRandom(FLOWER_IMAGE_PRESETS.table);
  }

  // Fallback default bouquet
  return getRandom(FLOWER_IMAGE_PRESETS.bouquet_general);
}

function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
