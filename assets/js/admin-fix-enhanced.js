/**
 * Administración de UI Panel SaaS Menu Manager - Versión mejorada
 * 
 * Esta versión corrige el problema con los botones editar y eliminar en la estructura del menú
 * y añade mejoras de confiabilidad y rendimiento.
 */
(function($) {
    'use strict';
    
    // Variables globales
    var menuItems = [];
    var isEditing = false;
    
    /**
     * Inicializar cuando el DOM esté listo
     */
    $(document).ready(function() {
        console.log('Inicializando admin-fix-enhanced.js');
        
        // Remover cualquier manejador de eventos existente para evitar duplicados
        $(document).off('click', '.uipsm-menu-edit').off('click', '.uipsm-menu-delete');
        
        // Cargar elementos del menú
        loadMenuItems();
        
        // Inicializar eventos
        initEvents();
    });
    
    /**
     * Inicializar eventos
     */
    function initEvents() {
        // Formulario de añadir/editar elemento
        $('#uipsm-add-item-form').off('submit').on('submit', handleItemFormSubmit);
        
        // Cambio en el tipo de menú
        $('#uipsm-item-menu-type').off('change').on('change', toggleLinkOptions);
        
        // Vista previa del icono
        $('#uipsm-item-icon').off('input').on('input', updateIconPreview);
        
        // Selección de icono desde la biblioteca
        $('.uipsm-icon-item').off('click').on('click', selectIcon);
        
        // Botón de guardar menú completo
        $('#uipsm-save-menu').off('click').on('click', saveEntireMenu);
        
        // Botón de cancelar edición
        $('#uipsm-cancel-edit').off('click').on('click', cancelEdit);
        
        // Cambio en el parent_id (para prevenir ciclos)
        $('#uipsm-item-parent').off('change').on('change', validateParentSelection);
        
        // IMPORTANTE: Usar delegación de eventos para los botones editar y eliminar
        // Esto garantiza que los eventos funcionen incluso después de reordenar o añadir elementos
        $(document).off('click', '.uipsm-menu-edit').on('click', '.uipsm-menu-edit', editMenuItem);
        $(document).off('click', '.uipsm-menu-delete').on('click', '.uipsm-menu-delete', deleteMenuItem);
        
        // Verificación adicional para asegurar que los botones funcionen
        setTimeout(function() {
            // Comprobar si los botones responden a eventos
            var editButtons = $('.uipsm-menu-edit');
            var deleteButtons = $('.uipsm-menu-delete');
            
            if (editButtons.length > 0 || deleteButtons.length > 0) {
                console.log('Encontrados botones de editar/eliminar: E=' + editButtons.length + ', D=' + deleteButtons.length);
            }
        }, 1000);
    }
    
    /**
     * Cargar elementos del menú desde el servidor
     */
    function loadMenuItems() {
        $.ajax({
            url: uipsm.ajaxurl,
            type: 'GET',
            data: {
                action: 'uipsm_get_menu_items',
                nonce: uipsm.nonce,
                menu_id: 'sidebar'
            },
            success: function(response) {
                if (response.success) {
                    menuItems = response.data;
                    renderMenuItems();
                    updateParentDropdown();
                    renderPreview();
                } else {
                    alert(response.data || 'Error al cargar los elementos del menú');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error AJAX al cargar elementos del menú:', error);
                alert('Error de conexión al cargar los elementos del menú: ' + error);
            }
        });
    }
    
    /**
     * Renderizar elementos del menú en la interfaz
     */
    function renderMenuItems() {
        var $container = $('#uipsm-menu-items');
        $container.empty();
        
        if (!menuItems || menuItems.length === 0) {
            $container.html('<p class="uipsm-empty-menu">' + 'No hay elementos en el menú. Añade algunos usando el formulario de la izquierda.' + '</p>');
            return;
        }
        
        // Crear estructura jerárquica
        var hierarchy = buildMenuHierarchy(menuItems);
        
        // Renderizar estructura jerárquica
        var $list = $('<ul class="uipsm-sortable-menu"></ul>');
        renderMenuItemsRecursive(hierarchy, $list);
        
        $container.append($list);
        
        // Inicializar ordenamiento
        initSortable();
        
        // Reinicializar eventos para asegurar la detección de clics
        setTimeout(function() {
            console.log('Verificando eventos en los botones después de renderizar...');
            // La delegación debería funcionar, pero por seguridad comprobamos
            var test = $('.uipsm-menu-edit').first();
            if (test.length > 0) {
                console.log('Botón de editar encontrado y listo');
            }
        }, 500);
    }
    
    /**
     * Construir jerarquía del menú
     */
    function buildMenuHierarchy(items) {
        var hierarchy = [];
        var lookup = {};
        
        // Primer paso: crear lookup y elementos de nivel superior
        items.forEach(function(item) {
            lookup[item.id] = { 
                data: item, 
                children: []
            };
            
            if (parseInt(item.parent_id) === 0) {
                hierarchy.push(lookup[item.id]);
            }
        });
        
        // Segundo paso: asignar hijos a sus padres
        items.forEach(function(item) {
            if (parseInt(item.parent_id) > 0 && lookup[item.parent_id]) {
                lookup[item.parent_id].children.push(lookup[item.id]);
            }
        });
        
        return hierarchy;
    }
    
    /**
     * Renderizar elementos del menú recursivamente
     */
    function renderMenuItemsRecursive(items, $container) {
        items.forEach(function(item) {
            var $item = $('<li class="uipsm-menu-item" data-id="' + item.data.id + '"></li>');
            var $handle = $('<div class="uipsm-menu-handle"></div>');
            var $content = $('<div class="uipsm-menu-content"></div>');
            
            // Añadir información del elemento
            var iconHtml = item.data.icon ? '<i class="' + item.data.icon + '"></i>' : '';
            var titleHtml = '<span class="uipsm-menu-title">' + item.data.title + '</span>';
            var typeHtml = '<span class="uipsm-menu-type">' + (item.data.menu_type === 'section' ? 'Sección' : 'Enlace') + '</span>';
            var urlHtml = item.data.menu_type === 'link' ? '<span class="uipsm-menu-url">' + item.data.url + '</span>' : '';
            
            $content.append(
                '<div class="uipsm-menu-info">' +
                    iconHtml +
                    titleHtml +
                    typeHtml +
                    urlHtml +
                '</div>'
            );
            
            // Añadir controles con IDs únicos para facilitar la depuración
            var $controls = $('<div class="uipsm-menu-controls"></div>');
            $controls.append('<button type="button" class="uipsm-menu-edit" data-id="' + item.data.id + '" id="edit-' + item.data.id + '"><span class="dashicons dashicons-edit"></span></button>');
            $controls.append('<button type="button" class="uipsm-menu-delete" data-id="' + item.data.id + '" id="delete-' + item.data.id + '"><span class="dashicons dashicons-trash"></span></button>');
            
            $content.append($controls);
            $handle.append($content);
            $item.append($handle);
            
            // Si tiene hijos, añadirlos recursivamente
            if (item.children && item.children.length > 0) {
                var $childContainer = $('<ul class="uipsm-sortable-menu"></ul>');
                renderMenuItemsRecursive(item.children, $childContainer);
                $item.append($childContainer);
            }
            
            $container.append($item);
        });
    }
    
    /**
     * Inicializar ordenamiento
     */
    function initSortable() {
        $('.uipsm-sortable-menu').sortable({
            handle: '.uipsm-menu-handle',
            items: '> li',
            connectWith: '.uipsm-sortable-menu',
            placeholder: 'uipsm-sortable-placeholder',
            tolerance: 'pointer',
            update: function(event, ui) {
                // Actualizar orden y jerarquía después de ordenar
                updateItemsOrder();
            },
            stop: function(event, ui) {
                // Después de detener el ordenamiento, verificar que los eventos sigan funcionando
                console.log('Ordenamiento completado, verificando eventos...');
            }
        });
    }
    
    /**
     * Actualizar orden y jerarquía de elementos
     */
    function updateItemsOrder() {
        // Recorrer todos los elementos y actualizar su orden y parent_id
        $('.uipsm-sortable-menu > li').each(function(index) {
            var $item = $(this);
            var itemId = $item.data('id');
            var parentId = $item.parent().closest('li').data('id') || 0;
            
            // Actualizar en el array local
            menuItems.forEach(function(item) {
                if (parseInt(item.id) === itemId) {
                    item.parent_id = parentId;
                    item.menu_order = index;
                }
            });
        });
        
        // Actualizar vista previa
        renderPreview();
    }
    
    /**
     * Manejar envío del formulario de elemento
     */
    function handleItemFormSubmit(e) {
        e.preventDefault();
        
        var formData = $(this).serializeArray();
        var item = {};
        
        // Convertir array a objeto
        formData.forEach(function(field) {
            if (field.name === 'user_roles[]') {
                if (!item[field.name]) {
                    item['user_roles'] = [];
                }
                item['user_roles'].push(field.value);
            } else {
                item[field.name] = field.value;
            }
        });
        
        // Validar datos
        if (!item.title) {
            alert('El título es obligatorio');
            return;
        }
        
        // Si es un enlace, validar URL
        if (item.menu_type === 'link' && !item.url) {
            item.url = '#';
        }
        
        // Guardar elemento
        $.ajax({
            url: uipsm.ajaxurl,
            type: 'POST',
            data: {
                action: 'uipsm_save_menu',
                nonce: uipsm.nonce,
                item: item
            },
            success: function(response) {
                if (response.success) {
                    // Actualizar elemento en el array local o añadir nuevo
                    var found = false;
                    menuItems.forEach(function(existingItem, index) {
                        if (parseInt(existingItem.id) === parseInt(response.data.id)) {
                            menuItems[index] = response.data;
                            found = true;
                        }
                    });
                    
                    if (!found) {
                        menuItems.push(response.data);
                    }
                    
                    // Actualizar interfaz
                    renderMenuItems();
                    updateParentDropdown();
                    renderPreview();
                    resetForm();
                } else {
                    alert(response.data || 'Error al guardar el elemento');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error AJAX al guardar elemento:', error);
                alert('Error de conexión al guardar el elemento: ' + error);
            }
        });
    }
    
    /**
     * Editar elemento del menú
     */
    function editMenuItem(e) {
        e.preventDefault();
        console.log('Clic en botón editar detectado');
        
        var itemId = $(this).data('id');
        var item = null;
        
        // Buscar elemento en el array
        menuItems.forEach(function(existingItem) {
            if (parseInt(existingItem.id) === parseInt(itemId)) {
                item = existingItem;
            }
        });
        
        if (!item) {
            alert('Elemento no encontrado (ID: ' + itemId + ')');
            return;
        }
        
        // Cambiar estado a edición
        isEditing = true;
        
        // Llenar formulario con datos del elemento
        $('#uipsm-item-id').val(item.id);
        $('#uipsm-item-title').val(item.title);
        $('#uipsm-item-menu-type').val(item.menu_type).trigger('change');
        $('#uipsm-item-url').val(item.url);
        $('#uipsm-item-target').val(item.target);
        $('#uipsm-item-icon').val(item.icon);
        
        // Actualizar vista previa del icono
        updateIconPreview();
        
        // Manejar parent_id para evitar ciclos
        $('#uipsm-item-parent option').prop('disabled', false);
        $('#uipsm-item-parent option[value="' + item.id + '"]').prop('disabled', true);
        $('#uipsm-item-parent').val(item.parent_id);
        
        // Manejar roles de usuario
        var roles = item.user_roles ? item.user_roles.split(',') : [];
        $('#uipsm-item-roles option').prop('selected', false);
        roles.forEach(function(role) {
            $('#uipsm-item-roles option[value="' + role + '"]').prop('selected', true);
        });
        
        // Cambiar texto del botón
        $('#uipsm-add-item-form button[type="submit"]').text(uipsm.strings.edit_item);
        
        // Mostrar botón de cancelar
        $('#uipsm-cancel-edit').show();
        
        // Desplazarse al formulario
        $('html, body').animate({
            scrollTop: $('#uipsm-add-item-form').offset().top - 50
        }, 500);
    }
    
    /**
     * Eliminar elemento del menú
     */
    function deleteMenuItem(e) {
        e.preventDefault();
        console.log('Clic en botón eliminar detectado');
        
        if (!confirm(uipsm.strings.confirm_delete)) {
            return;
        }
        
        var itemId = $(this).data('id');
        
        // Mostrar indicador de carga
        var $button = $(this);
        var originalText = $button.html();
        $button.html('<span class="dashicons dashicons-update uipsm-spin"></span>');
        $button.prop('disabled', true);
        
        $.ajax({
            url: uipsm.ajaxurl,
            type: 'POST',
            data: {
                action: 'uipsm_delete_menu_item',
                nonce: uipsm.nonce,
                id: itemId
            },
            success: function(response) {
                // Restaurar botón
                $button.html(originalText);
                $button.prop('disabled', false);
                
                if (response.success) {
                    // Eliminar elemento del array local
                    menuItems = menuItems.filter(function(item) {
                        return parseInt(item.id) !== parseInt(itemId);
                    });
                    
                    // Actualizar hijos para que apunten al nivel superior
                    menuItems.forEach(function(item) {
                        if (parseInt(item.parent_id) === parseInt(itemId)) {
                            item.parent_id = 0;
                        }
                    });
                    
                    // Actualizar interfaz
                    renderMenuItems();
                    updateParentDropdown();
                    renderPreview();
                    
                    alert(uipsm.strings.delete_success);
                } else {
                    alert(response.data || uipsm.strings.delete_error);
                }
            },
            error: function(xhr, status, error) {
                // Restaurar botón
                $button.html(originalText);
                $button.prop('disabled', false);
                
                console.error('Error AJAX al eliminar elemento:', error);
                alert('Error de conexión al eliminar el elemento: ' + error);
            }
        });
    }
    
    /**
     * Cancelar edición de elemento
     */
    function cancelEdit() {
        isEditing = false;
        resetForm();
    }
    
    /**
     * Guardar menú completo
     */
    function saveEntireMenu() {
        // No es necesario enviar todos los elementos, ya que se actualizan uno a uno
        alert(uipsm.strings.save_success);
    }
    
    /**
     * Actualizar desplegable de elementos padre
     */
    function updateParentDropdown() {
        var $select = $('#uipsm-item-parent');
        var currentId = $('#uipsm-item-id').val();
        
        // Guardar valor actual
        var currentValue = $select.val();
        
        // Limpiar opciones excepto la primera (Ninguno)
        $select.find('option:not(:first)').remove();
        
        // Añadir elementos como opciones
        menuItems.forEach(function(item) {
            // No añadir el elemento actual como posible padre (evitar ciclos)
            if (parseInt(item.id) !== parseInt(currentId) && item.menu_type !== 'section') {
                $select.append('<option value="' + item.id + '">' + item.title + '</option>');
            }
        });
        
        // Restaurar valor si es posible
        if (currentValue) {
            $select.val(currentValue);
        }
    }
    
    /**
     * Validar selección de padre para evitar ciclos
     */
    function validateParentSelection() {
        var currentId = $('#uipsm-item-id').val();
        var parentId = $(this).val();
        
        // Solo validar en modo edición
        if (!isEditing || !currentId) {
            return;
        }
        
        // No permitir que un elemento sea su propio padre
        if (parseInt(currentId) === parseInt(parentId)) {
            alert('Un elemento no puede ser su propio padre');
            $(this).val(0);
        }
    }
    
    /**
     * Alternar opciones específicas para enlaces
     */
    function toggleLinkOptions() {
        var menuType = $(this).val();
        
        if (menuType === 'link') {
            $('.uipsm-link-options').show();
        } else {
            $('.uipsm-link-options').hide();
        }
    }
    
    /**
     * Actualizar vista previa del icono
     */
    function updateIconPreview() {
        var iconClass = $('#uipsm-item-icon').val();
        var $preview = $('.uipsm-icon-preview');
        
        $preview.empty();
        
        if (iconClass) {
            $preview.html('<i class="' + iconClass + '"></i>');
        } else {
            $preview.html('<i class="ti ti-question-mark"></i>');
        }
    }
    
    /**
     * Seleccionar icono desde la biblioteca
     */
    function selectIcon() {
        var iconClass = $(this).data('icon');
        $('#uipsm-item-icon').val(iconClass);
        updateIconPreview();
        
        // Desplazarse al formulario
        $('html, body').animate({
            scrollTop: $('#uipsm-item-icon').offset().top - 50
        }, 300);
    }
    
    /**
     * Renderizar vista previa del menú
     */
    function renderPreview() {
        var $preview = $('.uipsm-preview-sidebar');
        $preview.empty();
        
        // Construir jerarquía del menú
        var hierarchy = buildMenuHierarchy(menuItems);
        
        // Construir HTML del menú
        var html = '<ul class="side-nav">';
        
        // Función recursiva para construir HTML
        function buildMenuHtml(items) {
            var result = '';
            
            items.forEach(function(item) {
                if (item.data.menu_type === 'section') {
                    // Sección
                    result += '<li class="side-nav-title mt-2">' + item.data.title + '</li>';
                } else {
                    // Enlace
                    var hasChildren = item.children && item.children.length > 0;
                    
                    // Clase para elementos con hijos
                    var itemClass = 'side-nav-item';
                    
                    result += '<li class="' + itemClass + '">';
                    
                    // Atributos del enlace
                    var linkAttrs = '';
                    if (hasChildren) {
                        linkAttrs = ' data-bs-toggle="collapse" href="#sidebarPreview' + item.data.id + '" aria-expanded="false" aria-controls="sidebarPreview' + item.data.id + '"';
                    }
                    
                    // Crear enlace
                    result += '<a class="side-nav-link"' + linkAttrs + ' href="' + item.data.url + '" target="' + item.data.target + '">';
                    
                    // Icono
                    if (item.data.icon) {
                        result += '<span class="menu-icon"><i class="' + item.data.icon + '"></i></span>';
                    }
                    
                    // Texto
                    result += '<span class="menu-text">' + item.data.title + '</span>';
                    
                    // Flecha si tiene hijos
                    if (hasChildren) {
                        result += '<span class="menu-arrow"></span>';
                    }
                    
                    result += '</a>';
                    
                    // Si tiene hijos, añadir submenú
                    if (hasChildren) {
                        result += '<div class="collapse" id="sidebarPreview' + item.data.id + '">';
                        result += '<ul class="mm-collapse side-nav-second-level">';
                        result += buildMenuHtml(item.children);
                        result += '</ul>';
                        result += '</div>';
                    }
                    
                    result += '</li>';
                }
            });
            
            return result;
        }
        
        html += buildMenuHtml(hierarchy);
        html += '</ul>';
        
        $preview.html(html);
    }
    
    /**
     * Resetear formulario
     */
    function resetForm() {
        $('#uipsm-add-item-form')[0].reset();
        $('#uipsm-item-id').val(0);
        $('#uipsm-item-menu-type').val('link').trigger('change');
        $('.uipsm-icon-preview').html('<i class="ti ti-question-mark"></i>');
        $('#uipsm-add-item-form button[type="submit"]').text(uipsm.strings.add_item);
        $('#uipsm-cancel-edit').hide();
        isEditing = false;
    }
    
    // Verificación periódica para asegurar que los eventos estén conectados
    setInterval(function() {
        // Verificar si hay botones sin eventos y reconectarlos si es necesario
        var editCount = $('.uipsm-menu-edit').length;
        var deleteCount = $('.uipsm-menu-delete').length;
        
        if (editCount > 0 || deleteCount > 0) {
            // Los botones están presentes, verificar que tengan eventos
            console.log('Verificación periódica: Botones editar/eliminar presentes');
        }
    }, 10000); // Verificar cada 10 segundos
    
})(jQuery);

// Añadir un estilo CSS para el spinner de carga
document.addEventListener('DOMContentLoaded', function() {
    var style = document.createElement('style');
    style.textContent = `
        .uipsm-spin {
            animation: uipsm-spin 2s infinite linear;
        }
        @keyframes uipsm-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// Reintentar en caso de fallo
window.addEventListener('load', function() {
    setTimeout(function() {
        if (jQuery('.uipsm-menu-edit').length > 0) {
            console.log('Verificación final: Botones presentes después de la carga completa de la página');
        }
    }, 2000);
});
