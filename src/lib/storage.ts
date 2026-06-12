// ── Types ──
export interface MaterialData {
  id: string;
  title: string;
  text: string;
  summary: string;
  keyPoints: string[];
  definitions: { term: string; definition: string }[];
  formulas: string[];
  createdAt: string;
  pageCount?: number;
}

const STORAGE_KEY = "rangkumify_materials";

export function getMaterials(): MaterialData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getMaterial(id: string): MaterialData | null {
  const materials = getMaterials();
  return materials.find((m) => m.id === id) || null;
}

export function saveMaterial(data: MaterialData): void {
  const materials = getMaterials();
  materials.unshift(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
}

export function deleteMaterial(id: string): void {
  const materials = getMaterials().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
}
