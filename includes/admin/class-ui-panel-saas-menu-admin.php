<?php
/**
 * Clase para gestionar la interfaz de administración del plugin
 * 
 * @package UI_Panel_SaaS_Menu_Manager
 * @since 1.0.0
 */

// Evitar acceso directo al archivo
if (!defined('ABSPATH')) {
    exit;
}

// Incluir trait con métodos AJAX
require_once UIPSM_PLUGIN_DIR . 'includes/admin/class-ui-panel-saas-menu-admin-ajax.php';

/**
 * Clase de administración del plugin
 */
class UI_Panel_SaaS_Menu_Admin {
    // Usar trait con métodos AJAX
    use UI_Panel_SaaS_Menu_Admin_Ajax;
    
    /**
     * Constructor
     */
    public function __construct() {
        // Constructor vacío
    }
    
    /**
     * Inicializar la administración
     */
    public function init() {
        // Añadir menú de administración
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Registrar scripts y estilos de administración
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        
        // Registrar AJAX para guardar menú
        add_action('wp_ajax_uipsm_save_menu', array($this, 'ajax_save_menu'));
        add_action('wp_ajax_uipsm_get_menu_items', array($this, 'ajax_get_menu_items'));
        add_action('wp_ajax_uipsm_delete_menu_item', array($this, 'ajax_delete_menu_item'));
        add_action('wp_ajax_uipsm_delete_all_menu_items', array($this, 'ajax_delete_all_menu_items'));
        
        // Nuevo endpoint AJAX para obtener iconos
        add_action('wp_ajax_uipsm_get_tabler_icons', array($this, 'ajax_get_tabler_icons'));
    }
    
    /**
     * Añadir menú de administración
     */
    public function add_admin_menu() {
        add_menu_page(
            __('UI Panel - Gestor de Menú', 'uipsm'),
            __('UI Panel Menú', 'uipsm'),
            'manage_options',
            'ui-panel-menu-manager',
            array($this, 'admin_page'),
            'dashicons-menu',
            30
        );
    }
    
    /**
     * Registrar scripts y estilos de administración
     *
     * @param string $hook Hook actual
     */
    public function admin_enqueue_scripts($hook) {
        if ('toplevel_page_ui-panel-menu-manager' !== $hook) {
            return;
        }
        
        // jQuery UI para ordenamiento
        wp_enqueue_script('jquery-ui-sortable');
        
        // CSS personalizado para administración
        wp_enqueue_style(
            'uipsm-admin',
            UIPSM_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            UIPSM_VERSION . '.' . time()
        );
        
        // Cargar CSS de Tabler Icons
        wp_enqueue_style(
            'tabler-icons',
            UIPSM_PLUGIN_URL . 'assets/css/tabler-icons.css',
            array(),
            UIPSM_VERSION . '.' . time()
        );
        
        // Script de corrección de iconos - cargarlo primero
        wp_enqueue_script(
            'tabler-icons-fix',
            UIPSM_PLUGIN_URL . 'assets/js/tabler-icons-fix.js',
            array('jquery'),
            UIPSM_VERSION . '.' . time(),
            false // Cargar en el head para que se aplique lo antes posible
        );
        
        // Cargar escáner directo de iconos (sin AJAX)
        wp_enqueue_script(
            'tabler-icons-direct-scanner',
            UIPSM_PLUGIN_URL . 'assets/js/tabler-icons-direct-scanner.js',
            array('jquery'),
            UIPSM_VERSION . '.' . time(),
            true
        );
        
        // JavaScript personalizado para administración
        wp_enqueue_script(
            'uipsm-admin',
            UIPSM_PLUGIN_URL . 'assets/js/admin-fix-enhanced.js',
            array('jquery', 'jquery-ui-sortable'),
            UIPSM_VERSION . '.' . time(),
            true
        );
        
        // Localizar script
        wp_localize_script('uipsm-admin', 'uipsm', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('uipsm-admin'),
            'plugin_url' => UIPSM_PLUGIN_URL,
            'version' => UIPSM_VERSION,
            'debug' => WP_DEBUG ? '1' : '0',
            'icons_dir' => 'assets/tabler-icons-outline/',
            'use_direct_scanner' => '1', // Usar el escáner directo sin AJAX
            'strings' => array(
                'confirm_delete' => __('¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.', 'uipsm'),
                'confirm_delete_all' => __('¿Estás seguro de que deseas eliminar TODOS los elementos del menú? Esta acción no se puede deshacer.', 'uipsm'),
                'enter_delete_mode' => __('Has entrado en modo de eliminación. Haz clic en los elementos que deseas eliminar uno por uno. Haz clic en "Finalizar eliminación" cuando termines.', 'uipsm'),
                'save_success' => __('Menú guardado correctamente', 'uipsm'),
                'save_error' => __('Error al guardar el menú', 'uipsm'),
                'delete_success' => __('Elemento eliminado correctamente', 'uipsm'),
                'delete_error' => __('Error al eliminar el elemento', 'uipsm'),
                'delete_all_success' => __('Todos los elementos han sido eliminados correctamente', 'uipsm'),
                'delete_all_error' => __('Error al eliminar todos los elementos', 'uipsm'),
                'add_item' => __('Añadir elemento', 'uipsm'),
                'edit_item' => __('Editar elemento', 'uipsm'),
                'save' => __('Guardar', 'uipsm'),
                'cancel' => __('Cancelar', 'uipsm'),
                'start_delete_mode' => __('Eliminar elementos uno por uno', 'uipsm'),
                'end_delete_mode' => __('Finalizar eliminación', 'uipsm'),
                'delete_all' => __('Eliminar todos los elementos', 'uipsm'),
                'loading_icons' => __('Cargando iconos...', 'uipsm'),
                'icons_loaded' => __('Iconos cargados correctamente', 'uipsm'),
                'icons_error' => __('Error al cargar los iconos', 'uipsm'),
            ),
        ));
    }
    
    /**
     * Renderizar página de administración
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Gestor de Menú UI Panel SaaS', 'uipsm'); ?></h1>
            
            <div class="uipsm-admin-container">
                <div class="uipsm-sidebar">
                    <div class="uipsm-panel">
                        <h2><?php _e('Añadir nuevo elemento', 'uipsm'); ?></h2>
                        
                        <form id="uipsm-add-item-form">
                            <div class="uipsm-form-group">
                                <label for="uipsm-item-title"><?php _e('Título', 'uipsm'); ?></label>
                                <input type="text" id="uipsm-item-title" name="title" required>
                            </div>
                            
                            <div class="uipsm-form-group">
                                <label for="uipsm-item-menu-type"><?php _e('Tipo', 'uipsm'); ?></label>
                                <select id="uipsm-item-menu-type" name="menu_type">
                                    <option value="link"><?php _e('Enlace', 'uipsm'); ?></option>
                                    <option value="section"><?php _e('Sección (Título)', 'uipsm'); ?></option>
                                </select>
                            </div>
                            
                            <div class="uipsm-form-group uipsm-link-options">
                                <label for="uipsm-item-url"><?php _e('URL', 'uipsm'); ?></label>
                                <input type="text" id="uipsm-item-url" name="url" value="#">
                            </div>
                            
                            <div class="uipsm-form-group uipsm-link-options">
                                <label for="uipsm-item-target"><?php _e('Abrir en', 'uipsm'); ?></label>
                                <select id="uipsm-item-target" name="target">
                                    <option value="_self"><?php _e('Misma ventana', 'uipsm'); ?></option>
                                    <option value="_blank"><?php _e('Nueva ventana', 'uipsm'); ?></option>
                                </select>
                            </div>
                            
                            <div class="uipsm-form-group">
                                <label for="uipsm-item-icon"><?php _e('Icono', 'uipsm'); ?></label>
                                <div class="uipsm-icon-field">
                                    <input type="text" id="uipsm-item-icon" name="icon" placeholder="ti-dashboard">
                                    <div class="uipsm-icon-preview">
                                        <i class="ti ti-dashboard"></i>
                                    </div>
                                </div>
                                <small><?php _e('Selecciona un icono de la biblioteca de abajo o escribe manualmente un código de icono.', 'uipsm'); ?></small>
                            </div>
                            
                            <div class="uipsm-form-group">
                                <label for="uipsm-item-parent"><?php _e('Elemento padre', 'uipsm'); ?></label>
                                <select id="uipsm-item-parent" name="parent_id">
                                    <option value="0"><?php _e('Ninguno (nivel superior)', 'uipsm'); ?></option>
                                    <!-- Se llenará con JavaScript -->
                                </select>
                            </div>
                            
                            <div class="uipsm-form-group">
                                <label for="uipsm-item-roles"><?php _e('Restringir a roles', 'uipsm'); ?></label>
                                <select id="uipsm-item-roles" name="user_roles[]" multiple>
                                    <?php
                                    $roles = wp_roles()->get_names();
                                    foreach ($roles as $role_value => $role_name) {
                                        echo '<option value="' . esc_attr($role_value) . '">' . esc_html($role_name) . '</option>';
                                    }
                                    ?>
                                </select>
                                <small><?php _e('Deja en blanco para permitir a todos los usuarios', 'uipsm'); ?></small>
                            </div>
                            
                            <div class="uipsm-form-actions">
                                <input type="hidden" id="uipsm-item-id" name="id" value="0">
                                <input type="hidden" id="uipsm-item-menu-id" name="menu_id" value="sidebar">
                                <button type="submit" class="button button-primary"><?php _e('Añadir elemento', 'uipsm'); ?></button>
                                <button type="button" id="uipsm-cancel-edit" class="button" style="display: none;"><?php _e('Cancelar', 'uipsm'); ?></button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="uipsm-panel">
                        <h2><?php _e('Biblioteca de iconos', 'uipsm'); ?></h2>
                        
                        <div class="uipsm-icon-search">
                            <input type="text" id="uipsm-icon-search" placeholder="Buscar iconos...">
                        </div>
                        
                        <div class="uipsm-icons-grid">
                            <!-- La cuadrícula de iconos se generará dinámicamente con JavaScript -->
                        </div>
                        
                        <p class="uipsm-icon-help">
                            <?php _e('Haz clic en un icono para seleccionarlo. Los iconos se mostrarán en el menú lateral.', 'uipsm'); ?>
                        </p>
                    </div>
                </div>
                
                <div class="uipsm-main">
                    <div class="uipsm-panel">
                        <h2><?php _e('Estructura del menú', 'uipsm'); ?></h2>
                        
                        <div class="uipsm-menu-container">
                            <div id="uipsm-menu-items">
                                <p class="uipsm-loading"><?php _e('Cargando elementos del menú...', 'uipsm'); ?></p>
                                <!-- Los elementos del menú se cargarán aquí -->
                            </div>
                            
                            <div class="uipsm-menu-actions">
                                <button id="uipsm-save-menu" class="button button-primary"><?php _e('Guardar cambios', 'uipsm'); ?></button>
                                <button id="uipsm-delete-mode" class="button button-secondary" style="margin-left: 10px;"><?php _e('Eliminar elementos uno por uno', 'uipsm'); ?></button>
                                <button id="uipsm-delete-all" class="button button-danger" style="margin-left: 10px;"><?php _e('Eliminar todos los elementos', 'uipsm'); ?></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="uipsm-panel">
                        <h2><?php _e('Vista previa', 'uipsm'); ?></h2>
                        
                        <div class="uipsm-preview">
                            <div class="uipsm-preview-sidebar">
                                <!-- La vista previa del menú se mostrará aquí -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="uipsm-panel">
                        <h2><?php _e('Instrucciones de uso', 'uipsm'); ?></h2>
                        
                        <div class="uipsm-instructions">
                            <p><?php _e('El <strong>Gestor de Menú UI Panel SaaS</strong> te permite personalizar el menú lateral de tu tema UI Panel SaaS.', 'uipsm'); ?></p>
                            
                            <h3><?php _e('Cómo usar', 'uipsm'); ?></h3>
                            <ol>
                                <li><?php _e('Utiliza el formulario de la izquierda para añadir nuevos elementos al menú.', 'uipsm'); ?></li>
                                <li><?php _e('Selecciona un icono haciendo clic en la biblioteca de iconos.', 'uipsm'); ?></li>
                                <li><?php _e('Arrastra y suelta los elementos para cambiar su orden.', 'uipsm'); ?></li>
                                <li><?php _e('Haz clic en el botón "Eliminar" junto a cada elemento para eliminarlo individualmente.', 'uipsm'); ?></li>
                                <li><?php _e('Utiliza "Eliminar elementos uno por uno" para entrar en un modo de eliminación rápida.', 'uipsm'); ?></li>
                                <li><?php _e('Usa "Eliminar todos los elementos" si deseas vaciar completamente el menú.', 'uipsm'); ?></li>
                                <li><?php _e('Haz clic en "Guardar cambios" para aplicar los cambios.', 'uipsm'); ?></li>
                            </ol>
                            
                            <h3><?php _e('Tipos de elementos', 'uipsm'); ?></h3>
                            <ul>
                                <li><strong><?php _e('Enlace', 'uipsm'); ?></strong>: <?php _e('Un elemento clicable que enlaza a una URL.', 'uipsm'); ?></li>
                                <li><strong><?php _e('Sección', 'uipsm'); ?></strong>: <?php _e('Un título de sección que no es clicable.', 'uipsm'); ?></li>
                            </ul>
                            
                            <h3><?php _e('Sugerencias', 'uipsm'); ?></h3>
                            <ul>
                                <li><?php _e('Para crear un submenú, selecciona un elemento padre en el formulario.', 'uipsm'); ?></li>
                                <li><?php _e('Puedes restringir la visibilidad de los elementos según el rol del usuario.', 'uipsm'); ?></li>
                                <li><?php _e('Utiliza iconos para mejorar la apariencia del menú.', 'uipsm'); ?></li>
                                <li><?php _e('Si no ves iconos en la biblioteca, prueba a recargar la página o usa el campo de búsqueda para filtrar.', 'uipsm'); ?></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
        /* Estilos adicionales para el campo de icono */
        .uipsm-icon-field {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .uipsm-icon-preview {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f6f7f7;
            border-radius: 4px;
            font-size: 24px;
            border: 1px solid #ddd;
        }
        
        .uipsm-icon-search {
            margin-bottom: 15px;
        }
        
        .uipsm-icon-search input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        /* Mejora visual para la cuadrícula de iconos */
        .uipsm-icons-grid {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        /* Estilos para categorías de iconos */
        .uipsm-icon-category {
            margin: 15px 0 5px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
            color: #23282d;
            font-size: 14px;
        }
        
        .uipsm-icons-category-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .uipsm-icon-item {
            cursor: pointer;
            padding: 8px 5px;
            text-align: center;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .uipsm-icon-item:hover {
            background-color: #f6f7f7;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .uipsm-icon-item i {
            font-size: 24px;
            display: block;
            margin-bottom: 5px;
            color: #444;
        }
        
        .uipsm-icon-item span {
            font-size: 9px;
            display: block;
            color: #777;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        /* Estilos para pantallas más grandes */
        @media (min-width: 1200px) {
            .uipsm-icons-category-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        
        @media (max-width: 782px) {
            .uipsm-icons-category-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        </style>
        
        <script>
        jQuery(document).ready(function($) {
            // Inicializar escáner de iconos
            setTimeout(function() {
                if (typeof window.TablerIconsDirectScanner !== 'undefined') {
                    // Iniciar el escáner directo
                    window.TablerIconsDirectScanner.init();
                }
            }, 300);
        });
        </script>
        <?php
    }
}