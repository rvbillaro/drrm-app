<?php
class Alert {
    private $conn;
    private $table_name = "alerts";

    public $id;
    public $type;
    public $title;
    public $message;
    public $time;
    public $location;
    public $timestamp;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($limit = null) {
        $query = "SELECT id, type, title, message, time, location, timestamp
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

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET type=:type, title=:title, message=:message,
                      time=:time, location=:location, timestamp=:timestamp";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->timestamp = htmlspecialchars(strip_tags($this->timestamp));

        // Bind values
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":message", $this->message);
        $stmt->bindParam(":time", $this->time);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":timestamp", $this->timestamp);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function readOne() {
        $query = "SELECT id, type, title, message, time, location, timestamp
                  FROM " . $this->table_name . "
                  WHERE id = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->type = $row['type'];
            $this->title = $row['title'];
            $this->message = $row['message'];
            $this->time = $row['time'];
            $this->location = $row['location'];
            $this->timestamp = $row['timestamp'];
            return true;
        }

        return false;
    }
}
?>
