<?php
// Test using the IncidentReport model
include_once __DIR__ . '/config/database.php';
include_once __DIR__ . '/models/IncidentReport.php';

$database = new Database();
$db = $database->getConnection();
$report = new IncidentReport($db);

echo "Testing IncidentReport->create() with user_id=11...\n\n";

$report->user_id = 11;
$report->incident_type = "fire";
$report->description = "Test from PHP script";
$report->location_address = "Test Address";
$report->location_lat = 14.5;
$report->location_lng = 121.0;
$report->media_files = json_encode([]);
$report->timestamp = date('Y-m-d H:i:s');
$report->status = 'pending';

$result = $report->create();

if ($result) {
    echo "✅ create() returned TRUE\n";
    echo "Report ID: " . $report->id . "\n";
} else {
    echo "❌ create() returned FALSE\n";
}

// Check database
$stmt = $db->query("SELECT COUNT(*) as count FROM incident_reports");
$count = $stmt->fetch(PDO::FETCH_ASSOC);
echo "\nTotal reports in database: " . $count['count'] . "\n";
?>
