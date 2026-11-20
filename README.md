# Barakah Tech Hub — Sitio Corporativo

Web estática premium enterprise de **Barakah Tech Hub**, empresa matriz de **Upway** e **Inworker**.

Stack: HTML + CSS + JS vanilla. Cero dependencias, cero build. Carga ultrarrápida y puntuación Lighthouse ~100.

## Estructura

```
├── index.html            # Landing (Hero, Ecosistema, Manifiesto, Servicios, Insights, Contacto)
├── css/styles.css        # Estilos (paleta oscura + acento cian, tipografía Inter)
├── js/main.js            # Animaciones reveal, nav sticky, menú móvil
└── legal/                # Privacidad, Términos, Aviso Legal, Cookies
```

## Desarrollo local

```bash
python -m http.server 8080
# abre http://localhost:8080
```

## Despliegue en Render (Static Site)

1. Sube este repositorio a GitHub.
2. En [Render](https://dashboard.render.com) → **New** → **Static Site**.
3. Conecta el repositorio.
4. Configuración:
   - **Build Command:** *(vacío — no hay build)*
   - **Publish Directory:** `.` (raíz)
5. Deploy. Render servirá el sitio con HTTPS gratis en `barakah-tech-hub.onrender.com` (o tu dominio propio en Settings → Custom Domains).

Cada `git push` a la rama principal redespliega automáticamente.

## Modelo de negocio

Barakah Tech Hub ofrece servicios de **desarrollo web, aplicaciones y automatización** para todo tipo de cliente (emprendedores, pymes y empresas) con un modelo de **suscripción mensual en COP**.

Precios mensuales (incluyen hosting en Render, equivalente a $7 USD valorados dentro de tu cuota):
- **Starter:** desde **$69.000 – $89.000 COP/mes** — sitio web corporativo o landing page (hasta 5 páginas).
- **Growth:** desde **$189.000 COP/mes** — aplicación web o software a medida con usuarios, roles, panel de administración y soporte prioritario.
- **Scale:** desde **$499.000 COP/mes** — plataformas técnicas, automatización con IA, equipo dedicado y SLA.

**El dominio es exclusivo del cliente:** lo adquieres y pagas directamente donde prefieras (GoDaddy, Namecheap, etc.). Barakah Tech Hub no revende dominios.

Permanencia mínima de 6 meses en planes mensuales. ¿Prefieres pago único al contado? Cotizamos tu proyecto por separado.

Los precios están en `index.html` (sección Precios y Planes) y en el detalle de cada servicio bajo `servicios/`.

## Estructura

```
├── index.html            # Landing: Hero, Para quién, Servicios, Precios y Planes, Cómo comprar, FAQ, Insights, Contacto
├── css/styles.css        # Estilos + componentes de precios, toggle, FAQ, cookies, WhatsApp
├── js/main.js            # Nav, menú móvil, reveal animations
├── js/cookies.js         # Banner de cookies + toggle de precios (al contado / plan)
├── servicios/            # Detalle de cada servicio con precios al contado y plan mensual
├── legal/                # Privacidad, Términos (con cláusulas de pago y planes), Aviso Legal, Cookies
├── sitemap.xml           # SEO
├── robots.txt            # SEO
├── site.webmanifest      # PWA
└── package.json          # Playwright (QA)
```

## Desarrollo local

```bash
python -m http.server 8080
# abre http://localhost:8080
```

## Despliegue en Render (Static Site)

1. Sube este repositorio a GitHub.
2. En [Render](https://dashboard.render.com) → **New** → **Static Site**.
3. Conecta el repositorio.
4. Configuración:
   - **Build Command:** *(vacío — no hay build)*
   - **Publish Directory:** `.` (raíz)
5. Deploy. Render servirá el sitio con HTTPS gratis.

Cada `git push` a la rama principal redespliega automáticamente.

## Pendientes antes de producción (obligatorio para vender)

- [ ] Completar datos registrales reales en `legal/aviso-legal.html` (NIT, domicilio social, cámara de comercio).
- [ ] Reemplazar el teléfono placeholder `+573000000000` y el correo `contacto@barakahtechhub.com` por tus datos reales en `index.html`, `legal/` y JSON-LD.
- [ ] Conectar un dominio propio en Render (Settings → Custom Domains) y usar ese dominio en el JSON-LD y sitemap.
- [ ] Configurar un medio de pago real (Stripe, PayPal, link de pago bancario o Wompi) en los botones "Contratar" — por ahora apuntan a `mailto:` y WhatsApp.
- [ ] Revisar y adaptar `legal/terminos.html` con un abogado según tu país (cláusulas de consumo, reembolsos, facturación en COP).
- [ ] Conectar los artículos de Insights a páginas reales (o un CMS headless como Sanity más adelante).
