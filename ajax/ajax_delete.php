<?php 



$id = $_GET['id'];  


define('TL_MODE', 'FE');

$path = dirname(dirname($_SERVER['SCRIPT_FILENAME']));
$path = substr($path, 0, -15) . 'initialize.php';
require($path);




$objResult = Database::getInstance()->prepare("DELETE FROM tl_content WHERE id=?")->execute($id);
echo 'done!';



?>