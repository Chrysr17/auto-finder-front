# Frontend Implementation Context

Fecha: 2026-05-02

Este archivo resume que debe hacer el front a partir de `docs/api-contract.md`. El contrato API es la fuente de verdad para rutas, payloads y tipos.

## Objetivo de la Plataforma

Auto Finder es una plataforma de exploracion y descubrimiento de autos. No debe sentirse como un marketplace transaccional centrado en compra inmediata, sino como una experiencia para investigar, filtrar, comparar y guardar autos de interes.

La experiencia principal debe permitir:
- Descubrir autos por atributos tecnicos, historicos y de valor.
- Comparar autos con ranking, diferencias clave y contexto de precio.
- Entender mejor autos antiguos, deportivos o de coleccion mediante precio de salida estimado, precio actual aproximado y descripcion de valor.
- Guardar autos en favoritos, organizarlos por listas y añadir notas personales.
- Usar señales de favoritos para sugerir exploraciones o recomendaciones simples.

El front debe priorizar claridad de informacion, filtros utiles, comparacion legible y flujos rapidos para guardar/organizar autos.

## Objetivo

Actualizar el front para consumir el backend actual a traves del gateway:

```text
http://localhost:9000
```

No apuntar a servicios directos salvo debug puntual. Los puertos directos estan documentados en `docs/api-contract.md`.

## Prioridad de Implementacion

1. Configurar base URL del cliente HTTP a `http://localhost:9000`.
2. Actualizar tipos/modelos TypeScript segun el contrato.
3. Actualizar servicio de autos y filtros de discovery.
4. Actualizar comparador avanzado.
5. Actualizar favoritos enriquecidos.
6. Ajustar manejo de errores y estados de autenticacion.

## Configuracion HTTP

Crear o revisar una configuracion central, por ejemplo:

```ts
export const API_BASE_URL = "http://localhost:9000";
```

El cliente HTTP debe:
- Enviar `Authorization: Bearer <token>` solo cuando haya sesion.
- No enviar token en catalogo publico si no existe sesion.
- Manejar `401` limpiando sesion local o redirigiendo a login.
- Mostrar mensajes de `ErrorResponse.message` cuando el backend devuelva error controlado.

## Auth

Pantallas/servicios afectados:
- Login
- Registro
- Estado global de sesion

Endpoints:
- `POST /api/auth/login`
- `POST /api/auth/register`

Acciones:
- Guardar `token` devuelto por backend.
- Usar el token en endpoints de favoritos.
- No permitir registrar `ADMIN` desde UI publica.

Tipos sugeridos:

```ts
type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  rol?: "USER";
};

type JwtResponse = {
  token: string;
};
```

## Discovery de Autos

Pantallas/servicios afectados:
- Listado de autos
- Busqueda avanzada
- Panel de filtros
- Ordenamiento
- Paginacion
- Detalle de auto

Endpoints principales:
- `GET /api/autos`
- `GET /api/autos/buscar`
- `GET /api/autos/{id}`
- `GET /api/marcas`
- `GET /api/modelos`
- `GET /api/categorias`

Actualizar `AutoSearchParams` con:

```ts
type AutoSearchParams = {
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
```

Actualizar opciones de orden:

```ts
type AutoSortBy =
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
```

UI sugerida:
- Busqueda libre: input `texto`.
- Selects: marca, modelo, categoria, combustible, transmision, traccion.
- Rangos numericos: precio actual, precio salida, año, HP, torque, velocidad maxima, 0-100.
- Orden: select `sortBy` + toggle/direction `asc`/`desc`.

Reglas:
- No enviar params vacios, `null`, `undefined` o strings en blanco.
- `page` es cero-indexado.
- `size` maximo backend: `100`.
- Para aceleracion `0-100`, menor valor suele ser mejor; usar `sortBy=aceleracionCeroACien&direction=asc`.

## Comparador Avanzado

Pantallas/servicios afectados:
- Selector de autos a comparar
- Vista de comparacion
- Ranking
- Diferencias clave
- Matriz de atributos

Endpoint:

```http
POST /api/comparar?criterio=general
```

Body:

```ts
number[]
```

Reglas:
- Enviar al menos 2 ids.
- Evitar ids duplicados desde el front.
- Mostrar error backend si llega `400` o `404`.

Criterios visibles recomendados:
- `general`
- `precio`
- `anioFabricacion`
- `categoria`
- `motor`
- `caballosFuerza`
- `rendimiento`
- `velocidadMaxima`
- `precioSalidaEstimado`
- `precioReferenciaActual`

UI sugerida:
- Encabezado con `resumen`.
- Cards de `autosComparados`.
- Tabla de `atributosComparados`.
- Lista de `diferenciasClave`.
- Ranking visual usando `ranking`.
- Bloque informativo de `contextoValor` cuando venga presente.

## Favoritos Enriquecidos

Pantallas/servicios afectados:
- Boton agregar/quitar favorito
- Mis favoritos
- Listas de favoritos
- Notas del usuario
- Recomendaciones simples basadas en señales

Todos requieren token.

Endpoints:
- `GET /api/favoritos`
- `GET /api/favoritos?listaNombre=Track`
- `POST /api/favoritos/{autoId}`
- `PATCH /api/favoritos/{autoId}`
- `DELETE /api/favoritos/{autoId}`
- `GET /api/favoritos/detalle`
- `GET /api/favoritos/detalle-enriquecido`
- `GET /api/favoritos/listas`
- `GET /api/favoritos/senales`

Tipos sugeridos:

```ts
type Favorito = {
  id: number;
  autoId: number;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  listaNombre: string;
  nota: string | null;
};

type FavoritoMetadataRequest = {
  listaNombre?: string | null;
  nota?: string | null;
};

type FavoritoDetalle = Favorito & {
  auto: FavoritoAuto;
};

type FavoritoLista = {
  nombre: string;
  totalFavoritos: number;
  ultimaActualizacion: string | null;
};

type FavoritoSenales = {
  totalFavoritos: number;
  listas: Conteo[];
  marcasPrincipales: Conteo[];
  categoriasPrincipales: Conteo[];
  autoIds: number[];
};

type Conteo = {
  nombre: string;
  total: number;
};
```

Flujos recomendados:
- Agregar favorito rapido: `POST /api/favoritos/{autoId}` sin body.
- Agregar con lista/nota: `POST /api/favoritos/{autoId}` con `FavoritoMetadataRequest`.
- Editar lista/nota: `PATCH /api/favoritos/{autoId}`.
- Mostrar listas: `GET /api/favoritos/listas`.
- Mostrar favoritos por lista: `GET /api/favoritos?listaNombre=<nombre>`.
- Mostrar cards completas: `GET /api/favoritos/detalle-enriquecido`.
- Recomendaciones: usar `GET /api/favoritos/senales` y buscar autos por marca/categoria dominante, excluyendo `autoIds`.

Reglas:
- `listaNombre` default backend: `General`.
- `listaNombre` maximo: 80 caracteres.
- `nota` maximo: 500 caracteres.
- Si `POST` devuelve `409`, el auto ya esta en favoritos.

## Manejo de Errores

Implementar helper para normalizar errores:

```ts
type ApiError = {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
};
```

Comportamiento sugerido:
- `400`: mostrar `message` junto al formulario/filtro.
- `401`: pedir login.
- `403`: mostrar acceso denegado.
- `404`: mostrar recurso no encontrado.
- `409`: en favoritos, marcar como ya agregado.
- `500`: mostrar mensaje generico.

## Checklist para el Front

- [ ] Base URL usa `http://localhost:9000`.
- [ ] Cliente HTTP adjunta token solo cuando existe.
- [ ] Tipos `Auto`, `AutoSearchParams`, `AutoBusquedaResponse` actualizados.
- [ ] Filtros nuevos visibles o soportados internamente.
- [ ] Opciones `sortBy` actualizadas.
- [ ] Comparador consume `atributosComparados`, `diferenciasClave`, `ranking` y `contextoValor`.
- [ ] Favoritos soporta listas y notas.
- [ ] Favoritos usa `PATCH` para editar metadata.
- [ ] Pantalla de favoritos puede filtrar por lista.
- [ ] Recomendaciones simples usan `/api/favoritos/senales`.
- [ ] Errores backend se muestran desde `ErrorResponse.message`.

## Criterios de Aceptacion

- El listado publico carga sin login.
- La busqueda avanzada permite combinar filtros nuevos y paginacion.
- El comparador no permite comparar menos de dos autos desde UI.
- El usuario autenticado puede agregar, editar y eliminar favoritos.
- El usuario puede crear o mover favoritos entre listas.
- Las señales de favoritos se muestran o se usan para recomendaciones.
- Ninguna llamada del front usa `localhost:9030-9033` en flujo normal.
