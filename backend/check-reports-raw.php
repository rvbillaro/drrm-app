<?php
include_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Checking incident_reports table directly:\n\n";

$stmt = $db->query("SELECT id, user_id, incident_type, description, timestamp FROM incident_reports ORDER BY id DESC LIMIT 10");
$reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Total reports: " . count($reports) . "\n\n";

if (count($reports) > 0) {
    foreach ($reports as $report) {
        $user_id = $report['user_id'] ?? 'NULL';
        $desc = substr($report['description'], 0, 40);
        echo "ID: {$report['id']} | User: {$user_id} | Type: {$report['incident_type']} | Desc: {$desc}...\n";
    }
} else {
    echo "No reports found in database.\n";
}

echo "\n✅ Done!\n";
?>
