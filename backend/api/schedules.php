<?php
include_once '../controllers/ScheduleController.php';

$scheduleController = new ScheduleController();

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $scheduleController->getSchedule($_GET['id']);
        } else {
            $scheduleController->getSchedules();
        }
        break;

    case 'POST':
        $scheduleController->createSchedule();
        break;

    default:
        // Method not allowed
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
