<?php
class ReliefRequestController {
    private $conn;
    private $request_method;
    private $request_id;

    public function __construct($db, $request_method, $request_id = null) {
        $this->conn = $db;
        $this->request_method = $request_method;
        $this->request_id = $request_id;
    }

    public function processRequest() {
        switch ($this->request_method) {
            case 'GET':
                if ($this->request_id) {
                    $response = $this->getReliefRequest($this->request_id);
                } else {
                    $response = $this->getReliefRequests();
                }
                break;
            case 'POST':
                $response = $this->createReliefRequest();
                break;
            case 'PUT':
                $response = $this->updateReliefRequest($this->request_id);
                break;
            case 'DELETE':
                $response = $this->deleteReliefRequest($this->request_id);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function getReliefRequests() {
        $relief_request = new ReliefRequest($this->conn);
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
        $stmt = $relief_request->read($limit);
        $num = $stmt->rowCount();

        if($num > 0) {
            $relief_requests_arr = array();
            $relief_requests_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);

                $relief_request_item = array(
                    "id" => $id,
                    "name" => $name,
                    "date" => $date,
                    "zone" => $zone,
                    "familySize" => (int)$family_size,
                    "contact" => $contact,
                    "address" => $address,
                    "submittedAt" => $submitted_at,
                    "status" => $status
                );

                array_push($relief_requests_arr["records"], $relief_request_item);
            }

            http_response_code(200);
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode($relief_requests_arr)
            );
        } else {
            http_response_code(200);
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode(array("records" => array()))
            );
        }
    }

    private function getReliefRequest($id) {
        $relief_request = new ReliefRequest($this->conn);
        $relief_request->id = $id;

        if($relief_request->readOne()) {
            $relief_request_arr = array(
                "id" => $relief_request->id,
                "name" => $relief_request->name,
                "date" => $relief_request->date,
                "zone" => $relief_request->zone,
                "familySize" => (int)$relief_request->family_size,
                "contact" => $relief_request->contact,
                "address" => $relief_request->address,
                "submittedAt" => $relief_request->submitted_at,
                "status" => $relief_request->status
            );

            http_response_code(200);
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode($relief_request_arr)
            );
        } else {
            return $this->notFoundResponse();
        }
    }

    private function createReliefRequest() {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);

        if (!$this->validateReliefRequestInput($input)) {
            return $this->unprocessableEntityResponse();
        }

        $relief_request = new ReliefRequest($this->conn);

        $relief_request->name = $input['name'];
        $relief_request->date = $input['date'];
        $relief_request->zone = $input['zone'];
        $relief_request->family_size = $input['familySize'];
        $relief_request->contact = $input['contact'];
        $relief_request->address = $input['address'];
        $relief_request->status = 'submitted';

        if($relief_request->create()) {
            http_response_code(201);
            return array(
                "status_code_header" => "HTTP/1.1 201 Created",
                "body" => json_encode(array(
                    "id" => $relief_request->id,
                    "message" => "Relief request created successfully."
                ))
            );
        } else {
            return $this->unprocessableEntityResponse();
        }
    }

    private function updateReliefRequest($id) {
        $relief_request = new ReliefRequest($this->conn);
        $relief_request->id = $id;

        if(!$relief_request->readOne()) {
            return $this->notFoundResponse();
        }

        $input = (array) json_decode(file_get_contents('php://input'), TRUE);

        if (!isset($input['status'])) {
            return $this->unprocessableEntityResponse();
        }

        $relief_request->status = $input['status'];

        if($relief_request->update()) {
            http_response_code(200);
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode(array("message" => "Relief request updated successfully."))
            );
        } else {
            return $this->unprocessableEntityResponse();
        }
    }

    private function deleteReliefRequest($id) {
        $relief_request = new ReliefRequest($this->conn);
        $relief_request->id = $id;

        if(!$relief_request->readOne()) {
            return $this->notFoundResponse();
        }

        // Note: For now, we'll just return success without actually deleting
        // In a real application, you might want to implement soft deletes
        http_response_code(200);
        return array(
            "status_code_header" => "HTTP/1.1 200 OK",
            "body" => json_encode(array("message" => "Relief request deletion not implemented."))
        );
    }

    private function validateReliefRequestInput($input) {
        return isset($input['name']) && isset($input['date']) && isset($input['zone']) &&
               isset($input['familySize']) && isset($input['contact']) && isset($input['address']);
    }

    private function unprocessableEntityResponse() {
        return array(
            "status_code_header" => "HTTP/1.1 422 Unprocessable Entity",
            "body" => json_encode(array("error" => "Invalid input data."))
        );
    }

    private function notFoundResponse() {
        return array(
            "status_code_header" => "HTTP/1.1 404 Not Found",
            "body" => json_encode(array("error" => "Relief request not found."))
        );
    }
}
?>
