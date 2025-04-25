/**
 * JavaScript para la parte pública del plugin
 */
jQuery(document).ready(function($) {
    'use strict';
    
    // Añadir el panel lateral al body
    if ($('.vortex-ui-panel').length === 0 && typeof vortex_ui_panel !== 'undefined') {
        // Crear elemento para el panel
        var $panel = $('<div class="vortex-ui-panel"></div>');
        
        // Opciones del panel
        var options = vortex_ui_panel.options || {};
        var menuTitle = options.menu_title || 'UI Panel SaaS';
        var menuSubtitle = options.menu_subtitle || 'Admin Panel';
        var menuLogo = options.menu_logo || '';
        var menuCollapsed = options.menu_collapsed === 'true' || false;
        
        // Cabecera del panel
        var $header = $('<div class="vortex-ui-panel-header"></div>');
        var $title = $('<div class="vortex-ui-panel-title"></div>');
        
        if (menuLogo) {
            $title.append('<img src="' + menuLogo + '" alt="Logo" class="vortex-ui-panel-logo">');
        }
        
        $title.append('<h2>' + menuTitle + '</h2>');
        
        if (menuSubtitle) {
            $title.append('<p>' + menuSubtitle + '</p>');
        }
        
        $header.append($title);
        $header.append('<button class="vortex-ui-panel-toggle"><i class="ti ti-chevron-left"></i></button>');
        $panel.append($header);
        
        // Menú principal
        var $menu = $('<ul class="vortex-ui-panel-menu"></ul>');
        var menuItems = vortex_ui_panel.menu_items || [];
        
        // Separar elementos principales y secundarios
        var mainItems = [];
        var childItems = {};
        
        $.each(menuItems, function(index, item) {
            if (item.status !== 'publish') {
                return; // Saltar elementos no publicados
            }
            
            if (!item.parent_id || item.parent_id == 0) {
                mainItems.push(item);
            } else {
                if (!childItems[item.parent_id]) {
                    childItems[item.parent_id] = [];
                }
                childItems[item.parent_id].push(item);
            }
        });
        
        // Ordenar elementos por orden
        mainItems.sort(function(a, b) {
            return (a.order || 0) - (b.order || 0);
        });
        
        // Crear elementos del menú
        $.each(mainItems, function(index, item) {
            var hasChildren = childItems[item.id] && childItems[item.id].length > 0;
            var isCurrentPage = window.location.href === item.url;
            var $menuItem = $('<li class="vortex-ui-panel-menu-item" data-title="' + item.title + '"></li>');
            var $menuLink = $('<a href="' + item.url + '" class="vortex-ui-panel-menu-link' + (isCurrentPage ? ' active' : '') + '"></a>');
            
            $menuLink.append('<span class="vortex-ui-panel-menu-icon"><i class="ti ti-' + (item.icon || 'help') + '"></i></span>');
            $menuLink.append('<span class="vortex-ui-panel-menu-text">' + item.title + '</span>');
            $menuItem.append($menuLink);
            
            // Añadir botón para expandir/colapsar si tiene submenús
            if (hasChildren) {
                $menuItem.append('<button class="vortex-ui-panel-submenu-toggle"><i class="ti ti-chevron-right"></i></button>');
                
                // Crear submenú
                var $submenu = $('<ul class="vortex-ui-panel-submenu"></ul>');
                
                // Ordenar elementos secundarios
                childItems[item.id].sort(function(a, b) {
                    return (a.order || 0) - (b.order || 0);
                });
                
                // Añadir elementos secundarios
                $.each(childItems[item.id], function(childIndex, childItem) {
                    if (childItem.status !== 'publish') {
                        return; // Saltar elementos no publicados
                    }
                    
                    var isChildCurrentPage = window.location.href === childItem.url;
                    var $submenuItem = $('<li class="vortex-ui-panel-submenu-item"></li>');
                    var $submenuLink = $('<a href="' + childItem.url + '" class="vortex-ui-panel-submenu-link' + (isChildCurrentPage ? ' active' : '') + '"></a>');
                    
                    $submenuLink.append('<span class="vortex-ui-panel-menu-icon"><i class="ti ti-' + (childItem.icon || 'help') + '"></i></span>');
                    $submenuLink.append('<span class="vortex-ui-panel-menu-text">' + childItem.title + '</span>');
                    $submenuItem.append($submenuLink);
                    $submenu.append($submenuItem);
                    
                    // Marcar elemento padre como activo si un hijo está activo
                    if (isChildCurrentPage) {
                        $menuLink.addClass('active');
                        $menuItem.addClass('open');
                    }
                });
                
                $menuItem.append($submenu);
            }
            
            $menu.append($menuItem);
        });
        
        $panel.append($menu);
        $('body').append($panel);
        
        // Añadir clase al body
        $('body').addClass('vortex-ui-panel-active');
        
        // Aplicar estado inicial (colapsado o expandido)
        if (menuCollapsed) {
            $('body').addClass('vortex-ui-panel-collapsed');
        }
        
        // Eventos
        // Toggle para colapsar/expandir panel
        $('.vortex-ui-panel-toggle').on('click', function() {
            $('body').toggleClass('vortex-ui-panel-collapsed');
            
            // Guardar preferencia en localStorage
            localStorage.setItem('vortex_ui_panel_collapsed', $('body').hasClass('vortex-ui-panel-collapsed'));
        });
        
        // Toggle para submenús
        $('.vortex-ui-panel-submenu-toggle').on('click', function(e) {
            e.preventDefault();
            $(this).closest('.vortex-ui-panel-menu-item').toggleClass('open');
        });
        
        // Restaurar estado desde localStorage
        var savedCollapsed = localStorage.getItem('vortex_ui_panel_collapsed');
        if (savedCollapsed === 'true') {
            $('body').addClass('vortex-ui-panel-collapsed');
        } else if (savedCollapsed === 'false') {
            $('body').removeClass('vortex-ui-panel-collapsed');
        }
    }
});
