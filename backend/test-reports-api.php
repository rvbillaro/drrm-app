<?php
// Simple test to check if reports API is working
include_once __DIR__ . '/config/database.php';
include_once __DIR__ . '/models/IncidentReport.php';

$database = new Database();
$db = $database->getConnection();
$report = new IncidentReport($db);

echo "Testing IncidentReport model...\n\n";

// Test read all
$stmt = $report->read();
$count = $stmt->rowCount();
echo "Total reports in database: $count\n\n";

if ($count > 0) {
    echo "Reports:\n";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $user_id = $row['user_id'] ?? 'NULL';
        echo "- ID: {$row['id']}, Type: {$row['incident_type']}, User ID: {$user_id}, Desc: " . substr($row['description'], 0, 30) . "...\n";
    }
} else {
    echo "No reports found.\n";
}

// Test with specific user_id
echo "\n--- Testing with user_id=9 ---\n";
$stmt2 = $report->read(null, 9);
$count2 = $stmt2->rowCount();
echo "Reports for user_id=9: $count2\n";

if ($count2 > 0) {
    while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
        echo "- ID: {$row['id']}, Type: {$row['incident_type']}\n";
    }
}

echo "\n✅ Test complete!\n";
?>
