<?php
/**
 * Plugin Name: UI Panel SaaS Menu Manager
 * Plugin URI: https://github.com/StrykerUX/UI-Panel-Saas-Template-WP
 * Description: Un plugin para gestionar el menú lateral del tema UI Panel SaaS Template.
 * Version: 0.2.1
 * Author: StrykerUX
 * Author URI: https://github.com/StrykerUX
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: uipsm
 * Domain Path: /languages
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

// Definir constantes del plugin
define('UIPSM_VERSION', '0.2.1');
define('UIPSM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('UIPSM_PLUGIN_URL', plugin_dir_url(__FILE__));

// Incluir archivos necesarios
require_once UIPSM_PLUGIN_DIR . 'includes/class-ui-panel-saas-menu-manager.php';
require_once UIPSM_PLUGIN_DIR . 'includes/admin/class-ui-panel-saas-menu-admin.php';
require_once UIPSM_PLUGIN_DIR . 'includes/shortcodes.php';
require_once UIPSM_PLUGIN_DIR . 'includes/theme-integration.php';

/**
 * Iniciar el plugin cuando WordPress esté listo
 */
function uipsm_init() {
    $instance = new UI_Panel_SaaS_Menu_Manager();
    $instance->init();
}
add_action('plugins_loaded', 'uipsm_init');

/**
 * Activación del plugin
 */
function uipsm_activate() {
    // Crear tabla de base de datos si no existe
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'uipsm_menu_items';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        menu_id varchar(100) NOT NULL,
        parent_id mediumint(9) DEFAULT 0,
        title text NOT NULL,
        icon varchar(100) DEFAULT '',
        url text DEFAULT '',
        target varchar(20) DEFAULT '_self',
        menu_order int(11) DEFAULT 0,
        user_roles text DEFAULT '',
        menu_type varchar(50) DEFAULT 'link',
        custom_attrs text DEFAULT '',
        PRIMARY KEY  (id)
    ) $charset_collate;";
    
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
    
    // Crear menú por defecto si no existe
    $existing_items = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    
    if ($existing_items == 0) {
        // Insertar algunos elementos de ejemplo
        $default_items = array(
            array(
                'menu_id' => 'sidebar',
                'parent_id' => 0,
                'title' => 'Dashboard',
                'icon' => 'ti-dashboard',
                'url' => admin_url(),
                'target' => '_self',
                'menu_order' => 1,
                'user_roles' => '',
                'menu_type' => 'link'
            ),
            array(
                'menu_id' => 'sidebar',
                'parent_id' => 0,
                'title' => 'Configuraciones',
                'icon' => 'ti-settings',
                'url' => '#',
                'target' => '_self',
                'menu_order' => 2,
                'user_roles' => '',
                'menu_type' => 'section'
            ),
            array(
                'menu_id' => 'sidebar',
                'parent_id' => 0,
                'title' => 'Personalización',
                'icon' => 'ti-brush',
                'url' => admin_url('customize.php'),
                'target' => '_self',
                'menu_order' => 3,
                'user_roles' => '',
                'menu_type' => 'link'
            )
        );
        
        foreach ($default_items as $item) {
            $wpdb->insert($table_name, $item);
        }
    }
}
register_activation_hook(__FILE__, 'uipsm_activate');

/**
 * Desactivación del plugin
 */
function uipsm_deactivate() {
    // No eliminamos la tabla por seguridad
}
register_deactivation_hook(__FILE__, 'uipsm_deactivate');

/**
 * Desinstalación del plugin
 */
function uipsm_uninstall() {
    // Eliminar tabla de base de datos
    global $wpdb;
    $table_name = $wpdb->prefix . 'uipsm_menu_items';
    $wpdb->query("DROP TABLE IF EXISTS $table_name");
    
    // Eliminar opciones del plugin
    delete_option('uipsm_settings');
}
register_uninstall_hook(__FILE__, 'uipsm_uninstall');