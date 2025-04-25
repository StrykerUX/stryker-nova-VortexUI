<?php
/**
 * Clase para la parte pública del plugin
 */
class Vortex_UI_Panel_Public {
    
    private $plugin_name;
    private $version;
    
    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }
    
    public function enqueue_styles() {
        wp_enqueue_style($this->plugin_name, VORTEX_UI_PANEL_URL . 'public/css/vortex-ui-panel-public.css', array(), $this->version, 'all');
        wp_enqueue_style('tabler-icons', VORTEX_UI_PANEL_URL . 'assets/tabler-icons/tabler-icons.min.css', array(), $this->version, 'all');
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script($this->plugin_name, VORTEX_UI_PANEL_URL . 'public/js/vortex-ui-panel-public.js', array('jquery'), $this->version, false);
        
        $menu_items = get_option('vortex_ui_panel_menu_items', array());
        $options = get_option('vortex_ui_panel_options', array());
        
        wp_localize_script($this->plugin_name, 'vortex_ui_panel', array(
            'menu_items' => $menu_items,
            'options' => $options
        ));
    }
    
    public function remove_admin_bar($wp_admin_bar) {
        if (is_admin()) {
            $options = get_option('vortex_ui_panel_options', array());
            if (isset($options['menu_position']) && $options['menu_position'] === 'left') {
                // Eliminar admin bar en panel de administración cuando el menú está a la izquierda
                show_admin_bar(false);
            }
        }
    }
    
    public function add_admin_body_class($classes) {
        if (is_admin()) {
            $options = get_option('vortex_ui_panel_options', array());
            
            // Añadir clases para personalizar la apariencia
            $menu_position = isset($options['menu_position']) ? $options['menu_position'] : 'left';
            $menu_theme = isset($options['menu_theme']) ? $options['menu_theme'] : 'light';
            $menu_collapsed = isset($options['menu_collapsed']) && $options['menu_collapsed'] ? 'collapsed' : 'expanded';
            
            $classes .= ' vortex-ui-panel-active';
            $classes .= ' vortex-ui-panel-position-' . $menu_position;
            $classes .= ' vortex-ui-panel-theme-' . $menu_theme;
            $classes .= ' vortex-ui-panel-' . $menu_collapsed;
        }
        
        return $classes;
    }
    
    public function render_sidebar() {
        $menu_items = get_option('vortex_ui_panel_menu_items', array());
        $options = get_option('vortex_ui_panel_options', array());
        
        // Ordenar elementos por orden
        usort($menu_items, function($a, $b) {
            $a_order = isset($a['order']) ? intval($a['order']) : 0;
            $b_order = isset($b['order']) ? intval($b['order']) : 0;
            return $a_order - $b_order;
        });
        
        // Separar elementos principales y secundarios
        $main_items = array();
        $child_items = array();
        
        foreach ($menu_items as $item) {
            if (empty($item['parent_id']) || $item['parent_id'] == 0) {
                $main_items[] = $item;
            } else {
                $child_items[$item['parent_id']][] = $item;
            }
        }
        
        // Iniciar salida
        ob_start();
        
        include_once VORTEX_UI_PANEL_PATH . 'public/partials/vortex-ui-panel-sidebar.php';
        
        return ob_get_clean();
    }
}
