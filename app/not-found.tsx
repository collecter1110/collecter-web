export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">컬렉션을 찾을 수 없어요</h1>
      <p className="text-gray-500 mb-6">
        삭제되었거나 비공개로 변경되었을 수 있어요.
      </p>
      <a href="/" className="text-sm underline text-gray-600">
        Collecter 홈으로
      </a>
    </main>
  );
}
