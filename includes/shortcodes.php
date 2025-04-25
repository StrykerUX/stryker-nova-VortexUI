<?php
/**
 * Shortcodes para el plugin UI Panel SaaS Menu Manager
 * 
 * @package UI_Panel_SaaS_Menu_Manager
 * @since 1.0.0
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Shortcode para mostrar el menú personalizado en cualquier lugar
 *
 * @param array $atts Atributos del shortcode
 * @return string
 */
function uipsm_menu_shortcode($atts) {
    $atts = shortcode_atts(array(
        'menu_id' => 'sidebar',
        'class' => 'side-nav',
    ), $atts);
    
    $instance = UI_Panel_SaaS_Menu_Manager::get_instance();
    return $instance->menu_shortcode($atts);
}
add_shortcode('ui_panel_menu', 'uipsm_menu_shortcode');

/**
 * Shortcode para mostrar un elemento de menú específico
 *
 * @param array $atts Atributos del shortcode
 * @return string
 */
function uipsm_menu_item_shortcode($atts) {
    $atts = shortcode_atts(array(
        'id' => 0,
        'class' => '',
    ), $atts);
    
    $id = intval($atts['id']);
    
    if ($id <= 0) {
        return '';
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'uipsm_menu_items';
    
    // Obtener elemento específico
    $item = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ),
        ARRAY_A
    );
    
    if (!$item) {
        return '';
    }
    
    // Construir HTML del elemento
    $html = '<a href="' . esc_url($item['url']) . '" target="' . esc_attr($item['target']) . '" class="' . esc_attr($atts['class']) . '">';
    
    if (!empty($item['icon'])) {
        $html .= '<i class="' . esc_attr($item['icon']) . '"></i> ';
    }
    
    $html .= esc_html($item['title']) . '</a>';
    
    return $html;
}
add_shortcode('ui_panel_menu_item', 'uipsm_menu_item_shortcode');
