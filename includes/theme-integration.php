<?php
/**
 * Integración con el tema UI Panel SaaS
 * 
 * Este archivo proporciona funciones para integrar el plugin con el tema UI Panel SaaS
 * 
 * @package UI_Panel_SaaS_Menu_Manager
 * @since 1.0.0
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Modificar la salida del sidebar del tema
 */
function uipsm_override_theme_sidebar() {
    // Solo si estamos usando el tema UI Panel SaaS
    if (!function_exists('ui_panel_saas_is_dark_mode')) {
        return;
    }
    
    // Reemplazar la función de sidebar del tema si existe
    add_filter('wp_nav_menu_args', 'uipsm_filter_wp_nav_menu_args', 10, 1);
}
add_action('after_setup_theme', 'uipsm_override_theme_sidebar');

/**
 * Filtrar argumentos del menú para reemplazar el walker del tema
 *
 * @param array $args Argumentos del menú
 * @return array
 */
function uipsm_filter_wp_nav_menu_args($args) {
    // Solo modificar el menú sidebar
    if (isset($args['theme_location']) && $args['theme_location'] === 'sidebar') {
        // Obtener instancia del plugin
        $instance = UI_Panel_SaaS_Menu_Manager::get_instance();
        $menu_items = $instance->get_menu_items('sidebar');
        
        // Si hay elementos personalizados, reemplazar el contenido del menú
        if (!empty($menu_items)) {
            $args['items_wrap'] = '%3$s'; // Quitar contenedor UL
            $args['fallback_cb'] = '__return_false'; // No mostrar fallback
            
            // Almacenar elementos para usarlos en el filtro wp_nav_menu
            $GLOBALS['uipsm_custom_menu_items'] = $menu_items;
        }
    }
    
    return $args;
}

/**
 * Filtrar la salida final del menú
 *
 * @param string $nav_menu Salida HTML del menú
 * @param object $args Argumentos del objeto
 * @return string
 */
function uipsm_filter_wp_nav_menu($nav_menu, $args) {
    // Solo modificar el menú sidebar
    if (isset($args->theme_location) && $args->theme_location === 'sidebar' && isset($GLOBALS['uipsm_custom_menu_items'])) {
        // Obtener instancia del plugin
        $instance = UI_Panel_SaaS_Menu_Manager::get_instance();
        
        // Generar HTML con los elementos personalizados
        $nav_menu = $instance->build_menu_html($GLOBALS['uipsm_custom_menu_items']);
        
        // Limpiar variable global
        unset($GLOBALS['uipsm_custom_menu_items']);
    }
    
    return $nav_menu;
}
add_filter('wp_nav_menu', 'uipsm_filter_wp_nav_menu', 10, 2);

/**
 * Verificar si un elemento del menú está activo según la URL actual
 *
 * @param string $url URL a comprobar
 * @return boolean
 */
function uipsm_is_menu_item_active($url) {
    if (empty($url) || $url === '#') {
        return false;
    }
    
    // URL actual
    $current_url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    
    // Comprobar si la URL coincide
    return (strpos($current_url, $url) !== false);
}

/**
 * Añadir meta box en la edición de páginas/posts para seleccionar icono de menú
 */
function uipsm_add_menu_icon_meta_box() {
    add_meta_box(
        'uipsm_menu_icon',
        __('Icono de menú UI Panel', 'uipsm'),
        'uipsm_menu_icon_meta_box_callback',
        array('page', 'post'),
        'side'
    );
}
add_action('add_meta_boxes', 'uipsm_add_menu_icon_meta_box');

/**
 * Callback para el meta box de icono de menú
 *
 * @param WP_Post $post Objeto post actual
 */
function uipsm_menu_icon_meta_box_callback($post) {
    // Añadir nonce para verificación
    wp_nonce_field('uipsm_save_menu_icon', 'uipsm_menu_icon_nonce');
    
    // Obtener valor guardado
    $icon = get_post_meta($post->ID, '_uipsm_menu_icon', true);
    
    ?>
    <p>
        <?php _e('Selecciona un icono para usar cuando esta página aparezca en el menú lateral.', 'uipsm'); ?>
    </p>
    <p>
        <label for="uipsm_menu_icon"><?php _e('Clase de icono', 'uipsm'); ?></label>
        <input type="text" id="uipsm_menu_icon" name="uipsm_menu_icon" value="<?php echo esc_attr($icon); ?>" placeholder="ti-dashboard">
    </p>
    <p class="description">
        <?php _e('Usa clases de Tabler Icons, por ejemplo: ti-dashboard, ti-settings', 'uipsm'); ?>
    </p>
    <div class="uipsm-icon-preview" style="margin-top: 10px; font-size: 24px;">
        <?php if ($icon) : ?>
            <i class="<?php echo esc_attr($icon); ?>"></i>
        <?php endif; ?>
    </div>
    
    <style>
        #uipsm_menu_icon {
            width: 100%;
        }
    </style>
    
    <script>
        jQuery(document).ready(function($) {
            // Cargar Tabler Icons si no está cargado
            if (!$('link[href*="tabler-icons"]').length) {
                $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css">');
            }
            
            // Actualizar vista previa del icono
            $('#uipsm_menu_icon').on('input', function() {
                var iconClass = $(this).val();
                var $preview = $('.uipsm-icon-preview');
                
                $preview.empty();
                
                if (iconClass) {
                    $preview.html('<i class="' + iconClass + '"></i>');
                }
            });
        });
    </script>
    <?php
}

/**
 * Guardar valor del meta box de icono de menú
 *
 * @param int $post_id ID del post
 */
function uipsm_save_menu_icon($post_id) {
    // Verificar nonce
    if (!isset($_POST['uipsm_menu_icon_nonce']) || !wp_verify_nonce($_POST['uipsm_menu_icon_nonce'], 'uipsm_save_menu_icon')) {
        return;
    }
    
    // Verificar autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Verificar permisos
    if (isset($_POST['post_type']) && 'page' === $_POST['post_type']) {
        if (!current_user_can('edit_page', $post_id)) {
            return;
        }
    } else {
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
    }
    
    // Guardar datos
    if (isset($_POST['uipsm_menu_icon'])) {
        update_post_meta($post_id, '_uipsm_menu_icon', sanitize_text_field($_POST['uipsm_menu_icon']));
    }
}
add_action('save_post', 'uipsm_save_menu_icon');

/**
 * Añadir filtro para modificar los atributos del ítem del menú
 */
function uipsm_nav_menu_link_attributes($atts, $item, $args, $depth) {
    // Verificar si es un post/página
    if (isset($item->object) && in_array($item->object, array('post', 'page')) && isset($args->theme_location) && $args->theme_location === 'sidebar') {
        // Obtener icono guardado
        $icon = get_post_meta($item->object_id, '_uipsm_menu_icon', true);
        
        // Si hay un icono, añadirlo como data-icon
        if ($icon) {
            $atts['data-icon'] = $icon;
        }
    }
    
    return $atts;
}
add_filter('nav_menu_link_attributes', 'uipsm_nav_menu_link_attributes', 10, 4);

/**
 * Filtrar título del ítem del menú para añadir icono
 */
function uipsm_nav_menu_item_title($title, $item, $args, $depth) {
    // Solo para el menú sidebar
    if (isset($args->theme_location) && $args->theme_location === 'sidebar') {
        // Comprobar si hay un icono en los atributos
        if (isset($item->post_content) && strpos($item->post_content, 'data-icon="') !== false) {
            preg_match('/data-icon="([^"]+)"/', $item->post_content, $matches);
            $icon = isset($matches[1]) ? $matches[1] : '';
            
            if ($icon) {
                return '<span class="menu-icon"><i class="' . esc_attr($icon) . '"></i></span><span class="menu-text">' . $title . '</span>';
            }
        }
        
        // Comprobar si es un post/página con icono
        if (isset($item->object) && in_array($item->object, array('post', 'page'))) {
            $icon = get_post_meta($item->object_id, '_uipsm_menu_icon', true);
            
            if ($icon) {
                return '<span class="menu-icon"><i class="' . esc_attr($icon) . '"></i></span><span class="menu-text">' . $title . '</span>';
            }
        }
        
        // Si no hay icono, añadir estructura HTML necesaria
        return '<span class="menu-icon"><i class="ti ti-circle"></i></span><span class="menu-text">' . $title . '</span>';
    }
    
    return $title;
}
add_filter('nav_menu_item_title', 'uipsm_nav_menu_item_title', 10, 4);
