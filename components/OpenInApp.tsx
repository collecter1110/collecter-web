"use client";

import { useEffect, useState } from "react";

type Props = {
  schemeUrl: string;
  label?: string;
};

export default function OpenInApp({
  schemeUrl,
  label = "앱에서 열기",
}: Props) {
  const [isIOS, setIsIOS] = useState<boolean | null>(null);

  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  const storeUrl = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "#";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    if (!isIOS) {
      window.open(storeUrl, "_blank", "noopener");
      return;
    }

    // iOS: custom scheme 시도 → 1.5s 안에 앱 응답 없으면 App Store로 폴백
    window.location.href = schemeUrl;

    const timer = setTimeout(() => {
      window.location.href = storeUrl;
    }, 1500);

    // 앱이 열리면 페이지가 숨겨짐 — 타이머 취소
    const cancel = () => clearTimeout(timer);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancel();
    }, { once: true });
    window.addEventListener("pagehide", cancel, { once: true });
  }

  // 서버 렌더 + 하이드레이션 전: 버튼 표시만 (클릭 시 동작은 hydration 후)
  const buttonLabel = isIOS === false ? "App Store에서 받기" : label;

  return (
    <a
      href={schemeUrl}
      onClick={handleClick}
      className="block w-full max-w-md mx-auto py-3 rounded-xl bg-black text-white text-center text-sm font-medium"
    >
      {buttonLabel}
    </a>
  );
}
