<?php
include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../models/IncidentReport.php';

class IncidentReportController {
    private $db;
    private $report;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->report = new IncidentReport($this->db);
    }

    public function createReport() {
        $data = json_decode(file_get_contents("php://input"));
        
        // Log received data for debugging
        error_log("Received report data: " . json_encode($data));

        if(!empty($data->incidentType) && !empty($data->description) && !empty($data->location)) {
            $this->report->user_id = isset($data->userId) ? $data->userId : null;
            $this->report->incident_type = $data->incidentType;
            $this->report->description = $data->description;
            $this->report->location_address = $data->location->address;
            $this->report->location_lat = $data->location->latitude;
            $this->report->location_lng = $data->location->longitude;
            $this->report->media_files = isset($data->mediaFiles) ? json_encode($data->mediaFiles) : json_encode([]);
            // Convert ISO 8601 timestamp to MySQL datetime format
            if (isset($data->timestamp)) {
                $dt = new DateTime($data->timestamp);
                $this->report->timestamp = $dt->format('Y-m-d H:i:s');
            } else {
                $this->report->timestamp = date('Y-m-d H:i:s');
            }
            $this->report->status = 'pending';
            
            error_log("About to create report with user_id: " . ($this->report->user_id ?? 'NULL'));

            if($this->report->create()) {
                error_log("Report created successfully with ID: " . $this->report->id);
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Incident report was created.",
                    "id" => $this->report->id
                ));
            } else {
                error_log("Report creation FAILED");
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create incident report."));
            }
        } else {
            error_log("Incomplete data received");
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create incident report. Data is incomplete."));
        }
    }

    public function getReports() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
        $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

        $stmt = $this->report->read($limit, $user_id);
        $num = $stmt->rowCount();

        $reports_arr = array();
        $reports_arr["records"] = array();

        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $report_item = array(
                    "id" => $id,
                    "incidentType" => $incident_type,
                    "description" => $description,
                    "location" => array(
                        "address" => $location_address,
                        "latitude" => floatval($location_lat),
                        "longitude" => floatval($location_lng)
                    ),
                    "mediaFiles" => json_decode($media_files),
                    "timestamp" => $timestamp,
                    "status" => $status
                );
                array_push($reports_arr["records"], $report_item);
            }
        }

        http_response_code(200);
        echo json_encode($reports_arr);
    }

    public function getReport($id) {
        $this->report->id = $id;

        if($this->report->readOne()) {
            $report_arr = array(
                "id" => $this->report->id,
                "incidentType" => $this->report->incident_type,
                "description" => $this->report->description,
                "location" => array(
                    "address" => $this->report->location_address,
                    "latitude" => floatval($this->report->location_lat),
                    "longitude" => floatval($this->report->location_lng)
                ),
                "mediaFiles" => json_decode($this->report->media_files),
                "timestamp" => $this->report->timestamp,
                "status" => $this->report->status
            );

            http_response_code(200);
            echo json_encode($report_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Incident report not found."));
        }
    }

    public function updateReportStatus($id) {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->status)) {
            $this->report->id = $id;
            $this->report->status = $data->status;

            if($this->report->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Incident report status was updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update incident report status."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to update status. Status is required."));
        }
    }
}
?>
