export default function Loading() {
  return (
    <main className="min-h-screen pb-32 animate-pulse">
      <header className="relative">
        <div className="w-full aspect-[16/9] bg-gray-100" />

        <div className="px-5 py-6">
          <div className="h-7 w-2/3 rounded bg-gray-100" />
          <div className="mt-2 h-4 w-full rounded bg-gray-100" />
          <div className="mt-3 h-4 w-40 rounded bg-gray-100" />
        </div>
      </header>

      <section className="px-5">
        <ul className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg" />
              <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
              <div className="mt-1 h-3 w-1/3 rounded bg-gray-100" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
