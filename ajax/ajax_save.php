<?php 



$grixjs = $_POST['grixJs'];
$articleId = $_POST['articleId'];
// echo $grixjs;
define('TL_MODE', 'FE');
// require('../../../../system/initialize.php');

$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);

$objResult = Database::getInstance()->prepare("UPDATE tl_article SET grixJs=? WHERE id=?")->execute($grixjs, $articleId);
echo 'done!';



?>