<?php
// debug-auth.php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controllers/AuthController.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the raw POST data
$rawInput = file_get_contents('php://input');

// Debug: Log the raw input
error_log("Raw Input: " . $rawInput);

// Decode JSON input
$input = json_decode($rawInput, true);

// Debug information
$debugInfo = [
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
    'raw_input' => $rawInput,
    'decoded_input' => $input,
    'json_last_error' => json_last_error_msg(),
    'action' => $_GET['action'] ?? 'not set'
];

// Log debug info
error_log("Debug Info: " . print_r($debugInfo, true));

// Get action from query parameter
$action = $_GET['action'] ?? null;

if (!$action) {
    echo json_encode([
        'error' => 'No action specified',
        'debug' => $debugInfo
    ]);
    exit;
}

// Check if JSON was decoded successfully
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'error' => 'Invalid JSON: ' . json_last_error_msg(),
        'debug' => $debugInfo
    ]);
    exit;
}

// Initialize controller
$database = new Database();
$db = $database->getConnection();
$authController = new AuthController($db);

// Handle different actions
try {
    switch ($action) {
        case 'register':
            if (!$input) {
                echo json_encode([
                    'error' => 'No input data received',
                    'debug' => $debugInfo
                ]);
                exit;
            }
            $authController->register($input);
            break;

        case 'login':
            if (!$input) {
                echo json_encode([
                    'error' => 'No input data received',
                    'debug' => $debugInfo
                ]);
                exit;
            }
            $authController->login($input);
            break;

        default:
            echo json_encode([
                'error' => 'Invalid action',
                'debug' => $debugInfo
            ]);
            break;
    }
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'debug' => $debugInfo
    ]);
}
?>