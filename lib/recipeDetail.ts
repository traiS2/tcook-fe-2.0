import { FEATURED_RECIPE_SLUG } from "./data";

/**
 * Static long-form content for the recipe detail page. The original
 * prototype's "Chi tiết công thức" page is itself a hardcoded mockup of a
 * single recipe (every "view recipe" link across the site points at the
 * same static file, regardless of which card was clicked) — this mirrors
 * that behaviour 1:1. `/recipes/[slug]` renders this content for any slug;
 * wiring per-recipe detail content is a future enhancement.
 */

export const DETAIL_RECIPE_SLUG = FEATURED_RECIPE_SLUG;

export interface IngredientGroup {
  title: string;
  items: string[];
}

export const INGREDIENT_GROUPS: IngredientGroup[] = [
  {
    title: "Mứt việt quất",
    items: ["300g quả việt quất", "30g đường cát", "5g nước cốt chanh"],
  },
  {
    title: "Kem Tiramisu",
    items: [
      "3 lòng đỏ trứng thanh trùng",
      "20g đường cát mịn",
      "260g phô mai Mascarpone",
      "220g kem tươi",
    ],
  },
  {
    title: "Lắp ráp bánh",
    items: ["Khoảng 12 chiếc bánh quy sâm banh", "1 bát sữa tươi để nhúng bánh"],
  },
  {
    title: "Kem chà láng & Trang trí",
    items: ["250g kem tươi", "50g phô mai Mascarpone", "20g đường cát mịn", "Tùy chọn: màu thực phẩm"],
  },
];

export interface RecipeStep {
  num: string;
  title: string;
  time: string;
  imageLabel: string;
  description: string;
}

export const RECIPE_STEPS: RecipeStep[] = [
  {
    num: "1",
    title: "Làm mứt việt quất",
    time: "~10 phút",
    imageLabel: "ảnh · Sên mứt việt quất",
    description:
      "Cho việt quất và đường vào chảo, đun lửa vừa. Vừa đun vừa khuấy đến khi hỗn hợp đặc sệt lại. Thêm nước cốt chanh, đun thêm khoảng 1 phút rồi tắt bếp, để nguội.",
  },
  {
    num: "2",
    title: "Trộn kem Tiramisu",
    time: "~15 phút",
    imageLabel: "ảnh · Trộn kem Mascarpone",
    description:
      "Đánh bông lòng đỏ trứng với đường đến khi đặc lại. Thêm Mascarpone đánh cho mịn lỳ. Ở tô khác đánh bông kem tươi rồi nhẹ nhàng trộn đều hai hỗn hợp. Cho kem vào túi bắt kem.",
  },
  {
    num: "3",
    title: "Lắp ráp cốt bánh",
    time: "~10 phút",
    imageLabel: "ảnh · Xếp bánh & bơm mứt",
    description:
      "Nhúng siêu nhanh hai mặt bánh quy sâm banh vào sữa rồi xếp kín đáy khuôn. Phủ một lớp mứt việt quất, dàn đều. Bơm một lớp kem Tiramisu và gạt phẳng. Lặp lại thao tác thêm một lần nữa.",
  },
  {
    num: "4",
    title: "Làm lạnh & chà láng",
    time: "~4 giờ 10 phút",
    imageLabel: "ảnh · Chà láng kem trắng",
    description:
      "Cho bánh vào ngăn mát tủ lạnh ít nhất 4 tiếng (để qua đêm là tốt nhất). Sau khi bánh đông, lấy ra khỏi khuôn. Đánh bông kem chà láng rồi phủ kín toàn bộ mặt và thân bánh.",
  },
  {
    num: "5",
    title: "Trang trí hoa văn Vintage",
    time: "~14 phút",
    imageLabel: "ảnh · Trang trí caro & hoa",
    description:
      "Dùng đui sao bơm các đường viền kem nhỏ quanh mép bánh. Pha màu phần kem còn thừa để vẽ đường kẻ sọc caro trên mặt bánh và bắt những bông hoa nhỏ xinh quanh thân bánh.",
  },
];

export const RECIPE_TIPS: { title: string; body: string }[] = [
  { title: "Dùng trứng thanh trùng:", body: "Bắt buộc vì món này ăn sống." },
  {
    title: "Nhúng bánh cực nhanh:",
    body: "Chỉ nhúng lướt sữa 1 giây/mặt để bánh không bị nhũn nát.",
  },
  {
    title: "Ủ lạnh đủ lâu:",
    body: "Để tủ lạnh qua đêm (tối thiểu 4 tiếng) giúp kem đông cứng lại, chà láng sẽ cực kỳ sắc nét.",
  },
];

export const RECIPE_STORAGE: { title: string; body: string }[] = [
  {
    title: "Ngăn mát tủ lạnh:",
    body: "Đậy kín hoặc cho vào hộp, bảo quản 3–4 ngày. Bánh càng để lạnh càng đông và dễ cắt.",
  },
  {
    title: "Không nên cấp đông:",
    body: "Kem Mascarpone dễ tách nước và mất độ mịn sau khi rã đông, nên dùng lạnh là ngon nhất.",
  },
  {
    title: "Trước khi dùng:",
    body: "Do có trứng sống, tránh để bánh ở nhiệt độ phòng quá 2 tiếng; cắt bằng dao hơ nóng, lau sạch giữa mỗi lát cho đẹp.",
  },
];

export interface RelatedRecipe {
  name: string;
  category: string;
  rating: string;
  time: string;
  serve: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  tag: string;
}

export const RELATED_RECIPES: RelatedRecipe[] = [
  { name: "Chè Khúc Bạch", category: "Tráng Miệng", rating: "4.8", time: "40 phút", serve: "4 phần", difficulty: "Trung bình", tag: "Cùng phong cách tráng miệng" },
  { name: "Bánh Flan Caramel", category: "Tráng Miệng", rating: "4.9", time: "1 giờ", serve: "6 phần", difficulty: "Dễ", tag: "Món ngọt kem trứng" },
  { name: "Tiramisu Cà Phê Cổ Điển", category: "Bánh Ngọt", rating: "5.0", time: "4 giờ", serve: "6 phần", difficulty: "Trung bình", tag: "Biến tấu khác của món này" },
  { name: "Mousse Chanh Dây", category: "Tráng Miệng", rating: "4.7", time: "3 giờ", serve: "4 phần", difficulty: "Dễ", tag: "Mát lạnh, chua ngọt" },
];

export interface RecipeReview {
  initial: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  stars: number;
  timeAgo: string;
  body: string;
}

export const RECIPE_REVIEWS: RecipeReview[] = [
  {
    initial: "M",
    avatarBg: "#e8e0d4",
    avatarColor: "#7a6e5f",
    name: "Minh Tú",
    stars: 5,
    timeAgo: "3 ngày trước",
    body: "Công thức rất dễ làm theo, mình đã thử và cả nhà khen ngon! Hướng dẫn chi tiết từng bước rất rõ ràng.",
  },
  {
    initial: "H",
    avatarBg: "#d4e0d6",
    avatarColor: "#4a6b50",
    name: "Hương Giang",
    stars: 4,
    timeAgo: "1 tuần trước",
    body: "Mình thích cách trình bày nguyên liệu theo từng phần. Sẽ thử thêm một ít gừng lần sau xem sao!",
  },
  {
    initial: "T",
    avatarBg: "#d8d4e8",
    avatarColor: "#5a4f7a",
    name: "Thanh Bình",
    stars: 5,
    timeAgo: "2 tuần trước",
    body: "Đây là lần thứ 3 mình nấu theo công thức này rồi. Lần nào cũng thành công, cảm ơn tác giả rất nhiều!",
  },
];
