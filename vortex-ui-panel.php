<?php
/**
 * Plugin Name: Vortex UI Panel
 * Plugin URI: https://github.com/StrykerUX/stryker-nova-VortexUI
 * Description: Plugin para gestionar el menú lateral del tema UI Panel SaaS Template con opciones personalizables
 * Version: 0.2.2
 * Author: StrykerUX
 * Author URI: https://github.com/StrykerUX
 * License: GPL2
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

// Definir constantes del plugin
define('VORTEX_UI_PANEL_VERSION', '0.2.2');
define('VORTEX_UI_PANEL_PATH', plugin_dir_path(__FILE__));
define('VORTEX_UI_PANEL_URL', plugin_dir_url(__FILE__));
define('VORTEX_UI_PANEL_BASENAME', plugin_basename(__FILE__));

// Incluir archivos principales
require_once VORTEX_UI_PANEL_PATH . 'includes/class-vortex-ui-panel.php';
require_once VORTEX_UI_PANEL_PATH . 'includes/class-vortex-ui-panel-loader.php';

// Iniciar el plugin
function vortex_ui_panel_init() {
    $plugin = new Vortex_UI_Panel();
    $plugin->run();
}

// Gancho de activación
register_activation_hook(__FILE__, 'vortex_ui_panel_activate');
function vortex_ui_panel_activate() {
    // Código de activación
    $default_menu_items = [
        [
            'id' => 'dashboard',
            'title' => 'Dashboard',
            'url' => admin_url(),
            'icon' => 'dashboard',
            'order' => 1,
            'parent_id' => 0,
            'status' => 'publish'
        ],
        [
            'id' => 'pages',
            'title' => 'Páginas',
            'url' => admin_url('edit.php?post_type=page'),
            'icon' => 'file-text',
            'order' => 2,
            'parent_id' => 0,
            'status' => 'publish'
        ],
        [
            'id' => 'posts',
            'title' => 'Entradas',
            'url' => admin_url('edit.php'),
            'icon' => 'news',
            'order' => 3,
            'parent_id' => 0,
            'status' => 'publish'
        ],
        [
            'id' => 'media',
            'title' => 'Medios',
            'url' => admin_url('upload.php'),
            'icon' => 'photo',
            'order' => 4,
            'parent_id' => 0,
            'status' => 'publish'
        ],
        [
            'id' => 'settings',
            'title' => 'Ajustes',
            'url' => admin_url('options-general.php'),
            'icon' => 'settings',
            'order' => 5,
            'parent_id' => 0,
            'status' => 'publish'
        ],
    ];
    
    // Guardar menú por defecto si no existe
    if (!get_option('vortex_ui_panel_menu_items')) {
        update_option('vortex_ui_panel_menu_items', $default_menu_items);
    }
    
    // Crear página de opciones
    if (!get_option('vortex_ui_panel_options')) {
        $default_options = [
            'menu_title' => 'UI Panel SaaS',
            'menu_subtitle' => 'Admin Panel',
            'menu_logo' => '',
            'menu_collapsed' => false,
            'menu_position' => 'left',
            'menu_theme' => 'light',
        ];
        update_option('vortex_ui_panel_options', $default_options);
    }
}

// Gancho de desactivación
register_deactivation_hook(__FILE__, 'vortex_ui_panel_deactivate');
function vortex_ui_panel_deactivate() {
    // Código de desactivación
}

// Iniciar el plugin
vortex_ui_panel_init();
