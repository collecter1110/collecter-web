export default function Loading() {
  return (
    <main className="min-h-screen pb-32 animate-pulse">
      <div className="px-5 pt-4">
        <div className="h-4 w-24 rounded bg-gray-100" />
      </div>

      <div className="mt-3 w-full aspect-square bg-gray-100" />

      <section className="px-5 mt-5">
        <div className="h-6 w-3/4 rounded bg-gray-100" />
        <div className="mt-2 h-4 w-24 rounded bg-gray-100" />

        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-5/6 rounded bg-gray-100" />
        </div>

        <ul className="mt-2 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-10 rounded-lg bg-gray-50" />
          ))}
        </ul>
      </section>
    </main>
  );
}
