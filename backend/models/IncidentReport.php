<?php
class IncidentReport {
    private $conn;
    private $table_name = "incident_reports";

    public $id;
    public $incident_type;
    public $description;
    public $location_address;
    public $location_lat;
    public $location_lng;
    public $media_files;
    public $timestamp;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET incident_type=:incident_type, description=:description,
                      location_address=:location_address, location_lat=:location_lat,
                      location_lng=:location_lng, media_files=:media_files,
                      timestamp=:timestamp, status=:status";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->incident_type = htmlspecialchars(strip_tags($this->incident_type));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location_address = htmlspecialchars(strip_tags($this->location_address));
        $this->location_lat = htmlspecialchars(strip_tags($this->location_lat));
        $this->location_lng = htmlspecialchars(strip_tags($this->location_lng));
        $this->media_files = $this->media_files; // JSON string, no sanitization needed
        $this->timestamp = htmlspecialchars(strip_tags($this->timestamp));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind values
        $stmt->bindParam(":incident_type", $this->incident_type);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":location_address", $this->location_address);
        $stmt->bindParam(":location_lat", $this->location_lat);
        $stmt->bindParam(":location_lng", $this->location_lng);
        $stmt->bindParam(":media_files", $this->media_files);
        $stmt->bindParam(":timestamp", $this->timestamp);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function read($limit = null) {
        $query = "SELECT id, incident_type, description, location_address,
                         location_lat, location_lng, media_files, timestamp, status
                  FROM " . $this->table_name . "
                  ORDER BY timestamp DESC";

        if ($limit) {
            $query .= " LIMIT 0, :limit";
        }

        $stmt = $this->conn->prepare($query);

        if ($limit) {
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT id, incident_type, description, location_address,
                         location_lat, location_lng, media_files, timestamp, status
                  FROM " . $this->table_name . "
                  WHERE id = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->incident_type = $row['incident_type'];
            $this->description = $row['description'];
            $this->location_address = $row['location_address'];
            $this->location_lat = $row['location_lat'];
            $this->location_lng = $row['location_lng'];
            $this->media_files = $row['media_files'];
            $this->timestamp = $row['timestamp'];
            $this->status = $row['status'];
            return true;
        }

        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET status = :status
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->status = htmlspecialchars(strip_tags($this->status));

        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>
