import type { Auto } from "@/types/auto";

export type ComparadorCriterio =
  | "general"
  | "precio"
  | "anioFabricacion"
  | "marca"
  | "categoria"
  | "motor"
  | "caballosFuerza"
  | "rendimiento"
  | "velocidadMaxima"
  | "precioSalidaEstimado"
  | "precioReferenciaActual";

export type AutoComparado = Pick<
  Auto,
  | "id"
  | "marcaNombre"
  | "modeloNombre"
  | "precio"
  | "precioReferenciaActual"
  | "precioSalidaEstimado"
  | "anioFabricacion"
  | "color"
  | "motor"
  | "cilindradaCc"
  | "caballosFuerza"
  | "torqueNm"
  | "consumoCiudad"
  | "consumoCarretera"
  | "velocidadMaxima"
  | "aceleracionCeroACien"
  | "tipoCombustible"
  | "transmision"
  | "traccion"
  | "pesoKg"
  | "puertas"
  | "moneda"
  | "descripcionValor"
  | "resumen"
  | "categoriaNombre"
  | "imagenPortadaUrl"
> & {
  fortalezas?: string[];
  alertas?: string[];
};

export type AtributoComparadoValor = {
  autoId: number;
  marcaNombre: string | null;
  modeloNombre: string | null;
  valor: string | number | boolean | null;
  valorFormateado: string | null;
  lider: boolean;
  empate: boolean;
  observacion: string | null;
};

export type AtributoComparado = {
  clave: string;
  etiqueta: string;
  tipoDato: string;
  destacable: boolean;
  ordenable: boolean;
  unidad: string | null;
  mejorValor: string | null;
  valores: AtributoComparadoValor[];
};

export type DiferenciaClave = {
  atributo: string;
  etiqueta: string;
  descripcion: string;
  autoIdGanador: number | null;
  valorGanador: string | null;
  impacto: string | null;
};

export type RankingComparacion = {
  posicion: number;
  autoId: number;
  marcaNombre: string | null;
  modeloNombre: string | null;
  criterio: string;
  motivo: string | null;
  puntaje: number | null;
};

export type ContextoValor = {
  descripcionGeneral: string;
  criterioPrecioPrincipal: string;
  criterioPrecioSecundario: string;
  nota: string | null;
};

export type ComparacionDTO = {
  criterio: string;
  tipoComparacion?: string;
  resumen?: string;
  moneda?: string | null;
  autosComparados: AutoComparado[];
  atributosComparados?: AtributoComparado[];
  diferenciasClave?: DiferenciaClave[];
  ranking?: RankingComparacion[];
  contextoValor?: ContextoValor;
};
