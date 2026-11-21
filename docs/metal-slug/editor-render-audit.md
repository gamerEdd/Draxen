# Verificación de imágenes del editor

Se corrigió la publicación que vaciaba frontend/dist mientras las imágenes seguían convirtiéndose. Ahora la compilación termina en frontend/.dist-staging y publica las imágenes antes de reemplazar index.html; conserva los recursos de versiones anteriores para pestañas abiertas.

Las URLs incluyen una versión derivada del contenido para evitar errores antiguos en caché. El selector utiliza miniaturas WebP de hasta 200 px, cargadas sin esperar al scroll. Si falla una miniatura, intenta el WebP completo y luego el PNG original; la vista previa también dispone del PNG de recuperación. Los fallos definitivos muestran un aviso en vez de quedar invisibles.

Resultados de la versión 734ca5a82a0b:

- 368/368 recursos públicos descargados y decodificados sin errores: 181 WebP, 181 miniaturas y 6 fondos de prendas.
- Navegador en https://sigue-me.com/personalizar?design=drop100-buggy-circo: 181/181 miniaturas completas con dimensiones válidas y cero avisos de carga.
- Buggy · Circo Pirata visible en la miniatura y sobre la camiseta. Evidencia: buggy-editor-verificado.png.
- Filtro Videojuegos: 30/30 miniaturas cargadas.
- Compilación final publicada correctamente sin vaciar el sitio activo.
- 13 pruebas de catálogo, solicitudes y precios pasan.

La auditoría pública se puede repetir con node scripts/verificar-imagenes-publicadas.mjs; resultados detallados en public-image-audit.json.
