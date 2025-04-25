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
            const self = this;
            
            // Verificar que tenemos acceso a la variable uipsm
            if (typeof window.uipsm === 'undefined') {
                console.error('TablerIconsManager: Variable uipsm no definida. Cargando lista de respaldo...');
                self.loadBackupIconsList();
                return;
            }
            
            // Hacer una solicitud AJAX para escanear dinámicamente los archivos en la carpeta
            $.ajax({
                url: window.uipsm.ajaxurl,
                type: 'POST',
                data: {
                    action: 'uipsm_get_tabler_icons',
                    nonce: window.uipsm.nonce
                },
                success: function(response) {
                    if (response.success && response.data) {
                        self.availableIcons = response.data;
                        console.log('TablerIconsManager: Se cargaron ' + self.availableIcons.length + ' iconos dinámicamente');
                        
                        // Reinicializar el selector de iconos con los nuevos iconos
                        self.initIconPicker();
                    } else {
                        console.error('TablerIconsManager: Error al cargar iconos dinámicamente', response);
                        // Cargar la lista de respaldo en caso de error
                        self.loadBackupIconsList();
                    }
                },
                error: function(xhr, status, error) {
                    console.error('TablerIconsManager: Error AJAX al cargar iconos', error);
                    // Cargar la lista de respaldo en caso de error
                    self.loadBackupIconsList();
                }
            });
        },
        
        /**
         * Cargar lista de respaldo de iconos en caso de que falle la carga dinámica
         */
        loadBackupIconsList: function() {
            // Esta es una lista de respaldo derivada de los archivos en la carpeta
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
            
            console.log('TablerIconsManager: Cargada lista de respaldo con ' + this.availableIcons.length + ' iconos');
            
            // Inicializar el selector de iconos con la lista de respaldo
            this.initIconPicker();
        },
        
        /**
         * Inicializar eventos relacionados con los iconos
         */
        initEvents: function() {
            // Si estamos en la página de administración del plugin
            if ($('.uipsm-admin-container').length) {
                // El selector de iconos se inicializará cuando tengamos la lista completa
                // Ver loadIconsFromDirectory() y loadBackupIconsList()
            }
        },
        
        /**
         * Inicializar el selector de iconos en la administración
         */
        initIconPicker: function() {
            console.log('TablerIconsManager: Inicializando selector de iconos...');
            
            // Construir la cuadrícula de iconos
            let iconsHtml = '';
            
            // Ordenar alfabéticamente los iconos para facilitar la búsqueda
            this.availableIcons.sort();
            
            // Agrupar los iconos por categorías (si el nombre contiene guiones)
            const categorizedIcons = {
                'General': []
            };
            
            this.availableIcons.forEach(function(icon) {
                let category = 'General';
                
                // Intentar extraer una categoría del nombre del icono
                if (icon.includes('-')) {
                    const parts = icon.split('-');
                    if (parts.length >= 2 && parts[0] === 'brand') {
                        category = 'Marcas';
                    } else if (parts.length >= 2 && parts[0] === 'layout') {
                        category = 'Diseño';
                    } else if (parts.length >= 2 && parts[0] === 'device') {
                        category = 'Dispositivos';
                    } else if (parts.length >= 2 && parts[0] === 'file') {
                        category = 'Archivos';
                    } else if (parts.length >= 2 && parts[0] === 'chart') {
                        category = 'Gráficos';
                    }
                }
                
                if (!categorizedIcons[category]) {
                    categorizedIcons[category] = [];
                }
                
                categorizedIcons[category].push(icon);
            });
            
            // Generar HTML para cada categoría
            Object.keys(categorizedIcons).sort().forEach(function(category) {
                if (categorizedIcons[category].length === 0) {
                    return; // Saltar categorías vacías
                }
                
                iconsHtml += '<h4 class="uipsm-icon-category">' + category + ' (' + categorizedIcons[category].length + ')</h4>';
                iconsHtml += '<div class="uipsm-icons-category-grid">';
                
                categorizedIcons[category].forEach(function(icon) {
                    iconsHtml += '<div class="uipsm-icon-item" data-icon="ti ti-' + icon + '" data-category="' + category + '">' +
                        '<i class="ti ti-' + icon + '"></i>' +
                        '<span>ti-' + icon + '</span>' +
                    '</div>';
                });
                
                iconsHtml += '</div>';
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
                
                // Aplicar estilos para la nueva estructura
                this.applyGridStyles();
            } else {
                console.error('TablerIconsManager: No se encontró el contenedor .uipsm-icons-grid');
            }
        },
        
        /**
         * Aplicar estilos adicionales para la nueva estructura de iconos
         */
        applyGridStyles: function() {
            // Crear estilos dinámicos para las categorías
            const categoryStyles = `
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
                
                .uipsm-icons-grid {
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 10px;
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
            `;
            
            // Añadir estilos al DOM
            if (!$('#tabler-icons-grid-styles').length) {
                $('<style id="tabler-icons-grid-styles"></style>').html(categoryStyles).appendTo('head');
            }
        },
        
        /**
         * Inicializar búsqueda de iconos
         */
        initIconSearch: function() {
            $('#uipsm-icon-search').off('input').on('input', function() {
                const searchTerm = $(this).val().toLowerCase();
                
                if (searchTerm === '') {
                    // Mostrar todas las categorías y todos los iconos
                    $('.uipsm-icon-category').show();
                    $('.uipsm-icon-item').show();
                } else {
                    // Primero ocultar todas las categorías
                    $('.uipsm-icon-category').hide();
                    // Y todos los iconos
                    $('.uipsm-icon-item').hide();
                    
                    // Luego mostrar solo los iconos que coinciden
                    $('.uipsm-icon-item').each(function() {
                        const iconName = $(this).data('icon').toLowerCase();
                        if (iconName.includes(searchTerm)) {
                            $(this).show();
                            // Mostrar la categoría correspondiente
                            $(this).closest('.uipsm-icons-category-grid').prev('.uipsm-icon-category').show();
                        }
                    });
                }
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