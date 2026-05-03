# API Contract Frontend

Fecha: 2026-05-02

Este contrato describe la API que debe consumir el front a traves del gateway. Usar `Authorization: Bearer <token>` solo en endpoints autenticados.

## Base URL

```text
http://localhost:9000
```

El gateway usa `server.port=9000` en `gateway-service/src/main/resources/application-local.yml`.

En Docker, el puerto tambien sale de `.env`:

```text
GATEWAY_PORT=9000
```

Para integracion normal, el front debe consumir siempre el gateway en `http://localhost:9000`.

Puertos directos de servicios locales solo para debug:
- `auth-service`: `http://localhost:9030`
- `auto-service`: `http://localhost:9031`
- `comparador-service`: `http://localhost:9032`
- `favorito-service`: `http://localhost:9033`

## Seguridad

Endpoints publicos:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/autos`
- `GET /api/autos/**`
- `GET /api/marcas/**`
- `GET /api/modelos/**`
- `GET /api/categorias/**`
- `POST /api/comparar`

Endpoints autenticados:
- `GET /api/favoritos/**`
- `POST /api/favoritos/**`
- `PATCH /api/favoritos/**`
- `DELETE /api/favoritos/**`

Endpoints `ADMIN`:
- `POST`, `PUT`, `DELETE` de catalogo: autos, marcas, modelos y categorias.

Formato de token:

```http
Authorization: Bearer eyJ...
```

## ErrorResponse

Formato comun esperado en errores controlados:

```json
{
  "timestamp": "2026-05-02T10:15:30",
  "status": 400,
  "error": "Solicitud invalida",
  "message": "precioMin no puede ser mayor que precioMax"
}
```

Codigos relevantes:
- `400`: payload invalido, filtros invalidos o referencia invalida.
- `401`: falta token o token invalido.
- `403`: token valido sin rol suficiente.
- `404`: recurso inexistente.
- `409`: conflicto, por ejemplo favorito duplicado.
- `500`: error inesperado.

## Auth

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "username": "christian",
  "password": "secret123"
}
```

Response `200`:

```json
{
  "token": "eyJ..."
}
```

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

Request:

```json
{
  "username": "christian",
  "password": "secret123",
  "email": "christian@example.com",
  "rol": "USER"
}
```

Response `201`:

```json
{
  "token": "eyJ..."
}
```

Nota: el registro publico no permite crear usuarios `ADMIN`.

## Autos

### Auto

```ts
type Auto = {
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
```

### Listar Autos

```http
GET /api/autos
```

Response `200`:

```json
[
  {
    "id": 1,
    "color": "Rojo",
    "precio": 55000,
    "precioReferenciaActual": 62000,
    "precioSalidaEstimado": 58000,
    "anioFabricacion": 2021,
    "motor": "3.0 Turbo",
    "cilindradaCc": null,
    "caballosFuerza": 382,
    "torqueNm": null,
    "consumoCiudad": null,
    "consumoCarretera": null,
    "velocidadMaxima": 250,
    "aceleracionCeroACien": null,
    "tipoCombustible": "Gasolina",
    "transmision": null,
    "traccion": null,
    "pesoKg": null,
    "puertas": null,
    "moneda": null,
    "descripcionValor": null,
    "resumen": null,
    "marcaId": 10,
    "marcaNombre": "Toyota",
    "modeloId": 20,
    "modeloNombre": "Supra",
    "categoriaId": 30,
    "categoriaNombre": "Coupe",
    "imagenPortadaUrl": "https://cdn.example.com/autos/1.jpg"
  }
]
```

Nota: `GET /api/autos` usa un listado liviano; varios campos largos o tecnicos pueden venir `null`.

### Buscar Autos

```http
GET /api/autos/buscar
```

Query params:

| Param | Type | Default | Descripcion |
| --- | --- | --- | --- |
| `marcaId` | number |  | Filtra por marca |
| `modeloId` | number |  | Filtra por modelo |
| `categoriaId` | number |  | Filtra por categoria |
| `precioMin` | number |  | Precio minimo base |
| `precioMax` | number |  | Precio maximo base |
| `precioReferenciaActualMin` | number |  | Precio actual minimo |
| `precioReferenciaActualMax` | number |  | Precio actual maximo |
| `precioSalidaEstimadoMin` | number |  | Precio historico/salida minimo |
| `precioSalidaEstimadoMax` | number |  | Precio historico/salida maximo |
| `anioMin` | number |  | Año minimo |
| `anioMax` | number |  | Año maximo |
| `caballosFuerzaMin` | number |  | HP minimo |
| `caballosFuerzaMax` | number |  | HP maximo |
| `torqueNmMin` | number |  | Torque minimo |
| `torqueNmMax` | number |  | Torque maximo |
| `velocidadMaximaMin` | number |  | Velocidad maxima minima |
| `velocidadMaximaMax` | number |  | Velocidad maxima maxima |
| `aceleracionCeroACienMin` | number |  | 0-100 minimo en segundos |
| `aceleracionCeroACienMax` | number |  | 0-100 maximo en segundos |
| `color` | string |  | Busqueda parcial case-insensitive |
| `motor` | string |  | Busqueda parcial case-insensitive |
| `tipoCombustible` | string |  | Coincidencia exacta case-insensitive |
| `transmision` | string |  | Coincidencia exacta case-insensitive |
| `traccion` | string |  | Coincidencia exacta case-insensitive |
| `texto` | string |  | Busca en resumen, descripcionValor, motor, marca, modelo y categoria |
| `page` | number | `0` | Pagina cero-indexada |
| `size` | number | `10` | Tamaño de pagina; maximo `100` |
| `sortBy` | string | `precio` | Campo de ordenamiento |
| `direction` | `asc` \| `desc` | `asc` | Direccion |

`sortBy` permitidos:
- `precio`
- `precioReferenciaActual`
- `precioSalidaEstimado`
- `anioFabricacion`
- `caballosFuerza`
- `torqueNm`
- `velocidadMaxima`
- `aceleracionCeroACien`
- `motor`
- `tipoCombustible`
- `transmision`
- `traccion`
- `color`
- `marca`

Ejemplo:

```http
GET /api/autos/buscar?texto=supra&caballosFuerzaMin=300&traccion=Trasera&sortBy=aceleracionCeroACien&direction=asc&page=0&size=12
```

Response `200`:

```json
{
  "content": [
    {
      "id": 1,
      "color": "Rojo",
      "precio": 55000,
      "precioReferenciaActual": 62000,
      "precioSalidaEstimado": 58000,
      "anioFabricacion": 2021,
      "motor": "3.0 Turbo",
      "cilindradaCc": 3000,
      "caballosFuerza": 382,
      "torqueNm": 500,
      "consumoCiudad": 13,
      "consumoCarretera": 9,
      "velocidadMaxima": 250,
      "aceleracionCeroACien": 4.1,
      "tipoCombustible": "Gasolina",
      "transmision": "Automatica",
      "traccion": "Trasera",
      "pesoKg": 1540,
      "puertas": 2,
      "moneda": "USD",
      "descripcionValor": "Alta demanda en unidades originales.",
      "resumen": "Deportivo equilibrado.",
      "marcaId": 10,
      "marcaNombre": "Toyota",
      "modeloId": 20,
      "modeloNombre": "Supra",
      "categoriaId": 30,
      "categoriaNombre": "Coupe",
      "imagenPortadaUrl": "https://cdn.example.com/autos/1.jpg"
    }
  ],
  "page": 0,
  "size": 12,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### Detalle de Auto

```http
GET /api/autos/{id}
```

Response `200`: `Auto`.

### Atajos Existentes

```http
GET /api/autos/marca/{marca}
GET /api/autos/categoria/{categoria}
```

Response `200`: `Auto[]`.

## Catalogos

### Marcas

```http
GET /api/marcas
GET /api/marcas/{id}
```

```ts
type Marca = {
  id: number;
  nombre: string;
};
```

### Modelos

```http
GET /api/modelos
GET /api/modelos/{id}
```

```ts
type Modelo = {
  id: number;
  nombre: string;
  marcaId: number;
  marcaNombre: string;
};
```

### Categorias

```http
GET /api/categorias
GET /api/categorias/{id}
```

```ts
type Categoria = {
  id: number;
  nombre: string;
  descripcion: string | null;
};
```

## Comparador

### Comparar Autos

```http
POST /api/comparar?criterio=general
Content-Type: application/json
```

Request:

```json
[1, 2, 3]
```

`criterio` default: `general`.

Criterios permitidos:
- `general`
- `precio`
- `anioFabricacion`
- `marca`
- `categoria`
- `motor`
- `caballosFuerza`
- `rendimiento`
- `velocidadMaxima`
- `precioSalidaEstimado`
- `precioReferenciaActual`

Alias aceptados por compatibilidad:
- `anio` -> `anioFabricacion`
- `hp` -> `caballosFuerza`
- `precioActualAproximado` -> `precioReferenciaActual`

Response `200`:

```json
{
  "criterio": "caballosfuerza",
  "tipoComparacion": "avanzada",
  "resumen": "Toyota Supra encabeza la comparacion de potencia.",
  "moneda": "USD",
  "autosComparados": [
    {
      "id": 1,
      "marcaNombre": "Toyota",
      "modeloNombre": "Supra",
      "precio": 55000,
      "precioReferenciaActual": 62000,
      "precioSalidaEstimado": 58000,
      "anioFabricacion": 2021,
      "color": "Rojo",
      "motor": "3.0 Turbo",
      "cilindradaCc": 3000,
      "caballosFuerza": 382,
      "torqueNm": 500,
      "consumoCiudad": 13,
      "consumoCarretera": 9,
      "velocidadMaxima": 250,
      "aceleracionCeroACien": 4.1,
      "tipoCombustible": "Gasolina",
      "transmision": "Automatica",
      "traccion": "Trasera",
      "pesoKg": 1540,
      "puertas": 2,
      "moneda": "USD",
      "descripcionValor": "Alta demanda en unidades originales.",
      "resumen": "Deportivo equilibrado.",
      "categoriaNombre": "Coupe",
      "fortalezas": ["Potencia alta para comparacion deportiva"],
      "alertas": ["Configuracion menos practica para uso familiar"],
      "imagenPortadaUrl": "https://cdn.example.com/autos/1.jpg"
    }
  ],
  "atributosComparados": [
    {
      "clave": "caballosfuerza",
      "etiqueta": "Caballos de fuerza",
      "tipoDato": "numero",
      "destacable": true,
      "ordenable": true,
      "unidad": "hp",
      "mejorValor": "382 hp",
      "valores": [
        {
          "autoId": 1,
          "marcaNombre": "Toyota",
          "modeloNombre": "Supra",
          "valor": 382,
          "valorFormateado": "382 hp",
          "lider": true,
          "empate": false,
          "observacion": "Entrega la cifra mas alta de potencia"
        }
      ]
    }
  ],
  "diferenciasClave": [
    {
      "atributo": "caballosfuerza",
      "etiqueta": "Caballos de fuerza",
      "descripcion": "Toyota Supra lidera en caballos de fuerza",
      "autoIdGanador": 1,
      "valorGanador": "382 hp",
      "impacto": "Entrega la cifra mas alta de potencia"
    }
  ],
  "ranking": [
    {
      "posicion": 1,
      "autoId": 1,
      "marcaNombre": "Toyota",
      "modeloNombre": "Supra",
      "criterio": "caballosfuerza",
      "motivo": "Ordenado por potencia descendente",
      "puntaje": 382
    }
  ],
  "contextoValor": {
    "descripcionGeneral": "La comparacion distingue entre precio historico de salida y valor actual aproximado.",
    "criterioPrecioPrincipal": "precioReferenciaActual",
    "criterioPrecioSecundario": "precioSalidaEstimado",
    "nota": "Usa el precio actual aproximado junto al precio de salida estimado para entender mejor la evolucion de valor."
  }
}
```

Notas:
- El backend omite campos `null` en parte de la respuesta del comparador.
- En errores, `400` cubre ids insuficientes, ids duplicados o criterio invalido; `404` cubre autos inexistentes.

## Favoritos

Todos los endpoints requieren token.

### Favorito

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
```

Reglas:
- `listaNombre` default: `"General"`.
- `listaNombre` maximo: 80 caracteres.
- `nota` maximo: 500 caracteres.

### Listar Favoritos

```http
GET /api/favoritos
GET /api/favoritos?listaNombre=Track
```

Response `200`:

```json
[
  {
    "id": 1,
    "autoId": 10,
    "fechaCreacion": "2026-05-02T12:00:00",
    "fechaActualizacion": "2026-05-02T12:00:00",
    "listaNombre": "Track",
    "nota": "Comparar contra Supra"
  }
]
```

### Agregar Favorito

```http
POST /api/favoritos/{autoId}
Content-Type: application/json
Authorization: Bearer <token>
```

Request opcional:

```json
{
  "listaNombre": "Track",
  "nota": "Comparar contra Supra"
}
```

Response `201`: `Favorito`.

Si se envia sin body, crea el favorito en lista `"General"` sin nota.

### Actualizar Metadata de Favorito

```http
PATCH /api/favoritos/{autoId}
Content-Type: application/json
Authorization: Bearer <token>
```

Request:

```json
{
  "listaNombre": "Compra futura",
  "nota": "Revisar precio actual"
}
```

Response `200`: `Favorito`.

### Eliminar Favorito

```http
DELETE /api/favoritos/{autoId}
Authorization: Bearer <token>
```

Response `204`.

### Detalle Simple de Favoritos

```http
GET /api/favoritos/detalle
```

Response `200`: `Auto[]`.

Este endpoint mantiene compatibilidad: devuelve solo autos favoritos sin metadata del favorito.

### Detalle Enriquecido de Favoritos

```http
GET /api/favoritos/detalle-enriquecido
```

Response `200`:

```json
[
  {
    "id": 1,
    "autoId": 10,
    "fechaCreacion": "2026-05-02T12:00:00",
    "fechaActualizacion": "2026-05-02T12:20:00",
    "listaNombre": "Track",
    "nota": "Comparar contra Supra",
    "auto": {
      "id": 10,
      "color": "Rojo",
      "marcaNombre": "Toyota",
      "modeloNombre": "Supra",
      "categoriaNombre": "Coupe",
      "precio": 55000,
      "anioFabricacion": 2021,
      "imagenPortadaUrl": "https://cdn.example.com/autos/10.jpg"
    }
  }
]
```

Nota: el `AutoDTO` de favoritos es mas liviano que `Auto` de `auto-service`.

### Listas de Favoritos

```http
GET /api/favoritos/listas
```

Response `200`:

```json
[
  {
    "nombre": "Daily",
    "totalFavoritos": 1,
    "ultimaActualizacion": "2026-05-02T12:20:00"
  },
  {
    "nombre": "Track",
    "totalFavoritos": 2,
    "ultimaActualizacion": "2026-05-02T12:30:00"
  }
]
```

### Señales de Favoritos

```http
GET /api/favoritos/senales
```

Response `200`:

```json
{
  "totalFavoritos": 3,
  "listas": [
    { "nombre": "Track", "total": 2 },
    { "nombre": "Daily", "total": 1 }
  ],
  "marcasPrincipales": [
    { "nombre": "Toyota", "total": 2 },
    { "nombre": "Honda", "total": 1 }
  ],
  "categoriasPrincipales": [
    { "nombre": "Sedan", "total": 2 },
    { "nombre": "Coupe", "total": 1 }
  ],
  "autoIds": [20, 21, 22]
}
```

Uso sugerido en front:
- Mostrar resumen de preferencias del usuario.
- Alimentar recomendaciones simples filtrando busquedas por marca/categoria dominante.
- Evitar recomendar autos ya incluidos en `autoIds`.

## Cambios que debe aplicar el Front

- Actualizar `AutoSearchParams` con:
  - `torqueNmMin`, `torqueNmMax`
  - `aceleracionCeroACienMin`, `aceleracionCeroACienMax`
  - `transmision`
  - `traccion`
  - `texto`
- Actualizar opciones de `sortBy` con:
  - `torqueNm`
  - `aceleracionCeroACien`
  - `transmision`
  - `traccion`
- Para favoritos, mantener soporte del flujo anterior y agregar:
  - body opcional al crear favorito
  - `PATCH /api/favoritos/{autoId}` para editar lista/nota
  - vistas de listas usando `/api/favoritos/listas`
  - recomendaciones/señales usando `/api/favoritos/senales`
- Si el front usa CORS via gateway, `PATCH` ya esta permitido.
