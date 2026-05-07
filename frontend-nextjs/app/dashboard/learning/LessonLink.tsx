"use client";

import { useEffect, useRef } from "react";

interface LessonLinkProps {
  lessonId: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick: (lessonId: string) => void;
}

export function LessonLink({ lessonId, isActive, children, onClick }: LessonLinkProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isActive]);

  return (
    <div ref={elementRef}>
      <button
        onClick={() => onClick(lessonId)}
        className={`w-full text-left transition-all ${
          isActive ? "bg-pink-500/10 ring-1 ring-pink-500/20" : "hover:bg-white/5"
        }`}
      >
        {children}
      </button>
    </div>
  );
}
