/**
 * Tabler Icons Fix
 * Script para corregir problemas de visualización de iconos
 */

(function() {
    // Ejecutar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        console.log('TablerIconsFix: Inicializando...');
        
        // Verificar si los iconos se muestran correctamente
        setTimeout(function() {
            fixIcons();
        }, 500);
    });
    
    // Función para arreglar visualización de iconos
    function fixIcons() {
        // Verificar si hay algún icono visible
        const testIcon = document.querySelector('.ti');
        
        if (!testIcon) {
            console.log('TablerIconsFix: No se encontraron iconos en la página');
            return;
        }
        
        // Comprobar dimensiones
        const iconStyle = window.getComputedStyle(testIcon);
        const iconWidth = parseInt(iconStyle.width);
        const iconHeight = parseInt(iconStyle.height);
        
        if (iconWidth === 0 || iconHeight === 0) {
            console.log('TablerIconsFix: Los iconos no se están mostrando correctamente, aplicando solución alternativa');
            
            // Aplicar estilos críticos para arreglar los iconos
            const fixStyle = document.createElement('style');
            fixStyle.textContent = `
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
                
                .uipsm-icon-preview {
                  width: 40px !important;
                  height: 40px !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  font-size: 24px !important;
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
                  border-color: #007cba !important;
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
                
                .uipsm-icons-grid {
                  display: grid !important;
                  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)) !important;
                  gap: 8px !important;
                  max-height: 300px !important;
                  overflow-y: auto !important;
                  border: 1px solid #ddd !important;
                  padding: 10px !important;
                  background-color: #fff !important;
                  border-radius: 4px !important;
                }
            `;
            
            document.head.appendChild(fixStyle);
            
            // Reintentar cargar los iconos en la cuadrícula
            const iconsGrid = document.querySelector('.uipsm-icons-grid');
            if (iconsGrid && !iconsGrid.querySelector('.uipsm-icon-item')) {
                console.log('TablerIconsFix: Regenerando cuadrícula de iconos');
                
                // Lista básica de iconos para asegurar que se muestre algo
                const basicIcons = [
                    'dashboard', 'home', 'settings', 'user', 'users', 'message',
                    'menu', 'plus', 'trash', 'edit', 'check', 'search'
                ];
                
                let iconsHtml = '';
                basicIcons.forEach(function(icon) {
                    iconsHtml += '<div class="uipsm-icon-item" data-icon="ti-' + icon + '">' +
                        '<i class="ti ti-' + icon + '"></i>' +
                        '<span>ti-' + icon + '</span>' +
                    '</div>';
                });
                
                iconsGrid.innerHTML = iconsHtml;
                
                // Asignar eventos
                iconsGrid.querySelectorAll('.uipsm-icon-item').forEach(function(item) {
                    item.addEventListener('click', function() {
                        const iconClass = this.getAttribute('data-icon');
                        const iconInput = document.getElementById('uipsm-item-icon');
                        const iconPreview = document.querySelector('.uipsm-icon-preview');
                        
                        if (iconInput) {
                            iconInput.value = iconClass;
                        }
                        
                        if (iconPreview) {
                            // FIX: Corregido el formato de clase del icono
                            iconPreview.innerHTML = '<i class="' + iconClass + '"></i>';
                        }
                    });
                });
            }
            
            console.log('TablerIconsFix: Corrección aplicada');
        } else {
            console.log('TablerIconsFix: Los iconos se están mostrando correctamente');
        }
    }
})();
