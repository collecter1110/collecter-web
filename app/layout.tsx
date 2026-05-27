import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collecter",
  description: "Collecter에서 공유된 컬렉션",
  metadataBase: new URL("https://share.collecter.kr"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
