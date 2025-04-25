/**
 * Tabler Icons Direct Scanner
 * Script para escanear y mostrar iconos de manera directa, sin depender de AJAX
 */

(function($) {
    'use strict';
    
    // Lista completa de todos los iconos en la carpeta assets/tabler-icons-outline
    // Esta lista se ha generado a partir del análisis del repositorio y los archivos SVG disponibles
    const ALL_TABLER_ICONS = [
        'adjustments', 'alarm', 'alert-circle', 'arrow-back-up', 'arrow-down', 'arrow-left', 
        'arrow-right', 'arrow-up', 'bell', 'brand-facebook', 'brand-instagram', 'brand-twitter', 
        'briefcase', 'browser', 'calendar', 'chart-bar', 'chart-line', 'check', 'checkbox', 
        'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'circle-check', 'circle-x', 
        'clipboard', 'clock', 'coin', 'cpu', 'credit-card', 'dashboard', 'database', 'device-laptop', 
        'device-mobile', 'download', 'edit', 'eye', 'eye-off', 'file', 'filter', 'folder', 'heart', 
        'help', 'home', 'info-circle', 'layout', 'layout-dashboard', 'layout-grid', 'list', 'lock', 
        'mail', 'map', 'map-pin', 'menu', 'message', 'minus', 'notification', 'phone', 'photo', 
        'plus', 'receipt', 'reload', 'rocket', 'search', 'send', 'settings', 'share', 'shield', 
        'shopping-cart', 'star', 'tag', 'trash', 'user', 'users', 'x'
    ];
    
    // Combinamos todos los iconos en una única lista 
    const COMPLETE_ICONS_LIST = [...new Set([...ALL_TABLER_ICONS])];
    
    window.TablerIconsDirectScanner = {
        // Función principal para inicializar y renderizar los iconos
        init: function() {
            console.log('TablerIconsDirectScanner: Iniciando...');
            this.renderIcons();
        },
        
        // Renderizar los iconos en todos los contenedores relevantes
        renderIcons: function() {
            const self = this;
            
            // Encontrar todos los contenedores de iconos en la página
            $('.uipsm-icons-grid').each(function() {
                self.renderIconsInContainer($(this));
            });
            
            console.log('TablerIconsDirectScanner: Renderizado completo');
        },
        
        // Renderizar iconos en un contenedor específico
        renderIconsInContainer: function($container) {
            if ($container.length === 0) return;
            
            console.log('TablerIconsDirectScanner: Renderizando iconos en', $container);
            
            // Limpiar el contenedor
            $container.empty();
            
            // Agrupar iconos por categorías
            const categorizedIcons = this.categorizarIconos(COMPLETE_ICONS_LIST);
            
            // Generar HTML para cada categoría
            let iconsHtml = '';
            
            Object.keys(categorizedIcons).sort().forEach(function(category) {
                const icons = categorizedIcons[category];
                if (icons.length === 0) return;
                
                iconsHtml += '<h4 class="uipsm-icon-category">' + category + ' (' + icons.length + ')</h4>';
                iconsHtml += '<div class="uipsm-icons-category-grid">';
                
                icons.forEach(function(icon) {
                    iconsHtml += '<div class="uipsm-icon-item" data-icon="ti ti-' + icon + '" data-category="' + category + '">' +
                        '<i class="ti ti-' + icon + '"></i>' +
                        '<span>ti-' + icon + '</span>' +
                    '</div>';
                });
                
                iconsHtml += '</div>';
            });
            
            // Insertar el HTML en el contenedor
            $container.html(iconsHtml);
            
            // Inicializar eventos
            this.initEvents($container);
        },
        
        // Categorizar los iconos según su nombre
        categorizarIconos: function(icons) {
            const categorias = {
                'General': [],
                'Diseño': [],
                'Dispositivos': [],
                'Marcas': [],
                'Flechas': [],
                'Formularios': [],
                'Interfaz': []
            };
            
            icons.forEach(function(icon) {
                if (icon.startsWith('layout')) {
                    categorias['Diseño'].push(icon);
                } else if (icon.startsWith('device')) {
                    categorias['Dispositivos'].push(icon);
                } else if (icon.startsWith('brand')) {
                    categorias['Marcas'].push(icon);
                } else if (icon.startsWith('arrow') || icon.startsWith('chevron')) {
                    categorias['Flechas'].push(icon);
                } else if (icon.includes('check') || icon.includes('circle') || icon === 'x' || icon.includes('form')) {
                    categorias['Formularios'].push(icon);
                } else if (icon === 'menu' || icon === 'search' || icon === 'settings' || icon === 'user' || icon === 'users') {
                    categorias['Interfaz'].push(icon);
                } else {
                    categorias['General'].push(icon);
                }
            });
            
            return categorias;
        },
        
        // Inicializar eventos en el contenedor
        initEvents: function($container) {
            // Manejar clics en iconos
            $container.find('.uipsm-icon-item').on('click', function() {
                const iconClass = $(this).data('icon');
                $('#uipsm-item-icon').val(iconClass);
                $('.uipsm-icon-preview').html('<i class="' + iconClass + '"></i>');
            });
            
            // Inicializar buscador si existe
            const $search = $container.closest('.uipsm-panel').find('.uipsm-icon-search input');
            if ($search.length > 0) {
                $search.off('input').on('input', function() {
                    const searchTerm = $(this).val().toLowerCase();
                    
                    if (searchTerm === '') {
                        // Mostrar todo
                        $container.find('.uipsm-icon-category').show();
                        $container.find('.uipsm-icon-item').show();
                    } else {
                        // Filtrar
                        $container.find('.uipsm-icon-category').hide();
                        $container.find('.uipsm-icon-item').hide();
                        
                        $container.find('.uipsm-icon-item').each(function() {
                            const iconName = $(this).data('icon').toLowerCase();
                            if (iconName.includes(searchTerm)) {
                                $(this).show();
                                $(this).closest('.uipsm-icons-category-grid').prev('.uipsm-icon-category').show();
                            }
                        });
                    }
                });
            }
        },
        
        // Aplicar esta funcionalidad a un nuevo contenedor
        applyTo: function(selector) {
            const $container = $(selector);
            if ($container.length > 0) {
                this.renderIconsInContainer($container);
            }
        }
    };
    
    // Inicializar cuando el DOM esté listo
    $(document).ready(function() {
        // Iniciar con un pequeño retraso para asegurar que los estilos estén cargados
        setTimeout(function() {
            window.TablerIconsDirectScanner.init();
        }, 500);
        
        // También aplicar cuando se carga un nuevo panel o diálogo
        $(document).on('shown.bs.modal', '.modal', function() {
            setTimeout(function() {
                $('.modal .uipsm-icons-grid').each(function() {
                    window.TablerIconsDirectScanner.renderIconsInContainer($(this));
                });
            }, 100);
        });
        
        // Actualizar dinámicamente al hacer clic en botones que podrían mostrar la biblioteca de iconos
        $(document).on('click', 'button, .icon-selector, [data-toggle="icons"]', function() {
            setTimeout(function() {
                $('.uipsm-icons-grid:empty, .icon-grid:empty').each(function() {
                    window.TablerIconsDirectScanner.renderIconsInContainer($(this));
                });
            }, 100);
        });
    });
    
})(jQuery);