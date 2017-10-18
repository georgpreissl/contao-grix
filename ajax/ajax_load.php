<?php 



$articleId = $_GET['articleId'];






// echo $articleId;


define('TL_MODE', 'FE');
// require('../../../../system/initialize.php');

$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);

$objResult = Database::getInstance()->prepare("SELECT grixJs from tl_article WHERE id=?")->execute($articleId);
echo $objResult->grixJs;



?>