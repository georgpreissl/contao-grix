<?php 


$GLOBALS['TL_DCA']['tl_article']['fields']['grixJs'] = array
(
	'label'                   => &$GLOBALS['TL_LANG']['tl_article']['grixJs'],
	'exclude'                 => true,
	'inputType'               => 'textarea',
	'default'				  => '[{"type":"row","unitsConf":{"xs":12,"sm":12,"md":12,"lg":12},"classes":"","elements":[{"type":"col","units":"12","boot":{"xs":12,"sm":12,"md":12,"lg":12},"classes":"","elements":[]}]}]',
	'eval'					  => array
	(
		'preserveTags' => true, 
		'allowHtml'=>true, 
		'tl_class' => 'grixJs'
	),
   'sql'                     => "mediumtext NULL"
);


$GLOBALS['TL_DCA']['tl_article']['fields']['grixHtmlFrontend'] = array
(
	'label'                   => &$GLOBALS['TL_LANG']['tl_article']['grixHtmlFrontend'],
	'exclude'                 => true,
	'inputType'               => 'textarea',
	'eval' 					  => array
	(
		'preserveTags' => true, 
		'allowHtml'=> true, 
		'tl_class' => 'grixHtmlFrontend'
	),
	'sql'                     => "mediumtext NULL"
);



// Add the toggle checkbox to the article palette
$GLOBALS['TL_DCA']['tl_article']['palettes']['default'] .= ',grixToggle';


$GLOBALS['TL_DCA']['tl_article']['fields']['grixToggle'] = array
(
	'label'         => &$GLOBALS['TL_LANG']['tl_article']['grixToggle'],
	'exclude'       => true,
	'inputType'     => 'checkbox',
	'eval' 			=> array('tl_class'=>'long clr'),
	'sql'           => "char(1) NOT NULL default ''"
);




$GLOBALS['TL_DCA']['tl_article']['fields']['CEsUsed'] = array
(
	'label'         => &$GLOBALS['TL_LANG']['tl_article']['CEsUsed'],
	'exclude'       => true,
	'inputType'     => 'text',
	'eval' 			=> array('tl_class'=>'long clr'),
	'sql'           => "varchar(255) NOT NULL default ''"
);




?>