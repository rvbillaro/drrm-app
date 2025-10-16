<?php
include_once '../config/database.php';
include_once '../models/IncidentReport.php';

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

        if(!empty($data->incidentType) && !empty($data->description) && !empty($data->location)) {
            $this->report->incident_type = $data->incidentType;
            $this->report->description = $data->description;
            $this->report->location_address = $data->location->address;
            $this->report->location_lat = $data->location->latitude;
            $this->report->location_lng = $data->location->longitude;
            $this->report->media_files = isset($data->mediaFiles) ? json_encode($data->mediaFiles) : json_encode([]);
            $this->report->timestamp = isset($data->timestamp) ? $data->timestamp : date('c');
            $this->report->status = 'pending';

            if($this->report->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Incident report was created.",
                    "id" => $this->report->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create incident report."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create incident report. Data is incomplete."));
        }
    }

    public function getReports() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

        $stmt = $this->report->read($limit);
        $num = $stmt->rowCount();

        if($num > 0) {
            $reports_arr = array();
            $reports_arr["records"] = array();

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

            http_response_code(200);
            echo json_encode($reports_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No incident reports found."));
        }
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
