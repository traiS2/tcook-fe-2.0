import { slugify } from "./format";
import type { CategoryIconKey } from "@/components/icons";

export type Difficulty = "Dễ" | "Trung bình" | "Khó";

export interface Recipe {
  slug: string;
  name: string;
  category: string;
  author: string;
  date: string;
  description: string;
  time: string;
  serve: string;
  difficulty: Difficulty;
  rating: string;
  tags: string[];
  ingredients: string[];
  views: number;
  likes: number;
  imageLabel: string;
}

const RAW_RECIPES: Omit<Recipe, "slug">[] = [
  {
    name: "Bánh Tiramisu Việt Quất",
    category: "Bánh Ngọt",
    author: "t cook",
    date: "13 thg 4, 2026",
    description:
      "Bánh Tiramisu Việt Quất không cần lò nướng siêu dễ làm! Lớp mứt việt quất chua chua ngọt ngọt tự sên hòa quyện cùng kem phô mai mascarpone béo ngậy, xen lẫn bánh quy sâm banh xốp mềm thấm đẫm cà phê.",
    time: "4 giờ 55 phút",
    serve: "6 phần",
    difficulty: "Trung bình",
    rating: "5.0",
    tags: ["tiramisu việt quất", "không cần lò", "tráng miệng"],
    ingredients: ["Việt quất", "Mascarpone", "Trứng"],
    views: 70,
    likes: 6,
    imageLabel: "ảnh · Bánh Tiramisu Việt Quất",
  },
  {
    name: "Gà Nướng Mật Ong Sả",
    category: "Món Chính",
    author: "Minh Anh",
    date: "12 thg 4, 2026",
    description:
      "Da gà giòn rụm, thịt mềm ngọt thấm vị mật ong và sả thơm lừng — món chính hoàn hảo cho bữa cơm cuối tuần sum họp.",
    time: "45 phút",
    serve: "4 phần",
    difficulty: "Dễ",
    rating: "4.8",
    tags: ["gà nướng", "mật ong", "sả", "bữa tối"],
    ingredients: ["Thịt gà", "Mật ong", "Sả"],
    views: 128,
    likes: 24,
    imageLabel: "ảnh · Gà Nướng Mật Ong Sả",
  },
  {
    name: "Trà Đào Cam Sả",
    category: "Đồ Uống",
    author: "Thu Hà",
    date: "11 thg 4, 2026",
    description:
      "Thức uống giải nhiệt thanh mát, đào giòn ngọt hòa quyện vị cam chua nhẹ và hương sả dịu — sảng khoái cho ngày hè.",
    time: "20 phút",
    serve: "2 ly",
    difficulty: "Dễ",
    rating: "4.9",
    tags: ["trà đào", "cam", "sả", "giải nhiệt"],
    ingredients: ["Trà", "Đào", "Cam", "Sả"],
    views: 203,
    likes: 41,
    imageLabel: "ảnh · Trà Đào Cam Sả",
  },
  {
    name: "Phở Bò Truyền Thống",
    category: "Món Chính",
    author: "Quốc Bảo",
    date: "9 thg 4, 2026",
    description:
      "Nước dùng ninh xương trong vắt, thơm mùi quế hồi, bánh phở mềm và thịt bò tái ngọt — tinh hoa ẩm thực Việt.",
    time: "3 giờ",
    serve: "4 phần",
    difficulty: "Khó",
    rating: "4.7",
    tags: ["phở bò", "nước dùng", "món việt"],
    ingredients: ["Thịt bò", "Bánh phở", "Quế hồi"],
    views: 412,
    likes: 88,
    imageLabel: "ảnh · Phở Bò Truyền Thống",
  },
  {
    name: "Chè Khúc Bạch",
    category: "Tráng Miệng",
    author: "Bảo Trân",
    date: "7 thg 4, 2026",
    description:
      "Miếng khúc bạch mềm mịn tan trong miệng, nước đường hạnh nhân thơm, thêm vải và nhãn giòn ngọt mát lạnh.",
    time: "40 phút",
    serve: "4 phần",
    difficulty: "Trung bình",
    rating: "4.8",
    tags: ["chè", "khúc bạch", "tráng miệng"],
    ingredients: ["Sữa", "Hạnh nhân", "Đường"],
    views: 175,
    likes: 33,
    imageLabel: "ảnh · Chè Khúc Bạch",
  },
  {
    name: "Bánh Mì Chảo Trứng Ốp",
    category: "Ăn Sáng",
    author: "Lan Chi",
    date: "6 thg 4, 2026",
    description:
      "Bữa sáng nhanh gọn: trứng ốp lòng đào, pate béo, xúc xích và bánh mì giòn rụm chấm đẫm — đủ năng lượng cả buổi.",
    time: "25 phút",
    serve: "2 phần",
    difficulty: "Dễ",
    rating: "4.6",
    tags: ["bánh mì", "trứng", "ăn sáng"],
    ingredients: ["Trứng", "Bánh mì", "Pate", "Xúc xích"],
    views: 96,
    likes: 18,
    imageLabel: "ảnh · Bánh Mì Chảo Trứng Ốp",
  },
  {
    name: "Salad Rau Củ Sốt Mè",
    category: "Món Chay",
    author: "Ngọc Diệp",
    date: "5 thg 4, 2026",
    description:
      "Rau củ tươi giòn trộn sốt mè rang béo bùi — nhẹ nhàng, thanh mát, ít calo, hợp cho người ăn kiêng và eat-clean.",
    time: "15 phút",
    serve: "2 phần",
    difficulty: "Dễ",
    rating: "4.5",
    tags: ["salad", "rau củ", "healthy", "chay"],
    ingredients: ["Rau củ", "Mè", "Sốt"],
    views: 84,
    likes: 15,
    imageLabel: "ảnh · Salad Rau Củ Sốt Mè",
  },
  {
    name: "Cà Phê Sữa Đá",
    category: "Đồ Uống",
    author: "Đức Huy",
    date: "4 thg 4, 2026",
    description:
      "Đậm đà, thơm nồng, ngọt vừa — ly cà phê phin sữa đá chuẩn vị Việt Nam đánh thức mọi giác quan buổi sáng.",
    time: "10 phút",
    serve: "1 ly",
    difficulty: "Dễ",
    rating: "4.9",
    tags: ["cà phê", "sữa đá", "món việt"],
    ingredients: ["Cà phê", "Sữa", "Đường"],
    views: 311,
    likes: 67,
    imageLabel: "ảnh · Cà Phê Sữa Đá",
  },
  {
    name: "Cơm Tấm Sườn Nướng",
    category: "Món Chính",
    author: "Hoàng Nam",
    date: "2 thg 4, 2026",
    description:
      "Sườn nướng thơm lừng ướp đậm đà, cơm tấm dẻo, chan mỡ hành và nước mắm chua ngọt — món quen thuộc khó cưỡng.",
    time: "50 phút",
    serve: "2 phần",
    difficulty: "Trung bình",
    rating: "4.7",
    tags: ["cơm tấm", "sườn nướng", "món việt"],
    ingredients: ["Thịt heo", "Cơm tấm", "Mỡ hành"],
    views: 189,
    likes: 39,
    imageLabel: "ảnh · Cơm Tấm Sườn Nướng",
  },
];

export const RECIPES: Recipe[] = RAW_RECIPES.map((r) => ({
  ...r,
  slug: slugify(r.name),
}));

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

export const FEATURED_RECIPE_SLUG = slugify("Bánh Tiramisu Việt Quất");

export const RECIPE_CATEGORIES = [
  "Món Chính",
  "Tráng Miệng",
  "Đồ Uống",
  "Ăn Sáng",
  "Món Chay",
] as const;

// ---------------------------------------------------------------------------
// Shopping-list ingredient breakdown per recipe (base servings + line items).
// Ported 1:1 from "Đi chợ TCook - 1a.dc.html" so quantity math stays correct.
// ---------------------------------------------------------------------------

export type Aisle = "rau" | "thit" | "lanh" | "kho";

export interface ShoppingItem {
  name: string;
  qty: number;
  unit: string;
  aisle: Aisle;
}

export const AISLE_META: Record<Aisle, { name: string; icon: string; color: string; order: number }> = {
  rau: { name: "Rau · Củ · Trái cây", icon: "🥬", color: "#5a9e56", order: 0 },
  thit: { name: "Thịt · Hải sản", icon: "🥩", color: "#c0895a", order: 1 },
  lanh: { name: "Đồ mát · Đông lạnh", icon: "🧊", color: "#5a9ec0", order: 2 },
  kho: { name: "Đồ khô · Gia vị", icon: "🧂", color: "#c8a15a", order: 3 },
};

export const SHOPPING_INGREDIENTS: Record<string, { base: number; items: ShoppingItem[] }> = {
  [slugify("Bánh Tiramisu Việt Quất")]: {
    base: 6,
    items: [
      { name: "Việt quất tươi", qty: 300, unit: "g", aisle: "rau" },
      { name: "Kem Mascarpone", qty: 250, unit: "g", aisle: "lanh" },
      { name: "Trứng gà", qty: 4, unit: "quả", aisle: "lanh" },
      { name: "Bánh quy Ladyfinger", qty: 200, unit: "g", aisle: "kho" },
      { name: "Đường", qty: 120, unit: "g", aisle: "kho" },
      { name: "Cà phê espresso", qty: 150, unit: "ml", aisle: "kho" },
    ],
  },
  [slugify("Gà Nướng Mật Ong Sả")]: {
    base: 4,
    items: [
      { name: "Đùi gà", qty: 800, unit: "g", aisle: "thit" },
      { name: "Mật ong", qty: 60, unit: "ml", aisle: "kho" },
      { name: "Sả", qty: 4, unit: "cây", aisle: "rau" },
      { name: "Tỏi", qty: 1, unit: "củ", aisle: "rau" },
      { name: "Nước mắm", qty: 30, unit: "ml", aisle: "kho" },
    ],
  },
  [slugify("Trà Đào Cam Sả")]: {
    base: 2,
    items: [
      { name: "Trà túi lọc", qty: 3, unit: "gói", aisle: "kho" },
      { name: "Đào ngâm", qty: 200, unit: "g", aisle: "kho" },
      { name: "Cam", qty: 1, unit: "quả", aisle: "rau" },
      { name: "Sả", qty: 2, unit: "cây", aisle: "rau" },
      { name: "Đường", qty: 50, unit: "g", aisle: "kho" },
    ],
  },
  [slugify("Phở Bò Truyền Thống")]: {
    base: 4,
    items: [
      { name: "Xương bò", qty: 1000, unit: "g", aisle: "thit" },
      { name: "Thịt bò tái", qty: 400, unit: "g", aisle: "thit" },
      { name: "Bánh phở", qty: 500, unit: "g", aisle: "kho" },
      { name: "Quế hồi thảo quả", qty: 1, unit: "gói", aisle: "kho" },
      { name: "Hành tây", qty: 2, unit: "củ", aisle: "rau" },
      { name: "Gừng", qty: 50, unit: "g", aisle: "rau" },
    ],
  },
  [slugify("Chè Khúc Bạch")]: {
    base: 4,
    items: [
      { name: "Sữa tươi", qty: 500, unit: "ml", aisle: "lanh" },
      { name: "Kem whipping", qty: 250, unit: "ml", aisle: "lanh" },
      { name: "Gelatin lá", qty: 15, unit: "g", aisle: "kho" },
      { name: "Hạnh nhân lát", qty: 50, unit: "g", aisle: "kho" },
      { name: "Đường", qty: 80, unit: "g", aisle: "kho" },
    ],
  },
  [slugify("Bánh Mì Chảo Trứng Ốp")]: {
    base: 2,
    items: [
      { name: "Trứng gà", qty: 4, unit: "quả", aisle: "lanh" },
      { name: "Bánh mì", qty: 2, unit: "ổ", aisle: "kho" },
      { name: "Pate", qty: 100, unit: "g", aisle: "lanh" },
      { name: "Xúc xích", qty: 2, unit: "cây", aisle: "lanh" },
      { name: "Hành lá", qty: 1, unit: "ít", aisle: "rau" },
    ],
  },
  [slugify("Salad Rau Củ Sốt Mè")]: {
    base: 2,
    items: [
      { name: "Xà lách", qty: 200, unit: "g", aisle: "rau" },
      { name: "Cà chua bi", qty: 150, unit: "g", aisle: "rau" },
      { name: "Dưa leo", qty: 1, unit: "quả", aisle: "rau" },
      { name: "Mè rang", qty: 30, unit: "g", aisle: "kho" },
      { name: "Sốt mè rang", qty: 60, unit: "ml", aisle: "kho" },
    ],
  },
  [slugify("Cà Phê Sữa Đá")]: {
    base: 1,
    items: [
      { name: "Cà phê phin", qty: 25, unit: "g", aisle: "kho" },
      { name: "Sữa đặc", qty: 30, unit: "ml", aisle: "kho" },
      { name: "Đá viên", qty: 1, unit: "ít", aisle: "lanh" },
    ],
  },
  [slugify("Cơm Tấm Sườn Nướng")]: {
    base: 2,
    items: [
      { name: "Sườn heo", qty: 500, unit: "g", aisle: "thit" },
      { name: "Cơm tấm", qty: 400, unit: "g", aisle: "kho" },
      { name: "Mỡ hành", qty: 50, unit: "g", aisle: "rau" },
      { name: "Nước mắm", qty: 40, unit: "ml", aisle: "kho" },
      { name: "Đồ chua", qty: 100, unit: "g", aisle: "rau" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Categories (Danh mục / Chi tiết danh mục)
// ---------------------------------------------------------------------------

export interface CategoryRecipeRef {
  name: string;
  sub: string;
  imageLabel: string;
  rating: string;
  author: string;
  date: string;
  description: string;
  time: string;
  serve: string;
  difficulty: Difficulty;
  tagMain: string;
  tagMore: string;
  views: string;
  likes: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  count: number;
  icon: CategoryIconKey;
  subs: string[];
  recipes: CategoryRecipeRef[];
}

const RAW_CATEGORIES: Omit<Category, "slug">[] = [
  {
    name: "Bánh Ngọt",
    description: "Bánh ngọt hiện đại và bánh dân gian truyền thống Việt Nam.",
    count: 7,
    icon: "cake",
    subs: ["Bánh bông lan", "Bánh quy", "Tiramisu", "Bánh mì ngọt"],
    recipes: [
      {
        name: "Bánh Tiramisu Việt Quất",
        sub: "Tiramisu",
        imageLabel: "ảnh · Bánh Tiramisu Việt Quất",
        rating: "5.0",
        author: "Mai Chi",
        date: "3 thg 4, 2026",
        description:
          "Bánh Tiramisu Việt Quất không cần lò nướng, siêu dễ làm. Lớp mứt việt quất chua ngọt hòa quyện kem mascarpone béo mịn và bánh ladyfinger thấm cà phê.",
        time: "4 giờ 55",
        serve: "8",
        difficulty: "Trung bình",
        tagMain: "Không cần lò",
        tagMore: "Tráng miệng",
        views: "2.1k",
        likes: 340,
      },
      {
        name: "Tiramisu Cà Phê Cổ Điển",
        sub: "Tiramisu",
        imageLabel: "ảnh · Tiramisu Cà Phê Cổ Điển",
        rating: "4.9",
        author: "Quốc Bảo",
        date: "1 thg 4, 2026",
        description:
          "Công thức tiramisu Ý truyền thống với lớp kem mascarpone mịn, bánh ladyfinger đẫm espresso và bột cacao rắc mặt đắng nhẹ.",
        time: "5 giờ 30",
        serve: "8",
        difficulty: "Trung bình",
        tagMain: "Cổ điển",
        tagMore: "Cà phê",
        views: "3.4k",
        likes: 512,
      },
      {
        name: "Bánh Bông Lan Trứng Muối",
        sub: "Bánh bông lan",
        imageLabel: "ảnh · Bánh Bông Lan Trứng Muối",
        rating: "4.8",
        author: "Thu Hà",
        date: "30 thg 3, 2026",
        description:
          "Cốt bông lan mềm xốp phủ sốt phô mai mặn ngọt, chà bông và trứng muối bùi béo — món hot trend không thể bỏ qua.",
        time: "1 giờ 20",
        serve: "6",
        difficulty: "Trung bình",
        tagMain: "Hot trend",
        tagMore: "Mặn ngọt",
        views: "5.2k",
        likes: 840,
      },
      {
        name: "Bánh Bông Lan Cuộn Kem",
        sub: "Bánh bông lan",
        imageLabel: "ảnh · Bánh Bông Lan Cuộn Kem",
        rating: "4.7",
        author: "Lan Chi",
        date: "28 thg 3, 2026",
        description:
          "Cốt bánh mỏng dẻo cuộn lớp kem tươi mát lạnh, không nứt không gãy với mẹo cuộn nóng đơn giản tại nhà.",
        time: "50 phút",
        serve: "6",
        difficulty: "Dễ",
        tagMain: "Dễ làm",
        tagMore: "Kem tươi",
        views: "1.9k",
        likes: 276,
      },
      {
        name: "Bánh Quy Bơ Đan Mạch",
        sub: "Bánh quy",
        imageLabel: "ảnh · Bánh Quy Bơ Đan Mạch",
        rating: "4.9",
        author: "Đức Huy",
        date: "26 thg 3, 2026",
        description:
          "Bánh quy bơ tan chảy trong miệng, thơm lừng vị bơ Anchor, giòn rụm — công thức chuẩn hộp thiếc tuổi thơ.",
        time: "45 phút",
        serve: "24",
        difficulty: "Dễ",
        tagMain: "Giòn tan",
        tagMore: "Vị bơ",
        views: "4.1k",
        likes: 623,
      },
      {
        name: "Bánh Quy Chocolate Chip",
        sub: "Bánh quy",
        imageLabel: "ảnh · Bánh Quy Chocolate Chip",
        rating: "4.8",
        author: "Ngọc Diệp",
        date: "24 thg 3, 2026",
        description:
          "Rìa giòn, lòng mềm dai, chocolate chip tan chảy — công thức cookie kiểu Mỹ được yêu thích nhất mọi thời đại.",
        time: "40 phút",
        serve: "18",
        difficulty: "Dễ",
        tagMain: "Kiểu Mỹ",
        tagMore: "Chocolate",
        views: "6.8k",
        likes: 1024,
      },
      {
        name: "Bánh Mì Hoa Cúc",
        sub: "Bánh mì ngọt",
        imageLabel: "ảnh · Bánh Mì Hoa Cúc",
        rating: "4.7",
        author: "Hoàng Nam",
        date: "22 thg 3, 2026",
        description:
          "Bánh mì bơ sữa thơm phức, xé sợi bông tơi, ngọt dịu — phiên bản brioche hoa cúc làm tại nhà cực mềm.",
        time: "3 giờ",
        serve: "10",
        difficulty: "Khó",
        tagMain: "Bơ sữa",
        tagMore: "Brioche",
        views: "2.7k",
        likes: 398,
      },
    ],
  },
  {
    name: "Món Chính",
    description: "Món chủ đạo cung cấp dinh dưỡng chính trong bữa cơm.",
    count: 0,
    icon: "plate",
    subs: ["Cơm", "Bún & Phở", "Mì", "Món xào"],
    recipes: [],
  },
  {
    name: "Món Tráng Miệng",
    description: "Món ngọt nhẹ kết thúc bữa cơm hoặc bữa phụ trong ngày.",
    count: 0,
    icon: "sparkle",
    subs: ["Kem", "Pudding", "Trái cây"],
    recipes: [],
  },
  {
    name: "Món Canh & Súp",
    description: "Món nước thanh mát, bổ dưỡng, giúp bữa ăn dễ tiêu hóa.",
    count: 0,
    icon: "soup",
    subs: ["Canh rau", "Súp", "Lẩu"],
    recipes: [],
  },
  {
    name: "Món Kho & Rim",
    description: "Món đậm đà, nấu chậm để thấm vị, cực kỳ đưa cơm.",
    count: 0,
    icon: "pot",
    subs: ["Thịt kho", "Cá kho", "Rim mặn ngọt"],
    recipes: [],
  },
  {
    name: "Chè & Thạch",
    description: "Các món chè truyền thống và thạch rau câu thanh mát.",
    count: 0,
    icon: "bowl",
    subs: ["Chè đậu", "Chè trái cây", "Thạch rau câu"],
    recipes: [],
  },
];

export const CATEGORIES: Category[] = RAW_CATEGORIES.map((c) => ({
  ...c,
  slug: slugify(c.name),
}));

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
