<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $email_verified;
    public $phone;
    public $phone_verified;
    public $password_hash;
    public $email_verification_code;
    public $phone_verification_code;
    public $verification_code_expires_at;
    public $full_address;
    public $barangay;
    public $city;
    public $zone;
    public $latitude;
    public $longitude;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function phoneExists() {
        $query = "SELECT id FROM " . $this->table_name . "
                  WHERE phone = :phone
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET name=:name, email=:email, phone=:phone,
                      password_hash=:password_hash";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->password_hash = $this->password_hash; // Already hashed

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":password_hash", $this->password_hash);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function emailExists() {
        $query = "SELECT id, name, email, phone, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE email = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return true;
        }

        return false;
    }

    public function login() {
        $query = "SELECT id, name, email, email_verified, phone, phone_verified, password_hash, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE email = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(password_verify($this->password_hash, $row['password_hash'])) {
                $this->id = $row['id'];
                $this->name = $row['name'];
                $this->email = $row['email'];
                $this->email_verified = $row['email_verified'];
                $this->phone = $row['phone'];
                $this->phone_verified = $row['phone_verified'];
                $this->created_at = $row['created_at'];
                $this->updated_at = $row['updated_at'];
                return true;
            }
        }

        return false;
    }

    public function readOne() {
        $query = "SELECT id, name, email, phone, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE id = ?
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name = :name, phone = :phone, updated_at = CURRENT_TIMESTAMP
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }
    
    public function updateAddress() {
        $query = "UPDATE " . $this->table_name . "
                  SET full_address = :full_address, 
                      barangay = :barangay,
                      city = :city,
                      zone = :zone,
                      latitude = :latitude,
                      longitude = :longitude,
                      updated_at = CURRENT_TIMESTAMP
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->full_address = htmlspecialchars(strip_tags($this->full_address));
        $this->barangay = htmlspecialchars(strip_tags($this->barangay));
        $this->city = htmlspecialchars(strip_tags($this->city));

        // Bind values
        $stmt->bindParam(':full_address', $this->full_address);
        $stmt->bindParam(':barangay', $this->barangay);
        $stmt->bindParam(':city', $this->city);
        $stmt->bindParam(':zone', $this->zone);
        $stmt->bindParam(':latitude', $this->latitude);
        $stmt->bindParam(':longitude', $this->longitude);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }
    
    public function saveVerificationCode($type = 'email') {
        $field = $type === 'email' ? 'email_verification_code' : 'phone_verification_code';
        $code = $type === 'email' ? $this->email_verification_code : $this->phone_verification_code;
        
        $query = "UPDATE " . $this->table_name . "
                  SET $field = :code,
                      verification_code_expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':code', $code);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }
    
    public function verifyCode($code, $type = 'email') {
        $field = $type === 'email' ? 'email_verification_code' : 'phone_verification_code';
        $verifiedField = $type === 'email' ? 'email_verified' : 'phone_verified';
        
        $query = "SELECT id FROM " . $this->table_name . "
                  WHERE id = :id 
                  AND $field = :code
                  AND verification_code_expires_at > NOW()
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':code', $code);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            // Code is valid, mark as verified
            $updateQuery = "UPDATE " . $this->table_name . "
                           SET $verifiedField = TRUE,
                               $field = NULL,
                               verification_code_expires_at = NULL
                           WHERE id = :id";
            
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(':id', $this->id);
            return $updateStmt->execute();
        }
        
        return false;
    }
}
?>
