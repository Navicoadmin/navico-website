// Từ điển tiếng Việt cho các chuỗi dùng chung (nav, footer, chung).
// Nội dung trang cụ thể đặt trực tiếp trong component để dễ port; có thể
// chuyển dần vào đây khi bổ sung ngôn ngữ thứ hai.
const vi = {
  brand: "NAVICO",
  nav: {
    home: "Trang chủ",
    about: "Giới thiệu",
    products: "Sản phẩm",
    solutions: "Giải pháp kỹ thuật",
    news: "Tin tức",
    contact: "Liên hệ",
    consult: "Tư vấn",
    searchPlaceholder: "Tìm kiếm giải pháp...",
  },
  footer: {
    tagline:
      "Cung cấp giải pháp dinh dưỡng, phụ gia và công nghệ sinh học cho ngành nuôi trồng thủy sản, hướng đến hiệu quả và phát triển bền vững.",
    quickLinks: "Liên kết nhanh",
    products: "Sản phẩm",
    support: "Hỗ trợ khách hàng",
    legal: "Pháp lý",
    newsletter: "Đăng ký bản tin",
    newsletterDesc: "Nhận cập nhật kỹ thuật mới nhất từ chuyên gia.",
    emailPlaceholder: "Email của bạn",
    rights: "© 2026 Navico. All Rights Reserved.",
    privacy: "Chính sách bảo mật",
    terms: "Điều khoản sử dụng",
  },
  common: {
    readMore: "Xem chi tiết",
    viewAll: "Tất cả sản phẩm",
    send: "Gửi thông tin",
    loading: "Đang tải...",
  },
} as const;

export default vi;
export type Dictionary = typeof vi;
