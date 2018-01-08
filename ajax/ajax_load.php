<?php 



$articleId = $_POST['articleId'];








define('TL_MODE', 'FE');

$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);
// echo $path;



$objResult = Database::getInstance()->prepare("SELECT grixJs from tl_article WHERE id=?")->execute($articleId);
// echo $objResult->numRows;
echo $objResult->grixJs;


?>