<?php
/**
 * Plugin Name:       Bulk Menu Edit
 * Plugin URI:        https://wordpress.org/plugins/bulk-menu-edit/
 * Description:       Remove multiple menu items in one single click
 * Version:           1.3
 * Tags:              menu, edit, bulk, items
 * Requires at least: 5.0 or higher
 * Requires PHP:      5.6
 * Tested up to:      6.6.1
 * Stable tag:        1.3
 * Author:            Michael Revellin-Clerc
 * Text Domain:       bulk-menu-edit
 * Domain Path:       /languages
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Contributors:      Michael Revellin-Clerc
 * Donate link:       https://ko-fi.com/devloper
 */

if ( !class_exists( 'BulkMenuEdit' ) ) :
    /**
     * BulkMenuEdit
     */
    class BulkMenuEdit {

        /**
         * Constructor
         */
        public function __construct() {
            define( 'BME_ASSETS_URL', plugin_dir_url( __FILE__ ) . 'assets/' );
            add_action( 'admin_enqueue_scripts', array( $this, 'bme_enqueue_files' ) );
            add_action( 'wp_ajax_remove_menu_items', array( $this, 'bme_ajax_call' ) );
        }

        /**
         * Enqueue admin styles/scripts
         */
        public function bme_enqueue_files() {

            // Text Domain
            $text_domain = 'bulk-menu-edit';

            // Add JS
            wp_register_script( 'bulk-menu-js', BME_ASSETS_URL . 'bulk-menu.js', $text_domain, array( 'wp-i18n' ), false );
            wp_set_script_translations( 'bulk-menu-js', $text_domain, plugin_dir_path( __FILE__ ) . 'languages' );
            wp_enqueue_script( 'bulk-menu-js', BME_ASSETS_URL . 'bulk-menu.js', array( 'jquery' ), 'latest', false );

            // Add CSS
            wp_enqueue_style( 'bulk-menu-css', BME_ASSETS_URL . 'bulk-menu.css', 'latest', 'all' );

            // Register URL for Ajax Call
            wp_add_inline_script( 'bulk-menu-ajax', json_encode(array('ajaxurl' => admin_url( 'admin-ajax.php' ))), 'after' );

        }

        /**
         * Ajax Call
         */
        public function bme_ajax_call() {
            if ( isset( $_POST ) ) :
                $menu_items = $_POST['data'];
                foreach ( $menu_items as $data ) :
                    $menu_item_id = preg_replace( '/[^0-9]/', '', $data['value'] );
                    wp_delete_post( $menu_item_id );
                endforeach;
            endif;
        }
    }
    new BulkMenuEdit();
endif;