<?php
class ReliefRequest {
    private $conn;
    private $table_name = "relief_requests";

    public $id;
    public $name;
    public $date;
    public $zone;
    public $family_size;
    public $contact;
    public $address;
    public $submitted_at;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET name=:name, date=:date, zone=:zone, family_size=:family_size,
                      contact=:contact, address=:address, status=:status";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->zone = htmlspecialchars(strip_tags($this->zone));
        $this->family_size = htmlspecialchars(strip_tags($this->family_size));
        $this->contact = htmlspecialchars(strip_tags($this->contact));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":zone", $this->zone);
        $stmt->bindParam(":family_size", $this->family_size);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function read($limit = null) {
        $query = "SELECT id, name, date, zone, family_size, contact, address, submitted_at, status
                  FROM " . $this->table_name . "
                  ORDER BY submitted_at DESC";

        if($limit) {
            $query .= " LIMIT 0, " . $limit;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function readOne() {
        $query = "SELECT id, name, date, zone, family_size, contact, address, submitted_at, status
                  FROM " . $this->table_name . "
                  WHERE id = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->date = $row['date'];
            $this->zone = $row['zone'];
            $this->family_size = $row['family_size'];
            $this->contact = $row['contact'];
            $this->address = $row['address'];
            $this->submitted_at = $row['submitted_at'];
            $this->status = $row['status'];
            return true;
        }

        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET status = :status, updated_at = CURRENT_TIMESTAMP
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
