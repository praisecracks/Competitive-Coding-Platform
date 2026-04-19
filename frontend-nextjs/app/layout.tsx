import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

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
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
