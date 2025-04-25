<div class="vortex-ui-panel">
    <div class="vortex-ui-panel-header">
        <div class="vortex-ui-panel-title">
            <?php if (!empty($options['menu_logo'])) : ?>
                <img src="<?php echo esc_url($options['menu_logo']); ?>" alt="Logo" class="vortex-ui-panel-logo">
            <?php endif; ?>
            <h2><?php echo esc_html($options['menu_title'] ?? 'UI Panel SaaS'); ?></h2>
            <?php if (!empty($options['menu_subtitle'])) : ?>
                <p><?php echo esc_html($options['menu_subtitle']); ?></p>
            <?php endif; ?>
        </div>
        <button class="vortex-ui-panel-toggle">
            <i class="ti ti-chevron-left"></i>
        </button>
    </div>
    
    <ul class="vortex-ui-panel-menu">
        <?php foreach ($main_items as $item) : ?>
            <?php 
            // Saltar elementos no publicados
            if (isset($item['status']) && $item['status'] !== 'publish') {
                continue;
            }
            
            // Comprobar si tiene elementos secundarios
            $has_children = isset($child_items[$item['id']]) && !empty($child_items[$item['id']]);
            
            // Comprobar si es la página actual
            $current_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $is_current = $current_url === $item['url'];
            
            // Comprobar si algún hijo es la página actual
            $has_active_child = false;
            if ($has_children) {
                foreach ($child_items[$item['id']] as $child) {
                    if ($current_url === $child['url']) {
                        $has_active_child = true;
                        break;
                    }
                }
            }
            ?>
            <li class="vortex-ui-panel-menu-item <?php echo ($has_active_child ? 'open' : ''); ?>" data-title="<?php echo esc_attr($item['title']); ?>">
                <a href="<?php echo esc_url($item['url']); ?>" class="vortex-ui-panel-menu-link <?php echo ($is_current || $has_active_child ? 'active' : ''); ?>">
                    <span class="vortex-ui-panel-menu-icon">
                        <i class="ti ti-<?php echo esc_attr($item['icon'] ?? 'help'); ?>"></i>
                    </span>
                    <span class="vortex-ui-panel-menu-text">
                        <?php echo esc_html($item['title']); ?>
                    </span>
                </a>
                
                <?php if ($has_children) : ?>
                    <button class="vortex-ui-panel-submenu-toggle">
                        <i class="ti ti-chevron-right"></i>
                    </button>
                    
                    <ul class="vortex-ui-panel-submenu">
                        <?php foreach ($child_items[$item['id']] as $child) : ?>
                            <?php 
                            // Saltar elementos no publicados
                            if (isset($child['status']) && $child['status'] !== 'publish') {
                                continue;
                            }
                            
                            // Comprobar si es la página actual
                            $is_child_current = $current_url === $child['url'];
                            ?>
                            <li class="vortex-ui-panel-submenu-item">
                                <a href="<?php echo esc_url($child['url']); ?>" class="vortex-ui-panel-submenu-link <?php echo ($is_child_current ? 'active' : ''); ?>">
                                    <span class="vortex-ui-panel-menu-icon">
                                        <i class="ti ti-<?php echo esc_attr($child['icon'] ?? 'help'); ?>"></i>
                                    </span>
                                    <span class="vortex-ui-panel-menu-text">
                                        <?php echo esc_html($child['title']); ?>
                                    </span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>
</div>
