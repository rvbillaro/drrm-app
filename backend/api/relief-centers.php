<?php
include_once '../controllers/ReliefCenterController.php';

$reliefCenterController = new ReliefCenterController();

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $reliefCenterController->getReliefCenter($_GET['id']);
        } else {
            $reliefCenterController->getReliefCenters();
        }
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
