import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/CodeMaster_Logo.png";
import { useTheme } from "@/app/context/ThemeContext";

interface LogoProps {
  size?: number; // controls image size
  showText?: boolean; // show/hide CODEMASTER text
  clickable?: boolean; // wrap with link
  className?: string; // extra styling
}

export default function Logo({
  size = 40,
  showText = true,
  clickable = true,
  className = "",
}: LogoProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div
        className={`flex items-center justify-center rounded-xl border overflow-hidden ${
          isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
        }`}
        style={{ width: size, height: size }}
      >
        <Image
          src={logo}
          alt="CodeMaster Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-sm font-black uppercase tracking-tight ${
            isLight ? "text-gray-900" : "text-white"
          }`}>
            CODEMASTER
          </span>
          <span className={`text-[9px] uppercase tracking-[0.25em] ${
            isLight ? "text-pink-600" : "text-pink-400"
          }`}>
            Coding Platform
          </span>
        </div>
      )}
    </div>
  );

  // Make clickable optional
  if (clickable) {
    return <Link href="/">{content}</Link>;
  }

  return content;
}