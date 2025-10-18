<?php
$json = '{"name":"Test User","email":"test@example.com","phone":"+63123456789","password":"password123"}';
$input = json_decode($json, true);

echo "Decoded JSON:\n";
var_dump($input);

echo "\nValidation check:\n";
if (empty($input['name']) || empty($input['email']) ||
    empty($input['phone']) || empty($input['password'])) {
    echo "Validation failed: missing or empty fields\n";
} else {
    echo "Validation passed\n";
}

echo "\nEmail validation:\n";
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email format\n";
} else {
    echo "Valid email format\n";
}
?>
