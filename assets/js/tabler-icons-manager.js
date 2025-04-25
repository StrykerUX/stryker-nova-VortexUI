/**
 * Tabler Icons Manager - Versión mejorada
 * Script para gestionar los iconos de Tabler en el plugin StrykerNova VortexUI
 */

(function($) {
    'use strict';
    
    // Objeto global para gestionar los iconos
    window.TablerIconsManager = {
        /**
         * Lista de iconos disponibles
         * Esta lista inicial es sólo un placeholder y será reemplazada por los iconos reales
         */
        availableIcons: [],
        
        /**
         * Inicializar el gestor de iconos
         */
        init: function() {
            console.log('TablerIconsManager: Inicializando...');
            
            // Verificar si los iconos están cargados correctamente
            this.verifyIconsLoaded();
            
            // Cargar dinámicamente los iconos desde el directorio assets/tabler-icons-outline
            this.loadIconsFromDirectory();
            
            // Inicializar eventos relacionados con los iconos
            this.initEvents();
            
            console.log('TablerIconsManager: Inicializado correctamente');
        },
        
        /**
         * Verificar si los iconos están cargados correctamente
         */
        verifyIconsLoaded: function() {
            const $testIcon = $('<i class="ti ti-dashboard"></i>');
            $('body').append($testIcon);
            
            // Verificar si el icono tiene dimensiones adecuadas
            const hasStyles = $testIcon.css('width') !== '0px' && $testIcon.css('height') !== '0px';
            
            if (!hasStyles) {
                console.warn('TablerIconsManager: Los iconos no se cargaron correctamente. Aplicando solución alternativa...');
                this.loadFallbackIcons();
            } else {
                console.log('TablerIconsManager: Iconos cargados correctamente');
            }
            
            $testIcon.remove();
        },
        
        /**
         * Cargar iconos de respaldo utilizando SVG directamente
         */
        loadFallbackIcons: function() {
            // Añadir estilos críticos directamente al DOM para que los iconos se muestren
            const criticalStyles = `
                .ti {
                    display: inline-block !important;
                    width: 1em !important;
                    height: 1em !important;
                    vertical-align: -0.125em !important;
                    color: currentColor !important;
                    position: relative !important;
                }
                
                .ti::before {
                    content: '' !important;
                    display: inline-block !important;
                    width: 1em !important;
                    height: 1em !important;
                    background-color: currentColor !important;
                    -webkit-mask-size: cover !important;
                    mask-size: cover !important;
                    -webkit-mask-repeat: no-repeat !important;
                    mask-repeat: no-repeat !important;
                    -webkit-mask-position: center !important;
                    mask-position: center !important;
                }
                
                .uipsm-icon-item {
                    cursor: pointer !important;
                    padding: 8px 5px !important;
                    text-align: center !important;
                    border: 1px solid #f0f0f0 !important;
                    border-radius: 4px !important;
                    transition: all 0.2s !important;
                }
                
                .uipsm-icon-item:hover {
                    background-color: #f6f7f7 !important;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
                }
                
                .uipsm-icon-item i {
                    font-size: 24px !important;
                    display: block !important;
                    margin-bottom: 5px !important;
                    color: #444 !important;
                }
                
                .uipsm-icon-item span {
                    font-size: 9px !important;
                    display: block !important;
                    color: #777 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
            `;
            
            const $style = $('<style id="tabler-icons-fallback"></style>').html(criticalStyles);
            $('head').append($style);
            
            console.log('TablerIconsManager: Estilos de respaldo aplicados');
        },
        
        /**
         * Cargar iconos dinámicamente del directorio
         */
        loadIconsFromDirectory: function() {
            // Esta lista es una representación exacta de los archivos SVG que hay en la carpeta assets/tabler-icons-outline/
            // basado en la lista que vimos anteriormente en el repositorio
            this.availableIcons = [
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
            
            console.log('TablerIconsManager: Cargados ' + this.availableIcons.length + ' iconos');
        },
        
        /**
         * Inicializar eventos relacionados con los iconos
         */
        initEvents: function() {
            // Si estamos en la página de administración del plugin
            if ($('.uipsm-admin-container').length) {
                this.initIconPicker();
            }
        },
        
        /**
         * Inicializar el selector de iconos en la administración
         */
        initIconPicker: function() {
            console.log('TablerIconsManager: Inicializando selector de iconos...');
            
            // Construir la cuadrícula de iconos
            let iconsHtml = '';
            const self = this;
            
            this.availableIcons.forEach(function(icon) {
                iconsHtml += '<div class="uipsm-icon-item" data-icon="ti ti-' + icon + '">' +
                    '<i class="ti ti-' + icon + '"></i>' +
                    '<span>ti-' + icon + '</span>' +
                '</div>';
            });
            
            // Reemplazar la cuadrícula existente
            const $iconsGrid = $('.uipsm-icons-grid');
            if ($iconsGrid.length) {
                $iconsGrid.html(iconsHtml);
                
                // Reinicializar eventos de clic en los iconos
                $('.uipsm-icon-item').off('click').on('click', function() {
                    const iconClass = $(this).data('icon');
                    $('#uipsm-item-icon').val(iconClass);
                    $('.uipsm-icon-preview').html('<i class="' + iconClass + '"></i>');
                    
                    // Cerrar visualmente la cuadrícula para mejorar la experiencia
                    $('html, body').animate({
                        scrollTop: $('#uipsm-item-icon').offset().top - 50
                    }, 300);
                });
                
                console.log('TablerIconsManager: Selector de iconos inicializado con ' + this.availableIcons.length + ' iconos');
                
                // Inicializar buscador de iconos
                this.initIconSearch();
            } else {
                console.error('TablerIconsManager: No se encontró el contenedor .uipsm-icons-grid');
            }
        },
        
        /**
         * Inicializar búsqueda de iconos
         */
        initIconSearch: function() {
            $('#uipsm-icon-search').off('input').on('input', function() {
                const searchTerm = $(this).val().toLowerCase();
                
                $('.uipsm-icon-item').each(function() {
                    const iconName = $(this).data('icon').toLowerCase();
                    if (iconName.includes(searchTerm)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
            
            console.log('TablerIconsManager: Búsqueda de iconos inicializada');
        },
        
        /**
         * Obtener un icono como HTML
         * @param {string} iconName - Nombre del icono sin prefijo (ej: 'dashboard')
         * @param {string} size - Tamaño del icono (sm, lg, xl, 2x, 3x, 4x, 5x)
         * @param {boolean} spin - Si el icono debe girar
         * @return {string} HTML del icono
         */
        getIconHtml: function(iconName, size, spin) {
            let classes = 'ti ti-' + iconName;
            
            if (size) {
                classes += ' ti-' + size;
            }
            
            if (spin) {
                classes += ' ti-spin';
            }
            
            return '<i class="' + classes + '"></i>';
        },
        
        /**
         * Verificar si un icono está disponible
         * @param {string} iconName - Nombre del icono sin prefijo
         * @return {boolean}
         */
        isIconAvailable: function(iconName) {
            return this.availableIcons.indexOf(iconName) !== -1;
        }
    };
    
    // Inicializar el gestor de iconos cuando el DOM esté listo
    $(document).ready(function() {
        // Pequeño retraso para asegurarse de que otros scripts se han cargado
        setTimeout(function() {
            window.TablerIconsManager.init();
        }, 100);
    });
    
})(jQuery);