import type { Auto } from "@/types/auto";

export type Favorito = {
  id: number;
  autoId: number;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  listaNombre: string;
  nota: string | null;
};

export type FavoritoMetadataRequest = {
  listaNombre?: string | null;
  nota?: string | null;
};

export type FavoritoAuto = Pick<
  Auto,
  | "id"
  | "color"
  | "marcaNombre"
  | "modeloNombre"
  | "categoriaNombre"
  | "precio"
  | "anioFabricacion"
  | "imagenPortadaUrl"
>;

export type FavoritoDetalle = Favorito & {
  auto: FavoritoAuto;
};

export type FavoritoLista = {
  nombre: string;
  totalFavoritos: number;
  ultimaActualizacion: string | null;
};

export type Conteo = {
  nombre: string;
  total: number;
};

export type FavoritoSenales = {
  totalFavoritos: number;
  listas: Conteo[];
  marcasPrincipales: Conteo[];
  categoriasPrincipales: Conteo[];
  autoIds: number[];
};
