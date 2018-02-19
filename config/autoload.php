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
 * Register the namespaces
 */
ClassLoader::addNamespaces(array
(
    'Grix',
));


/**
 * Register the classes
 */
ClassLoader::addClasses(array
(
	// Module
	'Grix\GrixBe' => 'system/modules/gp_grix/classes/GrixBe.php',

	// Hooks
	'Grix\GrixHooks' => 'system/modules/gp_grix/classes/GrixHooks.php',

    // Models
    'Grix\GrixCssModel'    => 'system/modules/gp_grix/models/GrixCssModel.php',

));


/**
 * Register the templates
 */
TemplateLoader::addFiles(array
(
	'mod_grix' => 'system/modules/gp_grix/templates',
	'mod_grix_help' => 'system/modules/gp_grix/templates'
));


