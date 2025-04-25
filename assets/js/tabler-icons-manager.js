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
         * Esta lista se expande con iconos de la documentación oficial de Tabler Icons
         */
        availableIcons: [
            // Iconos básicos
            'dashboard', 'home', 'settings', 'user', 'users', 'message',
            // Navegación
            'menu', 'menu-2', 'layout-dashboard', 'apps', 'browser',
            // Interfaz
            'checkbox', 'circle-check', 'circle-x', 'alert-circle', 'info-circle', 
            'help', 'alert-triangle', 'bell', 'calendar', 'search',
            // Comunicación
            'mail', 'send', 'phone', 'message-circle', 'messages', 'chat',
            // Acciones
            'plus', 'minus', 'x', 'check', 'edit', 'pencil', 'trash', 'download', 'upload',
            // Datos
            'file', 'files', 'folder', 'clipboard', 'book', 'books', 'list',
            // Usuario
            'user-circle', 'user-plus', 'user-minus', 'user-check', 'user-x', 'users-group',
            // Redes sociales
            'brand-facebook', 'brand-twitter', 'brand-instagram', 'brand-youtube', 'brand-github',
            // Dispositivos
            'device-mobile', 'device-tablet', 'device-laptop', 'device-desktop', 'printer',
            // Funciones
            'chart-bar', 'chart-pie', 'chart-line', 'graph', 'report', 'calculator',
            // Finanzas
            'cash', 'credit-card', 'coin', 'currency-dollar', 'receipt',
            // Varios
            'heart', 'star', 'map', 'pin', 'clock', 'eye', 'camera', 'photo', 'palette',
            'bulb', 'music', 'video', 'microphone', 'puzzle', 'trophy', 'flag'
        ],
        
        /**
         * Inicializar el gestor de iconos
         */
        init: function() {
            console.log('TablerIconsManager: Inicializando...');
            
            // Verificar si los iconos están cargados correctamente
            this.verifyIconsLoaded();
            
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
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    vertical-align: middle;
                    color: currentColor;
                    position: relative;
                }
                .ti::before {
                    content: '';
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    background-color: currentColor;
                    -webkit-mask-size: cover;
                    mask-size: cover;
                    -webkit-mask-repeat: no-repeat;
                    mask-repeat: no-repeat;
                    -webkit-mask-position: center;
                    mask-position: center;
                }
                .uipsm-icon-item {
                    cursor: pointer;
                    padding: 10px;
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
                    margin-bottom: 8px;
                    display: block;
                }
                .uipsm-icon-item span {
                    font-size: 10px;
                    display: block;
                    color: #666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `;
            
            const $style = $('<style id="tabler-icons-fallback"></style>').html(criticalStyles);
            $('head').append($style);
            
            console.log('TablerIconsManager: Estilos de respaldo aplicados');
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
            
            this.availableIcons.forEach(function(icon) {
                iconsHtml += '<div class="uipsm-icon-item" data-icon="ti-' + icon + '">' +
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
                    $('.uipsm-icon-preview').html('<i class="ti ' + iconClass + '"></i>');
                    
                    // Cerrar visualmente la cuadrícula para mejorar la experiencia
                    $('html, body').animate({
                        scrollTop: $('#uipsm-item-icon').offset().top - 50
                    }, 300);
                });
                
                console.log('TablerIconsManager: Selector de iconos inicializado con ' + this.availableIcons.length + ' iconos');
            } else {
                console.error('TablerIconsManager: No se encontró el contenedor .uipsm-icons-grid');
            }
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