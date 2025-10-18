<?php
// DRRM Backend API Index
// This file serves as the main entry point for the API

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode(array(
    "message" => "DRRM Backend API",
    "version" => "1.0.0",
    "endpoints" => array(
        "alerts" => "/api/alerts.php",
        "reports" => "/api/reports.php",
        "schedules" => "/api/schedules.php",
        "relief-centers" => "/api/relief-centers.php",
        "hotlines" => "/api/hotlines.php"
    ),
    "status" => "running"
));
?>
