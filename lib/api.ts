import "server-only";

type Json = Record<string, unknown>;

export type PublicCollection = {
  collection_id: number;
  category_id: number;
  collection_title: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  owner_name: string;
  primary_keywords: Array<{ keyword_id: number; keyword_name: string; count: number }> | null;
  selection_num: number;
  like_num: number;
  created_at: string;
};

export type PublicSelectionListItem = {
  id: number;
  collection_id: number;
  category_id: number;
  selection_title: string;
  keywords: Array<{ keyword_id: number; keyword_name: string }> | null;
  owner_name: string;
  image_url: string | null;
};

export type PublicSelectionDetail = {
  id: number;
  collection_id: number;
  category_id: number;
  selection_title: string;
  description: string | null;
  is_ordered: boolean;
  link: string | null;
  items: unknown;
  keywords: Array<{ keyword_id: number; keyword_name: string }> | null;
  created_at: string;
  owner_name: string;
  is_selectable: boolean;
  selection_images: Array<{ image_url: string; sort_order: number }>;
};

const REVALIDATE_SECONDS = 60;

function getApiBase(): string {
  const base = process.env.API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL is not set");
  return base.replace(/\/+$/, "");
}

async function fetchPublic<T>(path: string): Promise<T | null> {
  const res = await fetch(`${getApiBase()}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Public API ${path} failed: ${res.status}`);
  }

  const body = (await res.json()) as { errorCode: string; data: Json };
  return (body.data ?? null) as T | null;
}

export async function getPublicCollection(
  collectionId: number
): Promise<PublicCollection | null> {
  const data = await fetchPublic<{ collection: PublicCollection }>(
    `/public/collections/${collectionId}`
  );
  return data?.collection ?? null;
}

export async function getPublicSelections(
  collectionId: number
): Promise<PublicSelectionListItem[]> {
  const data = await fetchPublic<{ selections: PublicSelectionListItem[] }>(
    `/public/collections/${collectionId}/selections`
  );
  return data?.selections ?? [];
}

export async function getPublicSelectionDetail(
  collectionId: number,
  selectionId: number
): Promise<PublicSelectionDetail | null> {
  const data = await fetchPublic<{ selection: PublicSelectionDetail }>(
    `/public/collections/${collectionId}/selections/${selectionId}`
  );
  return data?.selection ?? null;
}
