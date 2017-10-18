<?php 



$articleId = $_GET['articleId'];
$strCEs = $_GET['arCEs'];
$arrCEs = json_decode($strCEs);


// echo $articleId.'_';

define('TL_MODE', 'FE');


$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);


$objUsedCEs = Database::getInstance()->prepare("SELECT CEsUsed from tl_article WHERE id=?")->execute($articleId);
$arrUsedCEs = unserialize($objUsedCEs->CEsUsed);

if (!is_array($arrUsedCEs)) {

	$arrUsedCEs = array();

}


foreach ($arrCEs as $key => $id) {
	if (!in_array($id, $arrUsedCEs)) {
	    $arrUsedCEs[] = $id;
	    
	}
	
}
$data = serialize($arrUsedCEs);
Database::getInstance()->prepare("UPDATE tl_article SET CEsUsed=? WHERE id=?")->execute($data, $articleId);
	


echo 'done!';



?>