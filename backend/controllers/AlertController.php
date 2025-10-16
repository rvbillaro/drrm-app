<?php
include_once '../config/database.php';
include_once '../models/Alert.php';

class AlertController {
    private $db;
    private $alert;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->alert = new Alert($this->db);
    }

    public function getAlerts() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

        $stmt = $this->alert->read($limit);
        $num = $stmt->rowCount();

        if($num > 0) {
            $alerts_arr = array();
            $alerts_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $alert_item = array(
                    "id" => $id,
                    "type" => $type,
                    "title" => $title,
                    "message" => $message,
                    "time" => $time,
                    "location" => $location,
                    "timestamp" => $timestamp
                );
                array_push($alerts_arr["records"], $alert_item);
            }

            http_response_code(200);
            echo json_encode($alerts_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No alerts found."));
        }
    }

    public function createAlert() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->type) && !empty($data->title) && !empty($data->message)) {
            $this->alert->type = $data->type;
            $this->alert->title = $data->title;
            $this->alert->message = $data->message;
            $this->alert->time = isset($data->time) ? $data->time : date('H:i');
            $this->alert->location = isset($data->location) ? $data->location : null;
            $this->alert->timestamp = isset($data->timestamp) ? $data->timestamp : date('c');

            if($this->alert->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Alert was created.",
                    "id" => $this->alert->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create alert."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create alert. Data is incomplete."));
        }
    }

    public function getAlert($id) {
        $this->alert->id = $id;

        if($this->alert->readOne()) {
            $alert_arr = array(
                "id" => $this->alert->id,
                "type" => $this->alert->type,
                "title" => $this->alert->title,
                "message" => $this->alert->message,
                "time" => $this->alert->time,
                "location" => $this->alert->location,
                "timestamp" => $this->alert->timestamp
            );

            http_response_code(200);
            echo json_encode($alert_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Alert not found."));
        }
    }
}
?>
