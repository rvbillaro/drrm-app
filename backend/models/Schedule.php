<?php
class Schedule {
    private $conn;
    private $table_name = "schedules";

    public $id;
    public $type;
    public $title;
    public $description;
    public $date;
    public $time;
    public $location;
    public $timestamp;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT id, type, title, description, date, time, location, timestamp
                  FROM " . $this->table_name . "
                  ORDER BY date ASC, time ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET type=:type, title=:title, description=:description,
                      date=:date, time=:time, location=:location, timestamp=:timestamp";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->timestamp = htmlspecialchars(strip_tags($this->timestamp));

        // Bind values
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":date", $this->date);
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
        $query = "SELECT id, type, title, description, date, time, location, timestamp
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
            $this->description = $row['description'];
            $this->date = $row['date'];
            $this->time = $row['time'];
            $this->location = $row['location'];
            $this->timestamp = $row['timestamp'];
            return true;
        }

        return false;
    }
}
?>
