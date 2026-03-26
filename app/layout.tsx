import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlphaMail",
  description: "복귀 직후 쌓인 이메일을 우선순위 중심으로 정리하는 AI 이메일 어시스턴트 데모",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
