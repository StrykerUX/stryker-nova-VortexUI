/**
 * JavaScript para la administración del plugin
 */
jQuery(document).ready(function($) {
    'use strict';
    
    // Inicializar variables
    var $menuItemForm = $('#menu-item-form');
    var $menuItemsList = $('.menu-items-sortable');
    var $addNewButton = $('#add-new-menu-item');
    var $cancelButton = $('.cancel-edit');
    var $formTitle = $('#form-title');
    var $panelOptionsForm = $('#panel-options-form');
    
    // Gestionar tabs
    $('.nav-tab-wrapper a').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        
        // Activar tab
        $('.nav-tab-wrapper a').removeClass('nav-tab-active');
        $(this).addClass('nav-tab-active');
        
        // Mostrar contenido
        $('.tab-content').removeClass('active');
        $(target).addClass('active');
    });
    
    // Hacer sortable la lista de menú
    $menuItemsList.sortable({
        handle: '.menu-item-header',
        placeholder: 'menu-item-placeholder',
        update: function() {
            // Obtener orden de elementos
            var itemsOrder = [];
            $menuItemsList.find('.menu-item').each(function() {
                itemsOrder.push($(this).data('id'));
            });
            
            // Enviar orden al servidor
            $.ajax({
                url: vortex_ui_panel_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'reorder_menu_items',
                    nonce: vortex_ui_panel_ajax.nonce,
                    items_order: itemsOrder
                },
                success: function(response) {
                    if (response.success) {
                        // Actualizar selectores de padres
                        updateParentSelectors();
                    }
                }
            });
        }
    });
    
    // Añadir nuevo elemento
    $addNewButton.on('click', function() {
        resetForm();
        $formTitle.text('Añadir Nuevo Elemento');
    });
    
    // Cancelar edición
    $cancelButton.on('click', function() {
        resetForm();
    });
    
    // Editar elemento
    $menuItemsList.on('click', '.edit-item', function() {
        var itemId = $(this).data('id');
        var $menuItem = $menuItemsList.find('.menu-item[data-id="' + itemId + '"]');
        var menuItems = getMenuItems();
        var item = findMenuItem(menuItems, itemId);
        
        if (item) {
            $formTitle.text('Editar Elemento');
            $('#item-id').val(item.id);
            $('#item-title').val(item.title);
            $('#item-url').val(item.url);
            $('#item-icon').val(item.icon);
            updateIconPreview(item.icon);
            $('#item-parent').val(item.parent_id || 0);
            $('#item-order').val(item.order || 1);
            $('#item-status').val(item.status || 'publish');
        }
    });
    
    // Eliminar elemento
    $menuItemsList.on('click', '.delete-item', function() {
        if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
            var itemId = $(this).data('id');
            
            $.ajax({
                url: vortex_ui_panel_ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'delete_menu_item',
                    nonce: vortex_ui_panel_ajax.nonce,
                    item_id: itemId
                },
                success: function(response) {
                    if (response.success) {
                        // Eliminar elemento de la lista
                        $menuItemsList.find('.menu-item[data-id="' + itemId + '"]').remove();
                        
                        // Actualizar lista de elementos y selectores
                        updateParentSelectors();
                        
                        // Restablecer formulario
                        resetForm();
                    }
                }
            });
        }
    });
    
    // Guardar elemento
    $menuItemForm.on('submit', function(e) {
        e.preventDefault();
        
        // Recoger datos del formulario
        var menuItem = {
            id: $('#item-id').val(),
            title: $('#item-title').val(),
            url: $('#item-url').val(),
            icon: $('#item-icon').val(),
            parent_id: $('#item-parent').val(),
            order: $('#item-order').val(),
            status: $('#item-status').val()
        };
        
        // Enviar al servidor
        $.ajax({
            url: vortex_ui_panel_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'save_menu_item',
                nonce: vortex_ui_panel_ajax.nonce,
                menu_item: menuItem
            },
            success: function(response) {
                if (response.success) {
                    // Actualizar lista de elementos
                    updateMenuItemsList(response.data.menu_items);
                    
                    // Restablecer formulario
                    resetForm();
                    
                    // Actualizar selectores de padres
                    updateParentSelectors();
                }
            }
        });
    });
    
    // Selector de iconos
    $('#icon-selector-container').on('click', '.icon-preview', function() {
        $(this).parent().toggleClass('open');
    });
    
    // Buscar iconos
    $(document).on('input', '.icon-search-input', function() {
        var search = $(this).val().toLowerCase();
        $('.icon-item').each(function() {
            var icon = $(this).data('icon').toLowerCase();
            if (icon.indexOf(search) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Seleccionar icono
    $(document).on('click', '.icon-item', function() {
        var icon = $(this).data('icon');
        $('#item-icon').val(icon);
        updateIconPreview(icon);
        $('.icon-selector-wrapper').removeClass('open');
    });
    
    // Cerrar selector de iconos al hacer clic fuera
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.icon-selector-wrapper').length) {
            $('.icon-selector-wrapper').removeClass('open');
        }
    });
    
    // Guardar opciones del panel
    $panelOptionsForm.on('submit', function(e) {
        e.preventDefault();
        
        // Recoger datos del formulario
        var options = {
            menu_title: $('#menu-title').val(),
            menu_subtitle: $('#menu-subtitle').val(),
            menu_logo: $('#menu-logo').val(),
            menu_collapsed: $('#menu-collapsed').is(':checked') ? 'true' : 'false',
            menu_position: $('#menu-position').val(),
            menu_theme: $('#menu-theme').val()
        };
        
        // Enviar al servidor
        $.ajax({
            url: vortex_ui_panel_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'save_panel_options',
                nonce: vortex_ui_panel_ajax.nonce,
                options: options
            },
            success: function(response) {
                if (response.success) {
                    alert('Opciones guardadas correctamente.');
                }
            }
        });
    });
    
    // Funciones auxiliares
    function resetForm() {
        $menuItemForm[0].reset();
        $('#item-id').val('');
        $('#item-icon').val('');
        updateIconPreview('');
        $formTitle.text('Añadir Nuevo Elemento');
    }
    
    function updateIconPreview(icon) {
        var $preview = $('.icon-preview');
        $preview.empty();
        
        if (icon && vortex_ui_panel_ajax.icons.indexOf(icon) > -1) {
            $preview.append('<i class="ti ti-' + icon + '"></i>');
        } else {
            $preview.append('<i class="ti ti-help"></i>');
        }
    }
    
    function updateMenuItemsList(menuItems) {
        $menuItemsList.empty();
        
        if (menuItems.length > 0) {
            $.each(menuItems, function(index, item) {
                var $item = $('<div class="menu-item" data-id="' + item.id + '">' +
                             '<div class="menu-item-header">' +
                             '<span class="menu-item-title">' +
                             '<i class="ti ti-' + item.icon + '"></i>' +
                             item.title +
                             '</span>' +
                             '<div class="menu-item-actions">' +
                             '<button class="edit-item button" data-id="' + item.id + '">Editar</button>' +
                             '<button class="delete-item button" data-id="' + item.id + '">Eliminar</button>' +
                             '</div>' +
                             '</div>' +
                             '</div>');
                             
                $menuItemsList.append($item);
            });
        } else {
            $menuItemsList.append('<p class="no-items">No hay elementos en el menú.</p>');
        }
    }
    
    function updateParentSelectors() {
        var menuItems = getMenuItems();
        var $parentSelect = $('#item-parent');
        var currentId = $('#item-id').val();
        
        // Guardar valor seleccionado actualmente
        var selectedValue = $parentSelect.val();
        
        // Limpiar selector excepto la opción por defecto
        $parentSelect.find('option:not(:first)').remove();
        
        // Añadir opciones de elementos principales
        $.each(menuItems, function(index, item) {
            // No añadir el elemento actual como su propio padre ni elementos que ya tienen padre
            if (item.id !== currentId && (!item.parent_id || item.parent_id == 0)) {
                $parentSelect.append('<option value="' + item.id + '">' + item.title + '</option>');
            }
        });
        
        // Restaurar valor seleccionado si existe
        if (selectedValue) {
            $parentSelect.val(selectedValue);
        }
    }
    
    function getMenuItems() {
        var menuItems = [];
        $menuItemsList.find('.menu-item').each(function() {
            var itemId = $(this).data('id');
            var item = {
                id: itemId,
                title: $(this).find('.menu-item-title').text().trim()
            };
            menuItems.push(item);
        });
        return menuItems;
    }
    
    function findMenuItem(menuItems, itemId) {
        // Esta función simula obtener un elemento específico
        // En un entorno real, deberías hacer una llamada AJAX para obtener los detalles completos
        // o tener una lista completa de elementos en el cliente
        
        // Para propósitos de demostración, simplemente devolvemos un objeto con datos básicos
        var menuItem = null;
        
        // Intenta encontrar el elemento en la lista visible
        $.each(menuItems, function(index, item) {
            if (item.id === itemId) {
                menuItem = item;
                return false; // Salir del bucle
            }
        });
        
        if (menuItem) {
            // En un entorno real, harías una llamada AJAX para obtener todos los datos
            // Por ahora, simulamos obteniendo los datos visibles
            var $menuItemElement = $menuItemsList.find('.menu-item[data-id="' + itemId + '"]');
            var iconClass = $menuItemElement.find('i').attr('class');
            var icon = '';
            
            if (iconClass) {
                // Extraer nombre del icono de la clase CSS (ti ti-iconname)
                var matches = iconClass.match(/ti-([a-z-]+)/);
                if (matches && matches.length > 1) {
                    icon = matches[1];
                }
            }
            
            // Obtener datos actuales del elemento para mostrar en el formulario
            $.ajax({
                url: vortex_ui_panel_ajax.ajax_url,
                type: 'POST',
                async: false, // Para simplificar el ejemplo
                data: {
                    action: 'get_menu_item',
                    nonce: vortex_ui_panel_ajax.nonce,
                    item_id: itemId
                },
                success: function(response) {
                    if (response.success && response.data) {
                        menuItem = response.data;
                    }
                }
            });
            
            // Si no se obtuvo del servidor, usar datos básicos
            if (!menuItem) {
                menuItem = {
                    id: itemId,
                    title: $menuItemElement.find('.menu-item-title').text().trim(),
                    icon: icon || 'help',
                    url: '#',
                    parent_id: 0,
                    order: 1,
                    status: 'publish'
                };
            }
        }
        
        return menuItem;
    }
});
