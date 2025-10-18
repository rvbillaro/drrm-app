<?php
class Hotline {
    private $conn;
    private $table_name = "hotlines";

    public $id;
    public $name;
    public $number;
    public $category;
    public $description;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT id, name, number, category, description
                  FROM " . $this->table_name . "
                  ORDER BY category ASC, name ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT id, name, number, category, description
                  FROM " . $this->table_name . "
                  WHERE id = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->number = $row['number'];
            $this->category = $row['category'];
            $this->description = $row['description'];
            return true;
        }

        return false;
    }
}
?>
