// Cấu hình tĩnh của site: điều hướng, thông tin liên hệ, link footer.
export const siteConfig = {
  name: "NAVICO",
  hotline: "028 2264 6668",
  email: "admin@navico.vn",
  address:
    "Lô LA10, Đường số 1, KCN Xuyên Á, Xã Đức Lập, Tây Ninh, Việt Nam",
  social: {
    website: "#",
    facebook: "#",
    youtube: "#",
  },
};

// Menu điều hướng chính
export const mainNav = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Hoạt động", href: "/hoat-dong" },
  { label: "Tuyển dụng", href: "/tuyen-dung" },
  { label: "Liên hệ", href: "/lien-he" },
];

export const footerLinks = {
  products: [
    { label: "Men Vi Sinh", href: "/san-pham?category=men-vi-sinh" },
    { label: "Dinh Dưỡng", href: "/san-pham?category=dinh-duong" },
    { label: "Xử Lý Nước", href: "/san-pham?category=xu-ly-nuoc" },
    { label: "Khoáng Chất", href: "/san-pham?category=khoang-chat" },
  ],
  support: [
    { label: "Về chúng tôi", href: "/gioi-thieu" },
    { label: "Hoạt động & Sự kiện", href: "/hoat-dong" },
    { label: "Cơ hội nghề nghiệp", href: "/tuyen-dung" },
    { label: "Liên hệ báo giá", href: "/lien-he" },
  ],
  legal: [
    { label: "Chính sách bảo mật", href: "#" },
    { label: "Điều khoản dịch vụ", href: "#" },
    { label: "Chính sách chất lượng", href: "#" },
  ],
};
