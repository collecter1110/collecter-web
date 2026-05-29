import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublicSelectionDetail } from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";
import OpenInApp from "@/components/OpenInApp";

type Params = { params: Promise<{ id: string; sid: string }> };

function parseId(idParam: string): number | null {
  const n = parseInt(idParam, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id, sid } = await params;
  const collectionId = parseId(id);
  const selectionId = parseId(sid);
  if (collectionId === null || selectionId === null) return {};

  const selection = await getPublicSelectionDetail(collectionId, selectionId);
  if (!selection) return {};

  const description = selection.description ?? "Collecter에서 공유된 셀렉션";
  const firstImage = selection.selection_images[0]?.image_url;
  const images = firstImage ? [firstImage] : [];

  return {
    title: `${selection.selection_title} · Collecter`,
    description,
    openGraph: {
      title: selection.selection_title,
      description,
      images,
      type: "website",
      url: `https://share.collecter.kr/c/${collectionId}/s/${selectionId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: selection.selection_title,
      description,
      images,
    },
  };
}

function getItemText(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    if (typeof obj.item_title === "string") return obj.item_title;
    if (typeof obj.text === "string") return obj.text;
  }
  return "";
}

function getItemOrder(item: unknown): number {
  if (item && typeof item === "object") {
    const order = (item as Record<string, unknown>).item_order;
    if (typeof order === "number") return order;
  }
  return Number.MAX_SAFE_INTEGER;
}

function renderItems(items: unknown, isOrdered: boolean): React.ReactNode {
  if (!Array.isArray(items) || items.length === 0) return null;

  const list = isOrdered
    ? [...items].sort((a, b) => getItemOrder(a) - getItemOrder(b))
    : items;

  return (
    <ListTag className="mt-2 space-y-2" isOrdered={isOrdered}>
      {list.map((item, idx) => (
        <li
          key={idx}
          className="flex gap-3 px-3 py-2 rounded-lg bg-gray-50 text-sm"
        >
          <span className="text-gray-400 shrink-0">
            {isOrdered ? idx + 1 : "•"}
          </span>
          <span className="whitespace-pre-wrap break-words">
            {getItemText(item)}
          </span>
        </li>
      ))}
    </ListTag>
  );
}

function ListTag({
  isOrdered,
  className,
  children,
}: {
  isOrdered: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return isOrdered ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  );
}

export default async function SelectionDetailPage({ params }: Params) {
  const { id, sid } = await params;
  const collectionId = parseId(id);
  const selectionId = parseId(sid);
  if (collectionId === null || selectionId === null) notFound();

  const selection = await getPublicSelectionDetail(collectionId, selectionId);
  if (!selection) notFound();

  const keywords = Array.isArray(selection.keywords) ? selection.keywords : [];
  const scheme = process.env.NEXT_PUBLIC_APP_SCHEME ?? "collecterapp";

  return (
    <main className="min-h-screen pb-32">
      <div className="px-5 pt-4">
        <Link
          href={`/c/${collectionId}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← 컬렉션으로
        </Link>
      </div>

      {selection.selection_images.length > 0 && (
        <div className="mt-3">
          <ImageCarousel
            images={selection.selection_images}
            alt={selection.selection_title}
          />
        </div>
      )}

      <section className="px-5 mt-5">
        <h1 className="text-xl font-bold leading-tight">
          {selection.selection_title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">@{selection.owner_name}</p>

        {selection.description && (
          <p className="mt-3 text-gray-700 whitespace-pre-wrap break-words">
            {selection.description}
          </p>
        )}

        {keywords.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <li
                key={k.keyword_id}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
              >
                #{k.keyword_name}
              </li>
            ))}
          </ul>
        )}

        {renderItems(selection.items, selection.is_ordered)}

        {selection.link && (
          <a
            href={selection.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline break-all"
          >
            🔗 {selection.link}
          </a>
        )}
      </section>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white to-white/0">
        <OpenInApp
          schemeUrl={`${scheme}://c/${collectionId}/s/${selectionId}`}
        />
      </div>
    </main>
  );
}
