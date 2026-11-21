# Revisión de clasificación del catálogo — 14 de noviembre de 2026

Se revisaron visualmente los **492 diseños publicados** en 22 hojas de contacto, con ampliación individual de las discrepancias. Se conservaron todos los identificadores y los archivos de imagen. El inventario inicial de 488 archivos está en `inventory.json`; los cinco nuevos de Hunter x Hunter se revisaron en `sheet-22.jpg` y constan en `additional-inventory.json`; `review.json` registra por archivo su clasificación final, estado y SHA-256. Las correcciones de los importados también constan en `docs/imported-artwork/completed/`.

## Organización

| Categoría | Subcategorías | Diseños |
| --- | --- | ---: |
| Anime | One Piece, Solo Leveling, Hunter x Hunter, Demon Slayer, etc. | 151 |
| Rock | Megadeth, Slipknot, Iron Maiden, etc.; Arte rock, Calaveras y Arte oscuro para composiciones sin banda identificable | 256 |
| Memes | Animales, Humor cotidiano, Parodias, Aliens | 13 |
| Series animadas | Rick y Morty, Futurama | 40 |
| Videojuegos | Metal Slug | 30 |
| Ilustraciones | Fantasía oscura | 2 |

Los filtros están disponibles en la tienda, el personalizador y el editor de estampados. Hunter × Hunter y Hunter x Hunter se unifican. Los enlaces antiguos de series siguen abriendo su categoría principal y subcategoría. La búsqueda ignora tildes y mayúsculas. Las categorías se comparan de forma exacta para evitar coincidencias parciales como Death y Death Note.

El catálogo muestra una tarjeta por estampado, conservando los cuatro modelos de prenda dentro del personalizador. Frente y espalda siguen siendo archivos independientes cuando son diseños distintos. Cambiar filtros mantiene la vista en la sección del catálogo.

## Correcciones e identidad visual

Hay **23 correcciones de nombre, personaje o colección** en `corrections.json`. Entre ellas:

- `ref-221-front`: Solo Leveling; antes figuraba como One Piece.
- `ref-208-front`: Saitama y Garou / One Punch Man; antes Luffy / One Piece.
- `ref-232-front`: Kenjaku / Jujutsu Kaisen; antes Zoro / One Piece.
- `ref-236-front`, `ref-238-front`, `ref-240-front`, `ref-243-front`: Demon Slayer; antes asignados a otras series.
- `ref-154-front`: Ryuk / Death Note; antes Saint Seiya.
- `ref-219-front`, `ref-220-front`: Beru e Igris; antes ambos se titulaban Sung Jinwoo.
- `ref-116-front`: Rolling Stones; antes Whitesnake.
- `ref-119-front`: Avenged Sevenfold; antes Iron Maiden.

La revisión distingue el personaje representado de la rotulación: una palabra escrita en una recreación no confirma por sí sola la identidad. Se contrastó además a Gyomei con la [referencia oficial de Demon Slayer](https://demonslayer-anime.com/risshihen/character/?chara=gyomei).

### Excepciones señaladas

- **`ref-155-front` → Anime / Crossovers**: mezcla pendientes y texto de Zoro con una estatua característica de Solo Leveling. Se titula “Espadachín y estatua · Ilustración híbrida” y tiene estado de clasificación `mixed`. No se ofrece como representación inequívoca de una sola serie.
- **`ref-222-front` retirado el 15 de noviembre de 2026** por petición del usuario. Ya no aparece en el catálogo, los editores ni los filtros. Su registro queda archivado como `excluded` para impedir que una importación lo vuelva a publicar.

Esto es una revisión de correspondencia visual del catálogo, no una certificación de fidelidad canónica de las recreaciones ni una verificación de licencias. No se han regenerado ni sustituido los estampados.

## Comprobación y mantenimiento

Ejecutar `npm run test:catalog` para comprobar categorías, series corregidas, enlaces antiguos, agrupación de tarjetas y correspondencia de los hashes con los archivos revisados.

`shared/designCategories.mjs` concentra la taxonomía compartida. Las correcciones verificadas se conservan en la fuente de importados y en los registros por archivo. `scripts/register-imported-artwork.mjs` conserva también el estado de clasificación al registrar futuras recreaciones. El script `scripts/audit-catalog-classification.mjs` aplica las correcciones ya revisadas y genera el registro; **no identifica automáticamente imágenes nuevas**. Una imagen nueva o modificada requiere revisión visual antes de actualizar el informe.
