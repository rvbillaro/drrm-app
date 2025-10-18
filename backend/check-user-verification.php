<?php
include_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Checking user verification status...\n\n";

$stmt = $db->query("SELECT id, name, email, email_verified, phone, phone_verified FROM users ORDER BY id DESC LIMIT 5");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($users as $user) {
    $emailStatus = $user['email_verified'] ? '✅ Verified' : '❌ Not Verified';
    $phoneStatus = $user['phone_verified'] ? '✅ Verified' : '❌ Not Verified';
    
    echo "User ID: {$user['id']}\n";
    echo "Name: {$user['name']}\n";
    echo "Email: {$user['email']} - {$emailStatus}\n";
    echo "Phone: {$user['phone']} - {$phoneStatus}\n";
    echo "---\n\n";
}
?>
