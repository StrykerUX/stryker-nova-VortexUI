<?php
/**
 * Script de utilidad para escanear los iconos de Tabler en la carpeta assets/tabler-icons-outline
 * y generar una lista para usar en tabler-icons-direct-scanner.js
 * 
 * Para usar: Coloca este archivo en la carpeta raíz del plugin y ejecútalo desde la línea de comandos:
 * > php tools/scan-icons.php
 */

// Ruta a la carpeta de iconos
$icons_dir = __DIR__ . '/../assets/tabler-icons-outline/';

// Verificar que la carpeta existe
if (!is_dir($icons_dir)) {
    echo "Error: La carpeta '{$icons_dir}' no existe\n";
    exit(1);
}

// Leer archivos SVG de la carpeta
$icons = array();
$excluded_files = array('.', '..', 'README.md', '.DS_Store', 'Thumbs.db');

if ($handle = opendir($icons_dir)) {
    while (false !== ($file = readdir($handle))) {
        // Excluir archivos ocultos y directorios
        if (in_array($file, $excluded_files) || is_dir($icons_dir . $file)) {
            continue;
        }
        
        // Solo incluir archivos SVG
        if (pathinfo($file, PATHINFO_EXTENSION) === 'svg') {
            // Quitar extensión .svg
            $icon_name = pathinfo($file, PATHINFO_FILENAME);
            $icons[] = $icon_name;
        }
    }
    closedir($handle);
}

// Ordenar alfabéticamente
sort($icons);

// Si no se encontraron iconos, salir
if (empty($icons)) {
    echo "No se encontraron iconos en la carpeta '{$icons_dir}'\n";
    exit(1);
}

// Generar JavaScript
$js_array = "const ALL_TABLER_ICONS = [\n";
$chunks = array_chunk($icons, 5); // Dividir en grupos de 5 para mejor legibilidad
foreach ($chunks as $chunk) {
    $js_array .= "    '" . implode("', '", $chunk) . "',\n";
}
$js_array = rtrim($js_array, ",\n") . "\n];";

// Mostrar resultado
echo "Se encontraron " . count($icons) . " iconos en la carpeta '{$icons_dir}'.\n\n";
echo "Código para tabler-icons-direct-scanner.js:\n\n";
echo $js_array . "\n\n";

// Guardar en un archivo
$output_file = __DIR__ . '/icons-list.js';
file_put_contents($output_file, $js_array);
echo "La lista también se ha guardado en '{$output_file}'.\n";

// Además, guardar una versión PHP
$php_array = "<?php\n\n";
$php_array .= "\$icons = array(\n";
$chunks = array_chunk($icons, 5); // Dividir en grupos de 5 para mejor legibilidad
foreach ($chunks as $chunk) {
    $php_array .= "    '" . implode("', '", $chunk) . "',\n";
}
$php_array = rtrim($php_array, ",\n") . "\n);\n";

// Guardar en un archivo PHP
$output_php_file = __DIR__ . '/icons-list.php';
file_put_contents($output_php_file, $php_array);
echo "La lista también se ha guardado en formato PHP en '{$output_php_file}'.\n";
