<?php
class Relief {
    private $conn;
    private $table_name = "relief_requests";

    public $id;
    public $user_id;
    public $name;
    public $date;
    public $zone;
    public $family_size;
    public $contact;
    public $address;
    public $submitted_at;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET user_id=:user_id, name=:name, date=:date, zone=:zone,
                      family_size=:family_size, contact=:contact,
                      address=:address";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->user_id = $this->user_id ? htmlspecialchars(strip_tags($this->user_id)) : null;
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->date = htmlspecialchars(strip_tags($this->date));
        $this->zone = htmlspecialchars(strip_tags($this->zone));
        $this->family_size = htmlspecialchars(strip_tags($this->family_size));
        $this->contact = htmlspecialchars(strip_tags($this->contact));
        $this->address = htmlspecialchars(strip_tags($this->address));

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":zone", $this->zone);
        $stmt->bindParam(":family_size", $this->family_size);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->bindParam(":address", $this->address);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function read($user_id = null) {
        $query = "SELECT * FROM " . $this->table_name;
        
        if ($user_id) {
            $query .= " WHERE user_id = :user_id";
        }
        
        $query .= " ORDER BY submitted_at DESC";

        $stmt = $this->conn->prepare($query);
        
        if ($user_id) {
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        }
        
        $stmt->execute();

        return $stmt;
    }

    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . "
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
}
?>
