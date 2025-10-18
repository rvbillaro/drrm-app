<?php
$logFile = '/var/log/apache2/error.log';

if (file_exists($logFile)) {
    $lines = file($logFile);
    $lastLines = array_slice($lines, -50); // Get last 50 lines
    
    echo "=== Last 50 lines of error.log ===\n\n";
    foreach ($lastLines as $line) {
        echo $line;
    }
} else {
    echo "Error log file not found.\n";
}
?>
