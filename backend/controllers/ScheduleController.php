<?php
include_once '../config/database.php';
include_once '../models/Schedule.php';

class ScheduleController {
    private $db;
    private $schedule;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->schedule = new Schedule($this->db);
    }

    public function getSchedules() {
        $stmt = $this->schedule->read();
        $num = $stmt->rowCount();

        if($num > 0) {
            $schedules_arr = array();
            $schedules_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $schedule_item = array(
                    "id" => $id,
                    "type" => $type,
                    "title" => $title,
                    "description" => $description,
                    "date" => $date,
                    "time" => $time,
                    "location" => $location,
                    "timestamp" => $timestamp
                );
                array_push($schedules_arr["records"], $schedule_item);
            }

            http_response_code(200);
            echo json_encode($schedules_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No schedules found."));
        }
    }

    public function createSchedule() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->type) && !empty($data->title) && !empty($data->description) && !empty($data->date) && !empty($data->time)) {
            $this->schedule->type = $data->type;
            $this->schedule->title = $data->title;
            $this->schedule->description = $data->description;
            $this->schedule->date = $data->date;
            $this->schedule->time = $data->time;
            $this->schedule->location = isset($data->location) ? $data->location : null;
            $this->schedule->timestamp = isset($data->timestamp) ? $data->timestamp : date('c');

            if($this->schedule->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Schedule was created.",
                    "id" => $this->schedule->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create schedule."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create schedule. Data is incomplete."));
        }
    }

    public function getSchedule($id) {
        $this->schedule->id = $id;

        if($this->schedule->readOne()) {
            $schedule_arr = array(
                "id" => $this->schedule->id,
                "type" => $this->schedule->type,
                "title" => $this->schedule->title,
                "description" => $this->schedule->description,
                "date" => $this->schedule->date,
                "time" => $this->schedule->time,
                "location" => $this->schedule->location,
                "timestamp" => $this->schedule->timestamp
            );

            http_response_code(200);
            echo json_encode($schedule_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Schedule not found."));
        }
    }
}
?>
