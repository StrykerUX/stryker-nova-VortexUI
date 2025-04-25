<?php
/**
 * Métodos AJAX para la clase de administración del plugin
 * 
 * @package UI_Panel_SaaS_Menu_Manager
 * @since 1.0.0
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Métodos AJAX para la administración del plugin
 * Esta clase contiene los métodos AJAX que se utilizan en la clase UI_Panel_SaaS_Menu_Admin
 */
trait UI_Panel_SaaS_Menu_Admin_Ajax {
    
    /**
     * AJAX: Guardar menú
     */
    public function ajax_save_menu() {
        check_ajax_referer('uipsm-admin', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permiso para realizar esta acción');
        }
        
        $item = isset($_POST['item']) ? $_POST['item'] : array();
        
        if (empty($item)) {
            wp_send_json_error('No se recibieron datos');
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'uipsm_menu_items';
        
        // Sanitizar datos
        $id = isset($item['id']) ? intval($item['id']) : 0;
        $menu_id = isset($item['menu_id']) ? sanitize_text_field($item['menu_id']) : 'sidebar';
        $parent_id = isset($item['parent_id']) ? intval($item['parent_id']) : 0;
        $title = isset($item['title']) ? sanitize_text_field($item['title']) : '';
        $icon = isset($item['icon']) ? sanitize_text_field($item['icon']) : '';
        $url = isset($item['url']) ? esc_url_raw($item['url']) : '#';
        $target = isset($item['target']) ? sanitize_text_field($item['target']) : '_self';
        $menu_order = isset($item['menu_order']) ? intval($item['menu_order']) : 0;
        $user_roles = isset($item['user_roles']) ? implode(',', array_map('sanitize_text_field', $item['user_roles'])) : '';
        $menu_type = isset($item['menu_type']) ? sanitize_text_field($item['menu_type']) : 'link';
        
        // Verificar datos obligatorios
        if (empty($title)) {
            wp_send_json_error('El título es obligatorio');
        }
        
        // Preparar datos para guardar
        $data = array(
            'menu_id' => $menu_id,
            'parent_id' => $parent_id,
            'title' => $title,
            'icon' => $icon,
            'url' => $url,
            'target' => $target,
            'menu_order' => $menu_order,
            'user_roles' => $user_roles,
            'menu_type' => $menu_type,
        );
        
        // Actualizar o insertar elemento
        if ($id > 0) {
            // Actualizar elemento existente
            $result = $wpdb->update(
                $table_name,
                $data,
                array('id' => $id)
            );
        } else {
            // Insertar nuevo elemento
            $result = $wpdb->insert(
                $table_name,
                $data
            );
            
            if ($result) {
                $id = $wpdb->insert_id;
            }
        }
        
        if ($result === false) {
            wp_send_json_error('Error al guardar el elemento: ' . $wpdb->last_error);
        }
        
        // Devolver elemento actualizado
        $item = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM $table_name WHERE id = %d",
                $id
            ),
            ARRAY_A
        );
        
        wp_send_json_success($item);
    }
    
    /**
     * AJAX: Obtener elementos del menú
     */
    public function ajax_get_menu_items() {
        check_ajax_referer('uipsm-admin', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permiso para realizar esta acción');
        }
        
        $menu_id = isset($_GET['menu_id']) ? sanitize_text_field($_GET['menu_id']) : 'sidebar';
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'uipsm_menu_items';
        
        // Obtener todos los elementos del menú
        $items = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table_name WHERE menu_id = %s ORDER BY parent_id ASC, menu_order ASC",
                $menu_id
            ),
            ARRAY_A
        );
        
        wp_send_json_success($items);
    }
    
    /**
     * AJAX: Eliminar elemento del menú
     */
    public function ajax_delete_menu_item() {
        check_ajax_referer('uipsm-admin', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('No tienes permiso para realizar esta acción');
        }
        
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if ($id <= 0) {
            wp_send_json_error('ID de elemento no válido');
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'uipsm_menu_items';
        
        // Eliminar elemento
        $result = $wpdb->delete(
            $table_name,
            array('id' => $id)
        );
        
        if ($result === false) {
            wp_send_json_error('Error al eliminar el elemento: ' . $wpdb->last_error);
        }
        
        // Actualizar elementos hijo para que apunten al elemento padre
        $wpdb->update(
            $table_name,
            array('parent_id' => 0),
            array('parent_id' => $id)
        );
        
        wp_send_json_success();
    }
}
