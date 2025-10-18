<?php
// Test what login returns
include_once __DIR__ . '/config/database.php';
include_once __DIR__ . '/models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Test login for Rebecca
$user->email = 'billaro0208@gmail.com';
$user->password_hash = 'test123'; // This will be used for verification

echo "Testing login response...\n\n";

// Simulate login
$query = "SELECT id, name, email, email_verified, phone, phone_verified, password_hash 
          FROM users 
          WHERE email = :email 
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(':email', $user->email);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "User found:\n";
    echo "ID: {$row['id']}\n";
    echo "Name: {$row['name']}\n";
    echo "Email: {$row['email']}\n";
    echo "Email Verified: " . ($row['email_verified'] ? 'true' : 'false') . "\n";
    echo "Phone: {$row['phone']}\n";
    echo "Phone Verified: " . ($row['phone_verified'] ? 'true' : 'false') . "\n";
    
    echo "\n--- JSON Response (what frontend receives) ---\n";
    $response = array(
        "message" => "Login successful.",
        "user" => array(
            "id" => $row['id'],
            "name" => $row['name'],
            "email" => $row['email'],
            "emailVerified" => (bool)$row['email_verified'],
            "phone" => $row['phone'],
            "phoneVerified" => (bool)$row['phone_verified']
        )
    );
    
    echo json_encode($response, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "User not found.\n";
}
?>
