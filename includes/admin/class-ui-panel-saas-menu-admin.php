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
        
        // JavaScript personalizado para administración
        wp_enqueue_script(
            'uipsm-admin',
            UIPSM_PLUGIN_URL . 'assets/js/admin-fix-enhanced.js', // Cambiado a la versión mejorada
            array('jquery', 'jquery-ui-sortable'),
            UIPSM_VERSION . '.' . time(), // Añadido timestamp para evitar caché
            true
        );
        
        // CSS personalizado para administración
        wp_enqueue_style(
            'uipsm-admin',
            UIPSM_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            UIPSM_VERSION . '.' . time()
        );
        
        // Cargar CSS local de Tabler Icons
        wp_enqueue_style(
            'tabler-icons',
            UIPSM_PLUGIN_URL . 'assets/css/tabler-icons.css',
            array(),
            UIPSM_VERSION . '.' . time()
        );
        
        // Cargar gestor de iconos
        wp_enqueue_script(
            'tabler-icons-manager',
            UIPSM_PLUGIN_URL . 'assets/js/tabler-icons-manager.js',
            array('jquery'),
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
            'strings' => array(
                'confirm_delete' => __('¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.', 'uipsm'),
                'save_success' => __('Menú guardado correctamente', 'uipsm'),
                'save_error' => __('Error al guardar el menú', 'uipsm'),
                'delete_success' => __('Elemento eliminado correctamente', 'uipsm'),
                'delete_error' => __('Error al eliminar el elemento', 'uipsm'),
                'add_item' => __('Añadir elemento', 'uipsm'),
                'edit_item' => __('Editar elemento', 'uipsm'),
                'save' => __('Guardar', 'uipsm'),
                'cancel' => __('Cancelar', 'uipsm'),
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
                                <input type="text" id="uipsm-item-icon" name="icon" placeholder="ti-dashboard">
                                <small><?php _e('Usa clases de Tabler Icons, por ejemplo: ti-dashboard, ti-settings', 'uipsm'); ?></small>
                                <div class="uipsm-icon-preview">
                                    <i class="ti ti-dashboard"></i>
                                </div>
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
                        <div class="uipsm-icons-grid">
                            <!-- La cuadrícula de iconos se generará dinámicamente con JavaScript -->
                        </div>
                        <p class="uipsm-icon-help">
                            <?php _e('Haz clic en un icono para seleccionarlo. Para ver todos los iconos disponibles, visita', 'uipsm'); ?>
                            <a href="https://tabler-icons.io/" target="_blank"><?php _e('Tabler Icons', 'uipsm'); ?></a>
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
                                <li><?php _e('Arrastra y suelta los elementos para cambiar su orden.', 'uipsm'); ?></li>
                                <li><?php _e('Haz clic en un elemento para editarlo.', 'uipsm'); ?></li>
                                <li><?php _e('Haz clic en el icono de papelera para eliminar un elemento.', 'uipsm'); ?></li>
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
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Script adicional para reforzar la funcionalidad de los botones -->
        <script type="text/javascript">
            // Script inline para asegurarse de que los botones funcionen
            jQuery(document).ready(function($) {
                // Esperar a que todo esté cargado
                setTimeout(function() {
                    // Asegurarse que los eventos están conectados
                    $(document).off('click', '.uipsm-menu-edit').on('click', '.uipsm-menu-edit', function(e) {
                        e.preventDefault();
                        var itemId = $(this).data('id');
                        console.log('Clic en botón editar inline:', itemId);
                        
                        // Si hay una función editMenuItem definida, usarla
                        if (typeof window.editMenuItem === 'function') {
                            window.editMenuItem.call(this);
                        }
                    });
                    
                    $(document).off('click', '.uipsm-menu-delete').on('click', '.uipsm-menu-delete', function(e) {
                        e.preventDefault();
                        var itemId = $(this).data('id');
                        console.log('Clic en botón eliminar inline:', itemId);
                        
                        if (confirm('¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.')) {
                            // AJAX para eliminar el elemento
                            $.ajax({
                                url: ajaxurl,
                                type: 'POST',
                                data: {
                                    action: 'uipsm_delete_menu_item',
                                    nonce: '<?php echo wp_create_nonce('uipsm-admin'); ?>',
                                    id: itemId
                                },
                                success: function(response) {
                                    if (response.success) {
                                        // Recargar la página para ver los cambios
                                        location.reload();
                                    } else {
                                        alert('Error al eliminar el elemento');
                                    }
                                },
                                error: function() {
                                    alert('Error de conexión al eliminar el elemento');
                                }
                            });
                        }
                    });
                    
                    console.log('Eventos reforzados con script inline');
                }, 1000);
            });
        </script>
        <?php
    }
}
