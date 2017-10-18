<?php 










// echo $grixjs;
define('TL_MODE', 'FE');
// require('../../../../system/initialize.php');


$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);



$grixjs = \Input::get('grixjs');  
$articleId = \Input::get('articleId');  
$ceId = \Input::get('ceId');  



// Insert the new grix data
$objResult = Database::getInstance()->prepare("UPDATE tl_article SET grixJs=? WHERE id=?")->execute($grixjs, $articleId);

// Update the used CEs for this article
$objUsedCEs = Database::getInstance()->prepare("SELECT CEsUsed from tl_article WHERE id=?")->execute($articleId);
$arrUsedCEs = unserialize($objUsedCEs->CEsUsed);

if (!is_array($arrUsedCEs))
{
	$arrUsedCEs = array();
}

if (!in_array($ceId, $arrUsedCEs)) {
    $arrUsedCEs[] = $ceId;
	$data = serialize($arrUsedCEs);
	Database::getInstance()->prepare("UPDATE tl_article SET CEsUsed=? WHERE id=?")->execute($data, $articleId);
    
}
	


echo 'done!';


