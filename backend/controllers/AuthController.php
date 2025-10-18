<?php
require_once __DIR__ . '/../utils/RateLimiter.php';
require_once __DIR__ . '/../services/EmailService.php';

class AuthController {
    private $conn;
    private $request_method;
    private $action;
    private $rateLimiter;

    public function __construct($db, $request_method, $action = null) {
        $this->conn = $db;
        $this->request_method = $request_method;
        $this->action = $action;
        // 5 attempts per 5 minutes (300 seconds)
        $this->rateLimiter = new RateLimiter(5, 300);
    }

    public function processRequest() {
        switch ($this->request_method) {
            case 'POST':
                if ($this->action === 'register') {
                    $response = $this->register();
                } elseif ($this->action === 'login') {
                    $response = $this->login();
                } elseif ($this->action === 'update-address') {
                    $response = $this->updateAddress();
                } elseif ($this->action === 'send-verification') {
                    $response = $this->sendVerificationCode();
                } elseif ($this->action === 'verify-code') {
                    $response = $this->verifyCode();
                } else {
                    $response = $this->notFoundResponse();
                }
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

    private function register() {
        // Rate limiting by IP address
        $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        
        if (!$this->rateLimiter->isAllowed($clientIp)) {
            $retryAfter = $this->rateLimiter->getRetryAfter($clientIp);
            return array(
                "status_code_header" => "HTTP/1.1 429 Too Many Requests",
                "body" => json_encode(array(
                    "error" => "Too many registration attempts. Please try again in " . ceil($retryAfter / 60) . " minutes."
                ))
            );
        }
        
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);

        if (!$this->validateRegisterInput($input)) {
            return $this->unprocessableEntityResponse();
        }

        $user = new User($this->conn);

        // Check if email already exists
        $user->email = $input['email'];
        if ($user->emailExists()) {
            return array(
                "status_code_header" => "HTTP/1.1 409 Conflict",
                "body" => json_encode(array("error" => "Email already exists."))
            );
        }

        // Check if phone already exists
        $user->phone = $input['phone'];
        if ($user->phoneExists()) {
            return array(
                "status_code_header" => "HTTP/1.1 409 Conflict",
                "body" => json_encode(array("error" => "Phone number already exists."))
            );
        }

        $user->name = $input['name'];
        $user->email = $input['email'];
        $user->phone = $input['phone'];
        $user->password_hash = password_hash($input['password'], PASSWORD_DEFAULT);

        if($user->create()) {
            // Reset rate limit on successful registration
            $this->rateLimiter->reset($clientIp);
            
            http_response_code(201);
            return array(
                "status_code_header" => "HTTP/1.1 201 Created",
                "body" => json_encode(array(
                    "id" => $user->id,
                    "message" => "User registered successfully.",
                    "user" => array(
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "phone" => $user->phone
                    )
                ))
            );
        } else {
            // Record failed attempt
            $this->rateLimiter->recordAttempt($clientIp);
            return $this->unprocessableEntityResponse();
        }
    }

    private function login() {
        // Rate limiting by IP address
        $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        
        if (!$this->rateLimiter->isAllowed($clientIp)) {
            $retryAfter = $this->rateLimiter->getRetryAfter($clientIp);
            return array(
                "status_code_header" => "HTTP/1.1 429 Too Many Requests",
                "body" => json_encode(array(
                    "error" => "Too many login attempts. Please try again in " . ceil($retryAfter / 60) . " minutes."
                ))
            );
        }
        
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);

        if (!$this->validateLoginInput($input)) {
            return $this->unprocessableEntityResponse();
        }

        $user = new User($this->conn);
        $user->email = $input['email'];
        $user->password_hash = $input['password']; // Plain password for verification

        if($user->login()) {
            // Reset rate limit on successful login
            $this->rateLimiter->reset($clientIp);
            
            http_response_code(200);
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode(array(
                    "message" => "Login successful.",
                    "user" => array(
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "emailVerified" => (bool)$user->email_verified,
                        "phone" => $user->phone,
                        "phoneVerified" => (bool)$user->phone_verified
                    )
                ))
            );
        } else {
            // Record failed attempt
            $this->rateLimiter->recordAttempt($clientIp);
            
            return array(
                "status_code_header" => "HTTP/1.1 401 Unauthorized",
                "body" => json_encode(array("error" => "Invalid email or password."))
            );
        }
    }

    private function validateRegisterInput($input) {
        // Debug log
        error_log("Validation input: " . print_r($input, true));
        
        // Check if all required fields exist AND are not empty
        if (empty($input['name']) || empty($input['email']) || 
            empty($input['phone']) || empty($input['password'])) {
            error_log("Validation failed: missing or empty fields");
            return false;
        }
        
        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            error_log("Validation failed: invalid email format");
            return false;
        }
        
        // Validate password strength
        if (!$this->validatePasswordStrength($input['password'])) {
            error_log("Validation failed: weak password");
            return false;
        }
        
        error_log("Validation passed");
        return true;
    }
    
    private function validatePasswordStrength($password) {
        // Minimum 8 characters
        if (strlen($password) < 8) {
            return false;
        }
        
        // At least one uppercase letter
        if (!preg_match('/[A-Z]/', $password)) {
            return false;
        }
        
        // At least one lowercase letter
        if (!preg_match('/[a-z]/', $password)) {
            return false;
        }
        
        // At least one number
        if (!preg_match('/[0-9]/', $password)) {
            return false;
        }
        
        // At least one special character
        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            return false;
        }
        
        return true;
    }

    private function validateLoginInput($input) {
        return isset($input['email']) && isset($input['password']) &&
               filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    }

    private function unprocessableEntityResponse() {
        return array(
            "status_code_header" => "HTTP/1.1 422 Unprocessable Entity",
            "body" => json_encode(array("error" => "Invalid input data."))
        );
    }

    private function updateAddress() {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);

        // Validate required fields
        if (empty($input['user_id']) || empty($input['fullAddress']) || empty($input['city']) || empty($input['zone'])) {
            return array(
                "status_code_header" => "HTTP/1.1 422 Unprocessable Entity",
                "body" => json_encode(array("error" => "Missing required fields: user_id, fullAddress, city, zone"))
            );
        }

        $user = new User($this->conn);
        $user->id = $input['user_id'];
        $user->full_address = $input['fullAddress'];
        $user->barangay = $input['barangay'] ?? '';
        $user->city = $input['city'];
        $user->zone = $input['zone'];
        $user->latitude = $input['latitude'] ?? 0;
        $user->longitude = $input['longitude'] ?? 0;

        if($user->updateAddress()) {
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode(array(
                    "message" => "Address updated successfully.",
                    "user_id" => $user->id
                ))
            );
        } else {
            return array(
                "status_code_header" => "HTTP/1.1 500 Internal Server Error",
                "body" => json_encode(array("error" => "Failed to update address."))
            );
        }
    }

    private function sendVerificationCode() {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        
        if (empty($input['user_id']) || empty($input['type'])) {
            return array(
                "status_code_header" => "HTTP/1.1 422 Unprocessable Entity",
                "body" => json_encode(array("error" => "Missing required fields: user_id, type"))
            );
        }
        
        $user = new User($this->conn);
        $user->id = $input['user_id'];
        
        // Generate 6-digit code
        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $type = $input['type']; // 'email' or 'phone'
        
        if ($type === 'email') {
            $user->email_verification_code = $code;
        } else {
            $user->phone_verification_code = $code;
        }
        
        if ($user->saveVerificationCode($type)) {
            // Send the code
            $emailService = new EmailService();
            
            if ($type === 'email') {
                $emailService->sendVerificationCode($input['email'], $code, $input['name'] ?? 'User');
            } else {
                $emailService->sendPhoneVerificationCode($input['phone'], $code, $input['name'] ?? 'User');
            }
            
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode(array(
                    "message" => "Verification code sent successfully.",
                    "type" => $type,
                    // DEVELOPMENT ONLY: Include code in response for testing
                    "dev_code" => $code
                ))
            );
        } else {
            return array(
                "status_code_header" => "HTTP/1.1 500 Internal Server Error",
                "body" => json_encode(array("error" => "Failed to generate verification code."))
            );
        }
    }
    
    private function verifyCode() {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        
        if (empty($input['user_id']) || empty($input['code']) || empty($input['type'])) {
            return array(
                "status_code_header" => "HTTP/1.1 422 Unprocessable Entity",
                "body" => json_encode(array("error" => "Missing required fields: user_id, code, type"))
            );
        }
        
        $user = new User($this->conn);
        $user->id = $input['user_id'];
        $code = $input['code'];
        $type = $input['type']; // 'email' or 'phone'
        
        if ($user->verifyCode($code, $type)) {
            return array(
                "status_code_header" => "HTTP/1.1 200 OK",
                "body" => json_encode(array(
                    "message" => ucfirst($type) . " verified successfully.",
                    "type" => $type
                ))
            );
        } else {
            return array(
                "status_code_header" => "HTTP/1.1 400 Bad Request",
                "body" => json_encode(array("error" => "Invalid or expired verification code."))
            );
        }
    }

    private function notFoundResponse() {
        return array(
            "status_code_header" => "HTTP/1.1 404 Not Found",
            "body" => json_encode(array("error" => "Endpoint not found."))
        );
    }
}
?>
