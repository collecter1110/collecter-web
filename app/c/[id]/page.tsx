import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getPublicCollection,
  getPublicSelections,
} from "@/lib/api";
import OpenInApp from "@/components/OpenInApp";

type Params = { params: Promise<{ id: string }> };

function parseId(idParam: string): number | null {
  const n = parseInt(idParam, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const collectionId = parseId(id);
  if (collectionId === null) return {};

  const collection = await getPublicCollection(collectionId);
  if (!collection) return {};

  const description = collection.description ?? "Collecter에서 공유된 컬렉션";
  const images = collection.image_url ? [collection.image_url] : [];

  return {
    title: `${collection.collection_title} · Collecter`,
    description,
    openGraph: {
      title: collection.collection_title,
      description,
      images,
      type: "website",
      url: `https://share.collecter.kr/c/${collectionId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: collection.collection_title,
      description,
      images,
    },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { id } = await params;
  const collectionId = parseId(id);
  if (collectionId === null) notFound();

  const [collection, selections] = await Promise.all([
    getPublicCollection(collectionId),
    getPublicSelections(collectionId),
  ]);

  if (!collection) notFound();

  const tags = Array.isArray(collection.tags) ? collection.tags : [];

  return (
    <main className="min-h-screen pb-32">
      <header className="relative">
        {collection.image_url ? (
          <div className="relative w-full aspect-[16/9] bg-gray-100">
            <Image
              src={collection.image_url}
              alt={collection.collection_title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-gray-100" />
        )}

        <div className="px-5 py-6">
          <h1 className="text-2xl font-bold leading-tight">
            {collection.collection_title}
          </h1>
          {collection.description && (
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">
              {collection.description}
            </p>
          )}
          <p className="mt-3 text-sm text-gray-500">
            @{collection.owner_name} · 셀렉션 {collection.selection_num}개 · 좋아요{" "}
            {collection.like_num}
          </p>
          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <section className="px-5">
        {selections.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">
            아직 셀렉션이 없어요.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {selections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/c/${collectionId}/s/${s.id}`}
                  className="block group"
                >
                  <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    {s.image_url ? (
                      <Image
                        src={s.image_url}
                        alt={s.selection_title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform"
                      />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-medium line-clamp-2">
                    {s.selection_title}
                  </p>
                  <p className="text-xs text-gray-500">@{s.owner_name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white to-white/0">
        <OpenInApp
          schemeUrl={`${process.env.NEXT_PUBLIC_APP_SCHEME ?? "collecterapp"}://c/${collectionId}`}
        />
      </div>
    </main>
  );
}
