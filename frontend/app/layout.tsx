import "./globals.css";

export const metadata = {
  title: "AI Petri Dish",
  description: "Synthetic ecology for adaptive AI colonies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}