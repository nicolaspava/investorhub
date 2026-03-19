# La Curaduría

Guía cultural abierta de música, arte y cultura · Bogotá, Colombia.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Variables (design tokens de marca)
- **Deploy**: Vercel

## Estructura del proyecto

```
lacuraduria/
├── public/
│   └── index.html          # Investor teaser (HTML estático)
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout + metadata
│       ├── page.tsx         # Home → redirige a /investor durante prueba
│       ├── globals.css      # Variables de marca globales
│       └── investor/
│           └── page.tsx     # Investor hub (sirve el teaser)
├── package.json
├── next.config.js
└── tsconfig.json
```

## Cómo correr localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000/investor](http://localhost:3000/investor)

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Framework: **Next.js** (detectado automáticamente)
3. No requiere variables de entorno para esta fase

## Roadmap

- [x] Investor teaser estático
- [ ] Migrar teaser a componentes React
- [ ] Home principal / landing
- [ ] Mapa cultural (integración Mapbox)
- [ ] Catálogo de perfiles y eventos
- [ ] Marketplace
- [ ] Auth (Supabase)

---

**Contacto**: nicolas.pava@lacuraduria.net · +57 304 413 8497  
**Web**: [lacuraduria.net](https://lacuraduria.net)
