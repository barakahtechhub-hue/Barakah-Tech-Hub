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

## Pendientes antes de producción

- [ ] Completar datos registrales reales en `legal/aviso-legal.html` (NIF/CIF, domicilio social).
- [ ] Actualizar correos de contacto (`contact@`, `privacy@`) por el dominio corporativo real.
- [ ] Conectar los artículos de Insights a páginas reales (o un CMS headless como Sanity más adelante).
