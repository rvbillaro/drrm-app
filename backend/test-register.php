<?php
require_once 'config/database.php';
require_once 'models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Test data
$user->name = "Test User";
$user->email = "test@example.com";
$user->phone = "+63123456789";
$user->password_hash = password_hash("password123", PASSWORD_DEFAULT);

echo "Attempting to create user...\n";

if($user->create()) {
    echo "User created successfully with ID: " . $user->id . "\n";
} else {
    echo "Failed to create user\n";
}

// Check if email exists
$user2 = new User($db);
$user2->email = "test@example.com";
if($user2->emailExists()) {
    echo "Email exists check: PASSED\n";
} else {
    echo "Email exists check: FAILED\n";
}

// Test login
$user3 = new User($db);
$user3->email = "test@example.com";
$user3->password_hash = "password123"; // Plain password

if($user3->login()) {
    echo "Login successful for user: " . $user3->name . "\n";
} else {
    echo "Login failed\n";
}
?>
