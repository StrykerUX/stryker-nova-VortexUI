<?php
/**
 * Archivo de desinstalación del plugin
 *
 * Este archivo se ejecuta cuando el plugin es desinstalado.
 *
 * @package Vortex_UI_Panel
 */

// Si no se llama desde WordPress, salir
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Eliminar opciones del plugin
delete_option('vortex_ui_panel_menu_items');
delete_option('vortex_ui_panel_options');

// Limpiar cualquier caché transitoria
delete_transient('vortex_ui_panel_cache');
