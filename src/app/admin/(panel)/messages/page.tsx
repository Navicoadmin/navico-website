import { prisma } from "@/lib/prisma";
import { MessageList } from "@/components/admin/MessageList";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Tin nhắn liên hệ</h1>
        <p className="text-on-surface-variant mt-1">
          {messages.length} tin nhắn từ form liên hệ.
        </p>
      </div>
      <MessageList
        initial={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          message: m.message,
          handled: m.handled,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
