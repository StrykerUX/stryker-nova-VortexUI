# Actualización - Corrección de botones en "Estructura del Menú"

Se ha realizado una actualización para corregir un problema en el plugin **StrykerNova Vortex UI** donde los botones de "Editar" y "Eliminar" en la sección "Estructura del Menú" no funcionaban correctamente.

## El problema

En la versión anterior, los botones de editar y eliminar en la sección "Estructura del Menú" dejaban de funcionar después de reorganizar elementos mediante la función de arrastrar y soltar. Esto se debía a que jQuery UI Sortable recrea los elementos del DOM cuando se reordenan, lo que hacía que se perdieran los manejadores de eventos asignados a esos botones.

## La solución

La solución implementada utiliza "delegación de eventos" de jQuery, un patrón que permite que los eventos persistan incluso cuando los elementos del DOM son recreados. En lugar de asignar manejadores de eventos directamente a los botones, los eventos se delegan desde un elemento contenedor que siempre está presente en el DOM.

## Cambios realizados

1. Se creó un nuevo archivo `assets/js/admin-fix.js` con el código corregido.
2. Se modificó el archivo `includes/admin/class-ui-panel-saas-menu-admin.php` para cargar el nuevo archivo JavaScript.
3. La corrección principal consiste en reemplazar este código:

   ```javascript
   // Antes (problema)
   $('.uipsm-menu-edit').off('click').on('click', editMenuItem);
   $('.uipsm-menu-delete').off('click').on('click', deleteMenuItem);
   ```

   Por este código que utiliza delegación de eventos:

   ```javascript
   // Después (solución)
   $(document).on('click', '.uipsm-menu-edit', editMenuItem);
   $(document).on('click', '.uipsm-menu-delete', deleteMenuItem);
   ```

## Instrucciones de actualización

Si ya tienes el plugin instalado, sigue estos pasos para aplicar la corrección:

1. Descarga los archivos actualizados:
   - `assets/js/admin-fix.js` (archivo nuevo)
   - `includes/admin/class-ui-panel-saas-menu-admin.php` (archivo modificado)

2. Sube estos archivos a tu servidor, reemplazando la versión existente del archivo PHP.

3. Limpia cualquier caché de tu navegador y prueba la funcionalidad de editar y eliminar elementos del menú.

## Contacto

Si tienes alguna pregunta o problema con esta actualización, por favor contacta al equipo de soporte o abre un issue en el repositorio de GitHub.

---

Fecha de actualización: 25 de abril de 2025
