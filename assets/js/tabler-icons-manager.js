/**
 * Tabler Icons Manager
 * Script para gestionar los iconos de Tabler en el plugin StrykerNova VortexUI
 */

(function($) {
    'use strict';
    
    // Objeto global para gestionar los iconos
    window.TablerIconsManager = {
        /**
         * Lista de iconos disponibles
         */
        availableIcons: [
            'dashboard',
            'home',
            'settings',
            'user',
            'users',
            'message',
            // Añade más iconos aquí a medida que se agreguen al plugin
        ],
        
        /**
         * Inicializar el gestor de iconos
         */
        init: function() {
            // Verificar si los iconos están cargados correctamente
            this.verifyIconsLoaded();
            
            // Inicializar eventos relacionados con los iconos
            this.initEvents();
            
            console.log('TablerIconsManager inicializado correctamente');
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
                console.warn('Los iconos de Tabler no se cargaron correctamente. Verificando rutas alternativas...');
                this.tryAlternativeLoad();
            }
            
            $testIcon.remove();
        },
        
        /**
         * Intentar cargar los iconos desde rutas alternativas si la carga principal falló
         */
        tryAlternativeLoad: function() {
            // Cargar el CSS directamente si no se cargó con el plugin
            if (!$('link[href*="tabler-icons.css"]').length) {
                $('head').append('<link rel="stylesheet" href="' + uipsm.plugin_url + 'assets/css/tabler-icons.css">');
                console.log('Cargando CSS de iconos desde ruta alternativa');
            }
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
            // Construir la cuadrícula de iconos
            let iconsHtml = '';
            
            this.availableIcons.forEach(function(icon) {
                iconsHtml += '<div class="uipsm-icon-item" data-icon="ti-' + icon + '">' +
                    '<i class="ti ti-' + icon + '"></i>' +
                    '<span>ti-' + icon + '</span>' +
                '</div>';
            });
            
            // Reemplazar la cuadrícula existente si está vacía o no muestra los iconos
            const $iconsGrid = $('.uipsm-icons-grid');
            if ($iconsGrid.length && ($iconsGrid.is(':empty') || $iconsGrid.find('i').css('width') === '0px')) {
                $iconsGrid.html(iconsHtml);
                
                // Reinicializar eventos de clic en los iconos
                $('.uipsm-icon-item').on('click', function() {
                    const iconClass = $(this).data('icon');
                    $('#uipsm-item-icon').val(iconClass);
                    $('.uipsm-icon-preview').html('<i class="' + iconClass + '"></i>');
                });
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
        window.TablerIconsManager.init();
    });
    
})(jQuery);
