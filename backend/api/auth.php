<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../models/User.php';
require_once '../controllers/AuthController.php';

$database = new Database();
$db = $database->getConnection();

// Get action from URL parameter
$action = isset($_GET['action']) ? $_GET['action'] : null;

$request_method = $_SERVER["REQUEST_METHOD"];

$controller = new AuthController($db, $request_method, $action);
$controller->processRequest();
?>
