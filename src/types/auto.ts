import type { PageResponse } from "@/types/api";

export type Auto = {
  id: number;
  color: string | null;
  precio: number | null;
  precioReferenciaActual: number | null;
  precioSalidaEstimado: number | null;
  anioFabricacion: number | null;
  motor: string | null;
  cilindradaCc: number | null;
  caballosFuerza: number | null;
  torqueNm: number | null;
  consumoCiudad: number | null;
  consumoCarretera: number | null;
  velocidadMaxima: number | null;
  aceleracionCeroACien: number | null;
  tipoCombustible: string | null;
  transmision: string | null;
  traccion: string | null;
  pesoKg: number | null;
  puertas: number | null;
  moneda: string | null;
  descripcionValor: string | null;
  resumen: string | null;
  marcaId: number | null;
  marcaNombre: string | null;
  modeloId: number | null;
  modeloNombre: string | null;
  categoriaId: number | null;
  categoriaNombre: string | null;
  imagenPortadaUrl: string | null;
};

export type AutoSortBy =
  | "precio"
  | "precioReferenciaActual"
  | "precioSalidaEstimado"
  | "anioFabricacion"
  | "caballosFuerza"
  | "torqueNm"
  | "velocidadMaxima"
  | "aceleracionCeroACien"
  | "motor"
  | "tipoCombustible"
  | "transmision"
  | "traccion"
  | "color"
  | "marca";

export type AutoSearchParams = {
  marcaId?: number;
  modeloId?: number;
  categoriaId?: number;
  precioMin?: number;
  precioMax?: number;
  precioReferenciaActualMin?: number;
  precioReferenciaActualMax?: number;
  precioSalidaEstimadoMin?: number;
  precioSalidaEstimadoMax?: number;
  anioMin?: number;
  anioMax?: number;
  caballosFuerzaMin?: number;
  caballosFuerzaMax?: number;
  torqueNmMin?: number;
  torqueNmMax?: number;
  velocidadMaximaMin?: number;
  velocidadMaximaMax?: number;
  aceleracionCeroACienMin?: number;
  aceleracionCeroACienMax?: number;
  color?: string;
  motor?: string;
  tipoCombustible?: string;
  transmision?: string;
  traccion?: string;
  texto?: string;
  page?: number;
  size?: number;
  sortBy?: AutoSortBy;
  direction?: "asc" | "desc";
};

export type AutoBusquedaResponse = PageResponse<Auto>;

export type Marca = {
  id: number;
  nombre: string;
};

export type Modelo = {
  id: number;
  nombre: string;
  marcaId: number;
  marcaNombre: string;
};

export type Categoria = {
  id: number;
  nombre: string;
  descripcion: string | null;
};
