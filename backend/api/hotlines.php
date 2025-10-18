<?php
include_once '../controllers/HotlineController.php';

$hotlineController = new HotlineController();

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $hotlineController->getHotline($_GET['id']);
        } else {
            $hotlineController->getHotlines();
        }
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
