import "./globals.css";

export const metadata = {
  title: "CodeMaster",
  description: "Competitive Coding Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
