/**
 * Tabler Icons Scanner - Script para escanear iconos sin depender de AJAX
 * 
 * Este enfoque alternativo evita los problemas con nonce y AJAX
 * escaneando directamente la lista de iconos disponibles basados en CSS.
 */

(function($) {
    'use strict';
    
    window.TablerIconsScanner = {
        /**
         * Escanear iconos disponibles basados en las clases CSS cargadas
         */
        scan: function() {
            console.log('TablerIconsScanner: Iniciando escaneo de iconos...');
            
            // Lista para almacenar los iconos encontrados
            const foundIcons = [];
            
            // Verificar si podemos utilizar el enfoque directo
            try {
                // 1. Enfoque principal: Escanear iconos conocidos del DOM
                this.scanKnownIcons(foundIcons);
                
                // 2. Enfoque alternativo: Escanear reglas CSS
                if (foundIcons.length < 30) { // Si no encontramos suficientes iconos
                    this.scanCSSRules(foundIcons);
                }
                
                // 3. Último recurso: Utilizar lista predefinida
                if (foundIcons.length < 30) {
                    console.log('TablerIconsScanner: No se encontraron suficientes iconos, usando lista predefinida.');
                    this.useDefaultIconList(foundIcons);
                }
                
                // Eliminar duplicados y ordenar
                const uniqueIcons = [...new Set(foundIcons)].sort();
                
                console.log('TablerIconsScanner: Se encontraron ' + uniqueIcons.length + ' iconos únicos.');
                
                // Actualizar TablerIconsManager con los iconos encontrados
                if (window.TablerIconsManager && uniqueIcons.length > 0) {
                    window.TablerIconsManager.availableIcons = uniqueIcons;
                    window.TablerIconsManager.initIconPicker();
                }
                
                return uniqueIcons;
            } catch (error) {
                console.error('TablerIconsScanner: Error al escanear iconos', error);
                // Fallback a lista predefinida en caso de error
                this.useDefaultIconList(foundIcons);
                
                // Eliminar duplicados y ordenar
                const uniqueIcons = [...new Set(foundIcons)].sort();
                
                if (window.TablerIconsManager) {
                    window.TablerIconsManager.availableIcons = uniqueIcons;
                    window.TablerIconsManager.initIconPicker();
                }
                
                return uniqueIcons;
            }
        },
        
        /**
         * Escanear iconos conocidos que ya existen en el DOM
         */
        scanKnownIcons: function(foundIcons) {
            // Buscar en el DOM todos los elementos que tienen clase que empieza por 'ti-'
            const iconElements = document.querySelectorAll('[class*="ti-"]');
            
            iconElements.forEach(function(element) {
                const classes = element.className.split(' ');
                
                classes.forEach(function(className) {
                    if (className.startsWith('ti-') && className !== 'ti' && !className.startsWith('ti-spin') && !className.startsWith('ti-lg') && !className.startsWith('ti-sm')) {
                        const iconName = className.substring(3); // Remover 'ti-'
                        foundIcons.push(iconName);
                    }
                });
            });
            
            console.log('TablerIconsScanner: Encontrados ' + foundIcons.length + ' iconos en el DOM.');
        },
        
        /**
         * Escanear reglas CSS para encontrar clases de iconos
         */
        scanCSSRules: function(foundIcons) {
            // Obtener todas las hojas de estilo
            const styleSheets = document.styleSheets;
            
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    // Obtener reglas de la hoja de estilo (puede fallar por CORS)
                    const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                    
                    if (!rules) continue;
                    
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        
                        // Verificar si es una regla de estilo y su selector incluye 'ti-'
                        if (rule.selectorText && rule.selectorText.includes('ti-')) {
                            // Extraer nombres de iconos de selectores como ".ti-dashboard::before"
                            const matches = rule.selectorText.match(/\.ti-([a-z0-9-]+)(?:::|,|\s|$)/g);
                            
                            if (matches) {
                                matches.forEach(function(match) {
                                    // Extraer el nombre del icono
                                    let iconName = match.replace(/\.ti-/, '').replace(/::.*$/, '').replace(/[\s,].*$/, '');
                                    
                                    // Evitar pseudoclases y clases de utilidad
                                    if (!iconName.includes(':') && 
                                        !['lg', 'sm', 'xs', '1x', '2x', '3x', '4x', '5x', 'spin', 'pulse'].includes(iconName)) {
                                        foundIcons.push(iconName);
                                    }
                                });
                            }
                        }
                    }
                } catch (e) {
                    // Ignorar errores CORS al acceder a hojas de estilo externas
                    continue;
                }
            }
            
            console.log('TablerIconsScanner: Encontrados ' + foundIcons.length + ' iconos en CSS.');
        },
        
        /**
         * Utilizar lista predefinida de iconos como último recurso
         */
        useDefaultIconList: function(foundIcons) {
            // Lista predefinida basada en el repositorio
            const defaultIcons = [
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
            
            // Añadir los iconos predefinidos a la lista
            defaultIcons.forEach(function(icon) {
                foundIcons.push(icon);
            });
            
            console.log('TablerIconsScanner: Agregados ' + defaultIcons.length + ' iconos predefinidos.');
        }
    };
    
    // Inicializar cuando el DOM esté listo
    $(document).ready(function() {
        // Pequeña espera para asegurarse que los estilos estén cargados
        setTimeout(function() {
            // Escanear iconos
            TablerIconsScanner.scan();
        }, 200);
    });
    
})(jQuery);