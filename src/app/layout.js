import "./globals.css";

export const metadata = {
  title: "CAN — Can You Trust This?",
  description:
    "Understand before you trust. CAN membantu memahami karakteristik website berdasarkan berbagai indikator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}