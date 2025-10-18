<?php
include_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Checking relief_requests table schema:\n\n";

$stmt = $db->query("DESCRIBE relief_requests");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($columns as $col) {
    echo "{$col['Field']}: {$col['Type']} - Null: {$col['Null']}\n";
}
?>
