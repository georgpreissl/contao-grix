<?php 



$id = $_GET['id'];  
$articleId = $_GET['articleId'];  

// echo 'id: '.$id;
// echo 'articleId: '.$articleId;

define('TL_MODE', 'FE');

$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);



// delete the CE

$objResult = Database::getInstance()->prepare("DELETE FROM tl_content WHERE id=?")->execute($id);



// delete the CE id from the 'CEsUsed' list

$objCEsUsed = Database::getInstance()->prepare("SELECT CEsUsed from tl_article WHERE id=?")->execute($articleId);
$arrCEsUsed = unserialize($objCEsUsed->CEsUsed);
$arrCEsUsed = array_diff($arrCEsUsed, array($id));	
$data = serialize($arrUsedCEs);
Database::getInstance()->prepare("UPDATE tl_article SET CEsUsed=? WHERE id=?")->execute($data, $articleId);

// for debugging:
// $nrCEsUsed = $objCEsUsed->numRows; 
// echo 'nrCEsUsed: '. $nrCEsUsed;
// echo $arrCEsUsed;
// echo 'arrCEsUsed: ' . implode(", ", $arrCEsUsed);
// $intCEsUsedNr = count($arrCEsUsed);
// echo $intCEsUsedNr;
// echo $intCEsUsedNr;
// echo 'done!';



?>