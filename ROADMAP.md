# Country Explorer — Roadmap

## v1.1 · Performance & UX

- [ ] **Paginación / scroll infinito** — Home carga 250 países de golpe, lo cual es innecesario. Implementar `slice` con un botón "load more" o un `IntersectionObserver` para scroll infinito.
- [ ] **Sorting en Home** — agregar un selector para ordenar por nombre (A→Z), población (mayor a menor) y área. Va junto al `RegionFilter`, mismo estilo mono.
- [ ] **Debounce en SearchBar** — el filtro corre en cada keystroke. Agregar un debounce de ~200ms para no recalcular `useMemo` en cada letra.

---

## v1.2 · Features nuevas

- [ ] **Mapa interactivo con Leaflet** — agregar `react-leaflet` y mostrar un mapa en `CountryDetail` centrado en las coordenadas del país. Click en el mapa navega al país correspondiente desde Home.
- [ ] **Países vecinos (borders)** — REST Countries devuelve `borders` (array de códigos). En `CountryDetail`, mostrar los países limítrofes como chips clickeables que navegan a ese país.
- [ ] **Modo oscuro / claro toggle** — agregar un botón en el header que intercambie entre Cartographic Dark y una variante light (crema + verde oscuro invertido).

---

## v1.3 · Mobile & Polish

- [ ] **Responsive mobile** — revisar las cuatro páginas en viewport de 375px. El grid de Home y la tabla de Compare necesitan ajustes específicos.
- [ ] **Page transitions** — animación de entrada/salida entre rutas con `react-transition-group` o CSS puro. Algo sutil: fade + slight translateY.
- [ ] **Skeleton loaders elaborados** — reemplazar los divs con `animate-pulse` por skeletons que imiten la forma real de cada componente (flag ratio, líneas de texto, badges).

---

## v1.4 · Extra

- [ ] **Compartir país** — botón en `CountryDetail` que copia la URL al clipboard. Un solo `navigator.clipboard.writeText(window.location.href)`.
- [ ] **Estadísticas de Visited** — en la página Visited, mostrar total de regiones cubiertas y porcentaje del mundo visitado (`visited.length / 250 * 100`).
- [ ] **PWA** — agregar `vite-plugin-pwa` para que la app sea instalable en móvil y funcione offline con los datos ya cargados cacheados.