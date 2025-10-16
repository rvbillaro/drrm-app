<?php
include_once '../controllers/AlertController.php';

$alertController = new AlertController();

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $alertController->getAlert($_GET['id']);
        } else {
            $alertController->getAlerts();
        }
        break;

    case 'POST':
        $alertController->createAlert();
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
