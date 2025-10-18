<?php
include_once '../config/database.php';
include_once '../models/Relief.php';

class ReliefController {
    private $db;
    private $relief;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->relief = new Relief($this->db);
    }

    public function getReliefRequests() {
        $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
        $stmt = $this->relief->read($user_id);
        $num = $stmt->rowCount();

        $relief_arr = array();
        $relief_arr["records"] = array();

        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $relief_item = array(
                    "id" => $id,
                    "name" => $name,
                    "date" => $date,
                    "zone" => $zone,
                    "familySize" => $family_size,
                    "contact" => $contact,
                    "address" => $address,
                    "submittedAt" => $submitted_at,
                    "status" => $status
                );
                array_push($relief_arr["records"], $relief_item);
            }
        }

        http_response_code(200);
        echo json_encode($relief_arr);
    }

    public function createReliefRequest() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->name) && !empty($data->date) && !empty($data->zone) && 
           !empty($data->familySize) && !empty($data->contact) && !empty($data->address)) {
            
            $this->relief->user_id = isset($data->userId) ? $data->userId : null;
            $this->relief->name = $data->name;
            $this->relief->date = $data->date;
            $this->relief->zone = $data->zone;
            $this->relief->family_size = $data->familySize;
            $this->relief->contact = $data->contact;
            $this->relief->address = $data->address;

            if($this->relief->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Relief request was created successfully.",
                    "id" => $this->relief->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create relief request."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create relief request. Data is incomplete."));
        }
    }
}
?>
