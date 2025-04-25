# Tabler Icons para StrykerNova VortexUI

Este directorio contiene los iconos SVG del proyecto [Tabler Icons](https://tabler-icons.io/) para su uso en el plugin StrykerNova VortexUI.

## Estructura

- Los iconos SVG se almacenan individualmente en este directorio
- El archivo CSS que define las clases para los iconos está en `assets/css/tabler-icons.css`
- El archivo JavaScript que gestiona los iconos está en `assets/js/tabler-icons-manager.js`

## Cómo añadir más iconos

Para añadir más iconos al plugin, sigue estos pasos:

1. Descarga el icono SVG necesario desde [Tabler Icons](https://tabler-icons.io/) (versión outline)
2. Guarda el archivo SVG en este directorio con el nombre del icono (por ejemplo, `mail.svg`)
3. Añade la entrada CSS correspondiente en `assets/css/tabler-icons.css`:

```css
.ti-nombredelicono::before {
  content: "";
  background-image: url('../tabler-icons-outline/nombredelicono.svg');
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  background-size: cover;
}
```

4. Añade el nombre del icono al array `availableIcons` en `assets/js/tabler-icons-manager.js`:

```javascript
availableIcons: [
    // ... otros iconos existentes
    'nombredelicono',
]
```

## Iconos incluidos actualmente

Actualmente el plugin incluye los siguientes iconos:

- dashboard.svg - Icono de panel de control
- home.svg - Icono de inicio
- settings.svg - Icono de configuración
- user.svg - Icono de usuario
- users.svg - Icono de múltiples usuarios
- message.svg - Icono de mensaje

## Uso en el plugin

Para utilizar los iconos en el plugin, simplemente usa la clase CSS correspondiente:

```html
<i class="ti ti-dashboard"></i>
<i class="ti ti-home"></i>
<i class="ti ti-settings"></i>
```

También puedes añadir clases de tamaño:

```html
<i class="ti ti-dashboard ti-lg"></i>  <!-- 1.33x tamaño -->
<i class="ti ti-dashboard ti-2x"></i>  <!-- 2x tamaño -->
```

O añadir animación de rotación:

```html
<i class="ti ti-dashboard ti-spin"></i>
```

## Licencia

Los iconos de Tabler Icons están licenciados bajo [MIT License](https://github.com/tabler/tabler-icons/blob/master/LICENSE).
