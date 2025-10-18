<?php
include_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Checking users table...\n\n";

$stmt = $db->query("SELECT id, name, email FROM users ORDER BY id DESC LIMIT 10");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Total users: " . count($users) . "\n\n";

if (count($users) > 0) {
    echo "Users:\n";
    foreach ($users as $user) {
        echo "- ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}\n";
    }
} else {
    echo "No users found.\n";
}
?>
