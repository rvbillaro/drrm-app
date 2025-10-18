<?php
include_once '../config/database.php';
include_once '../models/Hotline.php';

class HotlineController {
    private $db;
    private $hotline;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->hotline = new Hotline($this->db);
    }

    public function getHotlines() {
        $stmt = $this->hotline->read();
        $num = $stmt->rowCount();

        if($num > 0) {
            $hotlines_arr = array();
            $hotlines_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $hotline_item = array(
                    "id" => $id,
                    "name" => $name,
                    "number" => $number,
                    "category" => $category,
                    "description" => $description
                );
                array_push($hotlines_arr["records"], $hotline_item);
            }

            http_response_code(200);
            echo json_encode($hotlines_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No hotlines found."));
        }
    }

    public function getHotline($id) {
        $this->hotline->id = $id;

        if($this->hotline->readOne()) {
            $hotline_arr = array(
                "id" => $this->hotline->id,
                "name" => $this->hotline->name,
                "number" => $this->hotline->number,
                "category" => $this->hotline->category,
                "description" => $this->hotline->description
            );

            http_response_code(200);
            echo json_encode($hotline_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Hotline not found."));
        }
    }
}
?>
