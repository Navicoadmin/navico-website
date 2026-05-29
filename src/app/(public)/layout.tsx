import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/layout/ChatWidget";

// Layout chung cho toàn bộ trang public (có header/footer).
// Khu vực /admin dùng layout riêng nên không bị ảnh hưởng.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
