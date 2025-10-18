<?php
// Direct test of inserting a report
include_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Testing direct INSERT into incident_reports...\n\n";

// Try a simple insert
$query = "INSERT INTO incident_reports 
          SET user_id=:user_id, incident_type=:incident_type, description=:description,
              location_address=:location_address, location_lat=:location_lat,
              location_lng=:location_lng, media_files=:media_files,
              timestamp=:timestamp, status=:status";

$stmt = $db->prepare($query);

$user_id = 9;
$incident_type = "test";
$description = "Test report from PHP script";
$location_address = "Test Address";
$location_lat = 14.5;
$location_lng = 121.0;
$media_files = json_encode([]);
$timestamp = date('Y-m-d H:i:s');
$status = 'pending';

$stmt->bindParam(":user_id", $user_id);
$stmt->bindParam(":incident_type", $incident_type);
$stmt->bindParam(":description", $description);
$stmt->bindParam(":location_address", $location_address);
$stmt->bindParam(":location_lat", $location_lat);
$stmt->bindParam(":location_lng", $location_lng);
$stmt->bindParam(":media_files", $media_files);
$stmt->bindParam(":timestamp", $timestamp);
$stmt->bindParam(":status", $status);

if($stmt->execute()) {
    $id = $db->lastInsertId();
    echo "✅ SUCCESS! Report inserted with ID: $id\n";
} else {
    echo "❌ FAILED! Error: " . print_r($stmt->errorInfo(), true) . "\n";
}

// Check if it's in the database
$check = $db->query("SELECT COUNT(*) as count FROM incident_reports");
$result = $check->fetch(PDO::FETCH_ASSOC);
echo "\nTotal reports in database: " . $result['count'] . "\n";
?>
