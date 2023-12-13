<?php
/*
 * Plugin Name: Music Player Javasciprt
 * Plugin URI: 
 * Description: 
 * Version: 0.0.1
 * Author:
 * Author URI: 
 */

// Music custom post type + custom field //
function cptui_register_my_cpts_js_music() {

	/**
	 * Post Type: js_music.
	 */

	$labels = [
		"name" => esc_html__( "js_music", "astra" ),
		"singular_name" => esc_html__( "Music", "astra" ),
	];

	$args = [
		"label" => esc_html__( "js_music", "astra" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => true,
		"rest_base" => "",
		"rest_controller_class" => "WP_REST_Posts_Controller",
		"rest_namespace" => "wp/v2",
		"has_archive" => false,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"delete_with_user" => false,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"can_export" => false,
		"rewrite" => [ "slug" => "js_music", "with_front" => true ],
		"query_var" => true,
		"supports" => [ "title", "editor", "thumbnail" ],
		"show_in_graphql" => false,
	];

	register_post_type( "js_music", $args );
}

add_action( 'init', 'cptui_register_my_cpts_js_music' );
if( function_exists('acf_add_local_field_group') ):

    acf_add_local_field_group(array(
        'key' => 'group_6412ea205c484',
        'title' => 'music js',
        'fields' => array(
            array(
                'key' => 'field_6412ea3862f38',
                'label' => 'artist_name',
                'name' => 'artist_name',
                'type' => 'text',
                'instructions' => '',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'placeholder' => '',
                'prepend' => '',
                'append' => '',
                'maxlength' => '',
            ),
            array(
                'key' => 'field_6412ea4062f39',
                'label' => 'music_upload',
                'name' => 'music_upload',
                'type' => 'file',
                'instructions' => '',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'return_format' => 'url',
                'library' => 'all',
                'min_size' => '',
                'max_size' => '',
                'mime_types' => '',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'js_music',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => '',
    ));
    
    endif;
// remove editor //
add_action( 'init', function() {
    remove_post_type_support( 'js_music', 'editor' );

}, 99);


// edit title ( from wpbeginner ) //
function wpb_change_title_text( $title ){
    $screen = get_current_screen();
  
    if  ( 'js_music' == $screen->post_type ) {
         $title = 'Enter Music Name';
    }
  
    return $title;
}
  
add_filter( 'enter_title_here', 'wpb_change_title_text' );

// custom api endpoint //

function my_awesome_func() {
    $show_albums = get_posts( array(
        'post_type'      => 'js_music',
        'post_status'    => 'publish'
        
   ) );
   $arr = [];
   foreach ($show_albums as $item){
    $object =  [

        "music_name" => $item->post_title,
        "artist_name" =>get_field("artist_name",$item->ID),
        "music_url" => get_field("music_upload",$item->ID),
        "thumb_url" => wp_get_attachment_url( get_post_thumbnail_id($item->ID), 'thumbnail' )
      ];
    array_push($arr,$object);
   }
   return   $arr;
}
add_action( 'rest_api_init', function () {
  register_rest_route( 'musicapi/', '/items', array(
    'methods' => 'GET',
    'callback' => 'my_awesome_func',
    'permission_callback' => '__return_true'
  ) );
} );