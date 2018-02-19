<?php

/**
 * Grid Extension for Contao
 *
 * Copyright (c) 2017 Georg Preissl
 *
 * @package gp_grix
 * @link    http://www.georg-preissl.at
 * @license http://opensource.org/licenses/MIT MIT
 */


/**
 * Backend module
 */
array_insert($GLOBALS['BE_MOD']['design'], 1, array
(
	'grixbe' => array
	(
		'callback'        => 'GrixBe',
		'tables' 		  => array('tl_article'),
		'icon'            => 'system/modules/gp_grix/assets/img/icon.svg'
	),
	'grixCss' => array
	(
	    'tables'          => array('tl_grix_css'),
	    'icon'            => 'system/modules/gp_grix/assets/img/icon.svg'
	)

));


/**
 * Hooks
 */

// Add the grix icon in the article list view
$GLOBALS['TL_HOOKS']['loadDataContainer'][] = array('GrixHooks', 'addGrixIcon');

// Add the bootstrap css file to the layout options in the backend
$GLOBALS['TL_HOOKS']['loadDataContainer'][] = array('GrixHooks', 'addBootstrapFramework');

// Output the grix html if grix is activated
$GLOBALS['TL_HOOKS']['compileArticle'][] = array('GrixHooks', 'myCompileArticle');

// Add a class to the body in the backend when editing an article with grix
$GLOBALS['TL_HOOKS']['parseBackendTemplate'][] = array('GrixHooks', 'myParseBackendTemplate');

// Ajax save function
$GLOBALS['TL_HOOKS']['executePreActions'][] = array('GrixHooks', 'grixPreAction');
$GLOBALS['TL_HOOKS']['executePostActions'][] = array('GrixHooks', 'grixPostAction');



/*
ToDo:

- title attributes with optional explanations for the css classes in the lightbox
- 




*/


?>
