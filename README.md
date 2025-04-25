# UI Panel SaaS Menu Manager

Un plugin de WordPress para gestionar el menú lateral del tema UI Panel SaaS Template. Permite personalizar de manera sencilla el panel lateral, añadiendo opciones de menú con iconos, enlaces y submenús.

![Vista previa del plugin](https://via.placeholder.com/800x400/f5f5f5/333333?text=UI+Panel+SaaS+Menu+Manager)

## 📋 Características principales

- Interfaz intuitiva para gestionar elementos del menú lateral
- Soporte para iconos de Tabler Icons (`ti-*`)
- Arrastrar y soltar para ordenar elementos
- Soporte para submenús ilimitados
- Restringir visibilidad según roles de usuario
- Vista previa en tiempo real
- Integración perfecta con el tema UI Panel SaaS Template

## 🚀 Instalación

1. Descarga este plugin como un archivo ZIP
2. Ve a tu panel de administración de WordPress > Plugins > Añadir nuevo
3. Haz clic en "Subir plugin" y selecciona el archivo ZIP
4. Activa el plugin después de la instalación

## 🛠️ Uso

### Gestión del menú lateral

1. Navega a "UI Panel Menú" en el panel lateral de administración de WordPress
2. Usa el formulario de la izquierda para añadir nuevos elementos
3. Arrastra y suelta los elementos para cambiar su orden
4. Haz clic en un elemento para editarlo
5. Haz clic en el icono de papelera para eliminar un elemento
6. Guarda los cambios haciendo clic en "Guardar cambios"

### Tipos de elementos

- **Enlace**: Un elemento clicable que enlaza a una URL
- **Sección**: Un título de sección no clicable que sirve como separador

### Iconos

Puedes usar cualquier icono de [Tabler Icons](https://tabler-icons.io/). Solo necesitas usar el nombre de la clase con el prefijo `ti-`. Por ejemplo:

- `ti-dashboard` para un icono de dashboard
- `ti-settings` para un icono de configuración
- `ti-user` para un icono de usuario

### Shortcodes

El plugin proporciona dos shortcodes para usar en tus páginas:

1. `[ui_panel_menu]` - Muestra todo el menú lateral
   - Atributos: `menu_id` (por defecto: "sidebar"), `class` (clase CSS adicional)
   - Ejemplo: `[ui_panel_menu menu_id="sidebar" class="my-custom-class"]`

2. `[ui_panel_menu_item id="X"]` - Muestra un elemento de menú específico
   - Atributos: `id` (obligatorio), `class` (clase CSS adicional)
   - Ejemplo: `[ui_panel_menu_item id="5" class="button"]`

## 🔌 Integración con el tema

Este plugin está diseñado para integrarse perfectamente con el tema UI Panel SaaS Template. Reemplaza automáticamente el menú lateral del tema con tu menú personalizado.

### Iconos en páginas y entradas

En el editor de páginas y entradas, encontrarás un nuevo meta box llamado "Icono de menú UI Panel". Puedes usar este campo para asignar un icono a la página/entrada cuando aparezca en el menú.

## 📦 Estructura del plugin

```
stryker-nova-VortexUI/
├── ui-panel-saas-menu-manager.php       # Archivo principal del plugin
├── includes/
│   ├── class-ui-panel-saas-menu-manager.php    # Clase principal
│   ├── shortcodes.php                          # Definiciones de shortcodes
│   ├── theme-integration.php                   # Integración con el tema
│   └── admin/
│       ├── class-ui-panel-saas-menu-admin.php       # Clase de administración
│       └── class-ui-panel-saas-menu-admin-ajax.php  # Métodos AJAX
├── assets/
│   ├── css/
│   │   └── admin.css                           # Estilos de administración
│   └── js/
│       └── admin.js                            # JavaScript de administración
└── README.md                                  # Este archivo
```

## 📋 Requisitos

- WordPress 5.0 o superior
- PHP 7.2 o superior
- Tema UI Panel SaaS Template (para una integración completa)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un error o tienes una sugerencia de mejora, no dudes en abrir un issue o enviar un pull request.

## 📜 Licencia

Este plugin está licenciado bajo [GPL v2 o posterior](https://www.gnu.org/licenses/gpl-2.0.html).

## 👨‍💻 Autor

Desarrollado por [StrykerUX](https://github.com/StrykerUX)

---

### 🔍 Capturas de pantalla

#### Panel de administración
![Panel de administración](https://via.placeholder.com/800x400/f5f5f5/333333?text=Panel+de+Administración)

#### Vista previa del menú
![Vista previa del menú](https://via.placeholder.com/800x400/f5f5f5/333333?text=Vista+Previa+del+Menú)

#### Selección de iconos
![Selección de iconos](https://via.placeholder.com/800x400/f5f5f5/333333?text=Selección+de+Iconos)
