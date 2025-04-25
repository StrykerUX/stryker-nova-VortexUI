<?php
/**
 * Clase principal para el plugin UI Panel SaaS Menu Manager
 * 
 * @package UI_Panel_SaaS_Menu_Manager
 * @since 1.0.0
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase principal del plugin
 */
class UI_Panel_SaaS_Menu_Manager {
    
    /**
     * Instancia de la clase
     *
     * @var UI_Panel_SaaS_Menu_Manager
     */
    private static $instance = null;
    
    /**
     * Admin UI
     *
     * @var UI_Panel_SaaS_Menu_Admin
     */
    public $admin;
    
    /**
     * Constructor
     */
    public function __construct() {
        // Crear instancia de la clase admin
        if (is_admin()) {
            $this->admin = new UI_Panel_SaaS_Menu_Admin();
        }
    }
    
    /**
     * Obtener instancia de la clase
     *
     * @return UI_Panel_SaaS_Menu_Manager
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Inicializar el plugin
     */
    public function init() {
        // Cargar traducción
        load_plugin_textdomain('uipsm', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Inicializar admin
        if (is_admin()) {
            $this->admin->init();
        }
        
        // Hooks para el frontend
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('init', array($this, 'register_menu'));
        
        // Filtro para reemplazar la salida del menú lateral
        add_filter('wp_nav_menu_items', array($this, 'inject_custom_menu_items'), 10, 2);
        
        // Shortcode para mostrar el menú en cualquier lugar
        add_shortcode('ui_panel_menu', array($this, 'menu_shortcode'));
    }
    
    /**
     * Registrar scripts y estilos
     */
    public function enqueue_scripts() {
        // No necesitamos scripts adicionales en el frontend
        // ya que usaremos los que ya están cargados por el tema
    }
    
    /**
     * Registrar menú
     */
    public function register_menu() {
        // Registrar el área de menú personalizado si aún no está registrada
        if (!has_nav_menu('sidebar_custom')) {
            register_nav_menus(array(
                'sidebar_custom' => __('Menú Lateral Personalizado', 'uipsm'),
            ));
        }
    }
    
    /**
     * Obtener elementos del menú de la base de datos
     *
     * @param string $menu_id ID del menú
     * @param int $parent_id ID del elemento padre
     * @return array
     */
    public function get_menu_items($menu_id = 'sidebar', $parent_id = 0) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'uipsm_menu_items';
        
        // Obtener todos los elementos del menú con el parent_id especificado
        $items = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table_name 
                WHERE menu_id = %s AND parent_id = %d 
                ORDER BY menu_order ASC",
                $menu_id, 
                $parent_id
            ), 
            ARRAY_A
        );
        
        if (!$items) {
            return array();
        }
        
        // Verificar roles de usuario si es necesario
        $filtered_items = array();
        $current_user = wp_get_current_user();
        
        foreach ($items as $item) {
            $user_roles = !empty($item['user_roles']) ? explode(',', $item['user_roles']) : array();
            
            // Si no hay roles especificados o el usuario tiene el rol requerido
            if (empty($user_roles) || array_intersect($user_roles, $current_user->roles) || current_user_can('administrator')) {
                // Comprobar si este elemento tiene hijos
                $item['children'] = $this->get_menu_items($menu_id, $item['id']);
                $filtered_items[] = $item;
            }
        }
        
        return $filtered_items;
    }
    
    /**
     * Construir la estructura HTML del menú
     *
     * @param array $items Elementos del menú
     * @param int $depth Profundidad actual
     * @return string
     */
    public function build_menu_html($items, $depth = 0) {
        if (empty($items)) {
            return '';
        }
        
        $html = '';
        
        // Clase del contenedor según la profundidad
        $container_class = 'side-nav';
        if ($depth === 1) {
            $container_class = 'mm-collapse side-nav-second-level';
        } elseif ($depth > 1) {
            $container_class = 'side-nav-third-level';
        }
        
        // Solo abrir una lista UL en el primer nivel o si tenemos elementos
        if ($depth === 0) {
            $html .= '<ul class="' . esc_attr($container_class) . '">';
        }
        
        foreach ($items as $item) {
            $has_children = !empty($item['children']);
            $item_class = 'side-nav-item';
            
            // Clase para elementos activos
            $current_url = esc_url((isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
            $is_active = ($item['url'] !== '#' && $item['url'] !== '' && strpos($current_url, $item['url']) !== false);
            
            if ($is_active) {
                $item_class .= ' active';
            }
            
            // Iniciar elemento LI
            $html .= '<li class="' . esc_attr($item_class) . '">';
            
            // Construir el enlace
            if ($item['menu_type'] == 'section') {
                // Si es una sección, es un título, no un enlace
                $html .= '<h5 class="side-nav-title mt-2">' . esc_html($item['title']) . '</h5>';
            } else {
                // Atributos del enlace
                $link_class = 'side-nav-link';
                $link_attrs = '';
                
                if ($has_children) {
                    $link_attrs .= ' data-bs-toggle="collapse" href="#sidebarMenu' . intval($item['id']) . '" aria-expanded="false" aria-controls="sidebarMenu' . intval($item['id']) . '"';
                }
                
                // Construir el enlace
                $html .= '<a class="' . esc_attr($link_class) . '"' . $link_attrs . ' href="' . esc_url($item['url']) . '" target="' . esc_attr($item['target']) . '">';
                
                // Icono
                if (!empty($item['icon'])) {
                    $html .= '<span class="menu-icon"><i class="' . esc_attr($item['icon']) . '"></i></span>';
                }
                
                // Texto
                $html .= '<span class="menu-text">' . esc_html($item['title']) . '</span>';
                
                // Flecha si tiene hijos
                if ($has_children) {
                    $html .= '<span class="menu-arrow"></span>';
                }
                
                $html .= '</a>';
                
                // Si tiene hijos, añadir el submenú
                if ($has_children) {
                    $html .= '<div class="collapse" id="sidebarMenu' . intval($item['id']) . '">';
                    $html .= '<ul class="' . ($depth === 0 ? 'mm-collapse side-nav-second-level' : 'side-nav-third-level') . '">';
                    $html .= $this->build_menu_html($item['children'], $depth + 1);
                    $html .= '</ul>';
                    $html .= '</div>';
                }
            }
            
            $html .= '</li>';
        }
        
        // Cerrar la lista UL en el primer nivel
        if ($depth === 0) {
            $html .= '</ul>';
        }
        
        return $html;
    }
    
    /**
     * Inyectar elementos personalizados en el menú
     *
     * @param string $items Elementos del menú HTML
     * @param object $args Argumentos del menú
     * @return string
     */
    public function inject_custom_menu_items($items, $args) {
        // Solo reemplazar el menú lateral
        if (isset($args->theme_location) && $args->theme_location === 'sidebar') {
            $menu_items = $this->get_menu_items('sidebar');
            
            // Si hay elementos personalizados, reemplazar el menú
            if (!empty($menu_items)) {
                return $this->build_menu_html($menu_items);
            }
        }
        
        return $items;
    }
    
    /**
     * Shortcode para mostrar el menú
     *
     * @param array $atts Atributos del shortcode
     * @return string
     */
    public function menu_shortcode($atts) {
        $atts = shortcode_atts(array(
            'menu_id' => 'sidebar',
            'class' => 'side-nav',
        ), $atts);
        
        $menu_items = $this->get_menu_items($atts['menu_id']);
        
        if (empty($menu_items)) {
            return '';
        }
        
        return $this->build_menu_html($menu_items);
    }
}
