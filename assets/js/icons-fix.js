/**
 * Icons Fix - Solución definitiva para la biblioteca de iconos
 * Este script corrige los problemas de visualización de iconos en todos los contextos
 */

(function($) {
    'use strict';
    
    // Función para generar HTML de iconos de manera simple
    function generateIconsGrid() {
        // Lista básica de iconos que sabemos que funcionan
        const basicIcons = [
            'dashboard', 'home', 'user', 'users', 'settings', 'calendar',
            'mail', 'bell', 'search', 'menu', 'plus', 'minus', 'x',
            'check', 'heart', 'star', 'share', 'edit', 'trash', 'download',
            'upload', 'eye', 'eye-off', 'file', 'folder', 'tag', 'list',
            'lock', 'shield', 'phone', 'message', 'help', 'clock',
            'bell', 'layout', 'layout-dashboard', 'layout-grid'
        ];
        
        // Crear HTML
        let html = '';
        
        // Crear una categoría única y simple
        html += '<div class="uipsm-icons-grid-wrapper">';
        
        // Crear grid de iconos
        basicIcons.forEach(function(icon) {
            html += '<div class="uipsm-icon-item" data-icon="ti ti-' + icon + '">' +
                    '<i class="ti ti-' + icon + '"></i>' +
                    '<span>ti-' + icon + '</span>' +
                  '</div>';
        });
        
        html += '</div>';
        
        return html;
    }
    
    // Aplicar la solución a todas las áreas de iconos
    function applyIconsFix() {
        console.log('IconsFix: Aplicando solución...');
        
        // Aplicar a todas las grids de iconos
        $('.uipsm-icons-grid, .icon-grid').each(function() {
            var $grid = $(this);
            
            // Si está vacío o muestra el texto de carga
            if ($grid.is(':empty') || $grid.html().includes('Cargando iconos')) {
                $grid.html(generateIconsGrid());
                initIconEvents($grid);
                console.log('IconsFix: Grid de iconos corregida', $grid);
            }
        });
        
        // Observar DOM para nuevas grids
        observeDOM();
    }
    
    // Inicializar eventos en una grid
    function initIconEvents($container) {
        // Click en iconos
        $container.find('.uipsm-icon-item').off('click').on('click', function() {
            var iconClass = $(this).data('icon');
            $('#uipsm-item-icon').val(iconClass);
            $('.uipsm-icon-preview').html('<i class="' + iconClass + '"></i>');
            
            console.log('IconsFix: Icono seleccionado', iconClass);
        });
    }
    
    // Observar cambios en el DOM para aplicar fix a nuevos elementos
    function observeDOM() {
        // Comprobar si MutationObserver está disponible
        if (window.MutationObserver) {
            // Crear un observador que busque cambios en el cuerpo del documento
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    // Si se agregaron nodos
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        // Buscar grids de iconos recién agregadas
                        $(mutation.addedNodes).find('.uipsm-icons-grid, .icon-grid').each(function() {
                            var $grid = $(this);
                            
                            // Si está vacío o muestra el texto de carga
                            if ($grid.is(':empty') || $grid.html().includes('Cargando iconos')) {
                                $grid.html(generateIconsGrid());
                                initIconEvents($grid);
                                console.log('IconsFix: Nueva grid de iconos corregida', $grid);
                            }
                        });
                    }
                });
            });
            
            // Configurar el observador para que mire todo el documento
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('IconsFix: Observador DOM iniciado');
        } else {
            console.log('IconsFix: MutationObserver no disponible, usando fallback');
            
            // Fallback con timer para navegadores antiguos
            setInterval(function() {
                $('.uipsm-icons-grid:empty, .icon-grid:empty, .uipsm-icons-grid:contains("Cargando iconos"), .icon-grid:contains("Cargando iconos")').each(function() {
                    $(this).html(generateIconsGrid());
                    initIconEvents($(this));
                });
            }, 1000);
        }
    }
    
    // Aplicar CSS para iconos
    function applyIconsCSS() {
        const css = `
            .uipsm-icons-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
                max-height: 300px;
                overflow-y: auto;
                padding: 10px;
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
            
            /* Estilos para pantallas más pequeñas */
            @media (max-width: 782px) {
                .uipsm-icons-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;
        
        // Agregar estilos al head
        $('<style id="icons-fix-css"></style>').html(css).appendTo('head');
        console.log('IconsFix: CSS aplicado');
    }
    
    // Inicializar cuando el DOM esté listo
    $(document).ready(function() {
        console.log('IconsFix: Inicializando...');
        
        // Aplicar CSS
        applyIconsCSS();
        
        // Aplicar fix con un pequeño retraso
        setTimeout(function() {
            applyIconsFix();
        }, 500);
        
        // Y una segunda pasada por si acaso
        setTimeout(function() {
            applyIconsFix();
        }, 2000);
        
        // Buscar nuevas grids cuando se hace clic en botones
        $(document).on('click', 'button, .icon-picker, [data-toggle="icons"]', function() {
            setTimeout(applyIconsFix, 100);
        });
        
        console.log('IconsFix: Inicializado');
    });
    
})(jQuery);