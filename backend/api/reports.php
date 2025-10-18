<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../controllers/IncidentReportController.php';

$reportController = new IncidentReportController();

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $reportController->getReport($_GET['id']);
        } else {
            $reportController->getReports();
        }
        break;

    case 'POST':
        $reportController->createReport();
        break;

    case 'PUT':
        if(isset($_GET['id'])) {
            $reportController->updateReportStatus($_GET['id']);
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Report ID is required for status update."));
        }
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
