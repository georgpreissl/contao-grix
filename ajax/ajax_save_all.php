<?php 



$articleId = $_POST['articleId'];
$grixJs = $_POST['grixJs'];
$grixHtmlFrontend = $_POST['grixHtmlFrontend'];

define('TL_MODE', 'FE');

$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);



Database::getInstance()->prepare("UPDATE tl_article SET grixHtmlFrontend=? WHERE id=?")->execute($grixHtmlFrontend, $articleId);

$objResult = Database::getInstance()->prepare("UPDATE tl_article SET grixJs=? WHERE id=?")->execute($grixJs, $articleId);
echo $objResult->affectedRows;
// echo 'done!';



?>