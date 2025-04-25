<?php
/**
 * Trait con métodos AJAX para el administrador del plugin
 * 
 * @package UI_Panel_SaaS_Menu_Manager
 * @since 1.0.0
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Trait con métodos AJAX para el administrador
 */
trait UI_Panel_SaaS_Menu_Admin_Ajax {
    /**
     * Guardar menú mediante AJAX
     */
    public function ajax_save_menu() {
        // Verificar nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'uipsm-admin')) {
            wp_send_json_error('Nonce inválido');
            exit;
        }
        
        // Verificar permiso
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permisos para realizar esta acción');
            exit;
        }
        
        // Obtener datos del menú
        if (!isset($_POST['menu_items']) || !is_array($_POST['menu_items'])) {
            wp_send_json_error('Datos del menú inválidos');
            exit;
        }
        
        // Obtener ID del menú
        $menu_id = isset($_POST['menu_id']) ? sanitize_key($_POST['menu_id']) : 'sidebar';
        
        // Sanitizar y validar elementos
        $menu_items = $this->validate_menu_items($_POST['menu_items']);
        
        // Guardar en la base de datos
        $saved = update_option('uipsm_menu_items_' . $menu_id, $menu_items);
        
        if ($saved) {
            wp_send_json_success(array(
                'message' => __('Menú guardado correctamente', 'uipsm'),
                'menu_items' => $menu_items
            ));
        } else {
            wp_send_json_error(__('Error al guardar el menú', 'uipsm'));
        }
        
        exit;
    }
    
    /**
     * Obtener elementos del menú mediante AJAX
     */
    public function ajax_get_menu_items() {
        // Verificar nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'uipsm-admin')) {
            wp_send_json_error('Nonce inválido');
            exit;
        }
        
        // Verificar permiso
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permisos para realizar esta acción');
            exit;
        }
        
        // Obtener ID del menú
        $menu_id = isset($_POST['menu_id']) ? sanitize_key($_POST['menu_id']) : 'sidebar';
        
        // Obtener elementos del menú
        $menu_items = get_option('uipsm_menu_items_' . $menu_id, array());
        
        wp_send_json_success(array(
            'menu_items' => $menu_items
        ));
        
        exit;
    }
    
    /**
     * Eliminar elemento del menú mediante AJAX
     */
    public function ajax_delete_menu_item() {
        // Verificar nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'uipsm-admin')) {
            wp_send_json_error('Nonce inválido');
            exit;
        }
        
        // Verificar permiso
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permisos para realizar esta acción');
            exit;
        }
        
        // Obtener ID del elemento
        if (!isset($_POST['item_id']) || empty($_POST['item_id'])) {
            wp_send_json_error('ID de elemento inválido');
            exit;
        }
        
        $item_id = intval($_POST['item_id']);
        
        // Obtener ID del menú
        $menu_id = isset($_POST['menu_id']) ? sanitize_key($_POST['menu_id']) : 'sidebar';
        
        // Obtener elementos del menú
        $menu_items = get_option('uipsm_menu_items_' . $menu_id, array());
        
        // Buscar y eliminar el elemento
        $found = false;
        foreach ($menu_items as $key => $item) {
            if (isset($item['id']) && $item['id'] === $item_id) {
                unset($menu_items[$key]);
                $found = true;
                break;
            }
        }
        
        if ($found) {
            // Reindexar array
            $menu_items = array_values($menu_items);
            
            // Guardar en la base de datos
            $saved = update_option('uipsm_menu_items_' . $menu_id, $menu_items);
            
            if ($saved) {
                wp_send_json_success(array(
                    'message' => __('Elemento eliminado correctamente', 'uipsm'),
                    'menu_items' => $menu_items
                ));
            } else {
                wp_send_json_error(__('Error al guardar los cambios', 'uipsm'));
            }
        } else {
            wp_send_json_error(__('El elemento no existe', 'uipsm'));
        }
        
        exit;
    }
    
    /**
     * Eliminar todos los elementos del menú mediante AJAX
     */
    public function ajax_delete_all_menu_items() {
        // Verificar nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'uipsm-admin')) {
            wp_send_json_error('Nonce inválido');
            exit;
        }
        
        // Verificar permiso
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permisos para realizar esta acción');
            exit;
        }
        
        // Obtener ID del menú
        $menu_id = isset($_POST['menu_id']) ? sanitize_key($_POST['menu_id']) : 'sidebar';
        
        // Eliminar todos los elementos
        $saved = update_option('uipsm_menu_items_' . $menu_id, array());
        
        if ($saved) {
            wp_send_json_success(array(
                'message' => __('Todos los elementos han sido eliminados correctamente', 'uipsm'),
                'menu_items' => array()
            ));
        } else {
            wp_send_json_error(__('Error al eliminar los elementos', 'uipsm'));
        }
        
        exit;
    }
    
    /**
     * Obtener lista de iconos Tabler disponibles
     */
    public function ajax_get_tabler_icons() {
        // Verificar nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'uipsm-admin')) {
            wp_send_json_error('Nonce inválido');
            exit;
        }
        
        // Verificar permiso
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permisos para realizar esta acción');
            exit;
        }
        
        // Ruta a la carpeta de iconos
        $icons_dir = UIPSM_PLUGIN_DIR . 'assets/tabler-icons-outline/';
        
        // Verificar que la carpeta existe
        if (!is_dir($icons_dir)) {
            wp_send_json_error(array(
                'message' => __('Carpeta de iconos no encontrada', 'uipsm'),
                'path' => $icons_dir
            ));
            exit;
        }
        
        // Leer archivos SVG de la carpeta
        $icons = array();
        $excluded_files = array('.', '..', 'README.md', '.DS_Store', 'Thumbs.db');
        
        if ($handle = opendir($icons_dir)) {
            while (false !== ($file = readdir($handle))) {
                // Excluir archivos ocultos y directorios
                if (in_array($file, $excluded_files) || is_dir($icons_dir . $file)) {
                    continue;
                }
                
                // Solo incluir archivos SVG
                if (pathinfo($file, PATHINFO_EXTENSION) === 'svg') {
                    // Quitar extensión .svg
                    $icon_name = pathinfo($file, PATHINFO_FILENAME);
                    $icons[] = $icon_name;
                }
            }
            closedir($handle);
        }
        
        // Si no se encontraron iconos, devolver error
        if (empty($icons)) {
            wp_send_json_error(array(
                'message' => __('No se encontraron iconos en la carpeta', 'uipsm'),
                'path' => $icons_dir
            ));
            exit;
        }
        
        // Enviar la lista de iconos
        wp_send_json_success($icons);
        exit;
    }
    
    /**
     * Validar elementos del menú
     * 
     * @param array $items Elementos del menú sin validar
     * @return array Elementos validados
     */
    private function validate_menu_items($items) {
        $valid_items = array();
        
        foreach ($items as $item) {
            $valid_item = array(
                'id' => isset($item['id']) ? intval($item['id']) : 0,
                'title' => isset($item['title']) ? sanitize_text_field($item['title']) : '',
                'menu_type' => isset($item['menu_type']) && in_array($item['menu_type'], array('link', 'section')) ? $item['menu_type'] : 'link',
                'url' => isset($item['url']) ? esc_url_raw($item['url']) : '#',
                'target' => isset($item['target']) && in_array($item['target'], array('_self', '_blank')) ? $item['target'] : '_self',
                'icon' => isset($item['icon']) ? sanitize_text_field($item['icon']) : '',
                'parent_id' => isset($item['parent_id']) ? intval($item['parent_id']) : 0,
                'user_roles' => isset($item['user_roles']) && is_array($item['user_roles']) ? array_map('sanitize_text_field', $item['user_roles']) : array(),
                'position' => isset($item['position']) ? intval($item['position']) : 0,
            );
            
            // Solo agregar elementos válidos
            if (!empty($valid_item['title'])) {
                $valid_items[] = $valid_item;
            }
        }
        
        return $valid_items;
    }
}