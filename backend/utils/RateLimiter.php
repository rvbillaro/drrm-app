<?php
/**
 * Simple rate limiter to prevent brute force attacks
 * Tracks requests by IP address
 */
class RateLimiter {
    private $maxAttempts;
    private $timeWindow; // in seconds
    private $storageFile;
    
    public function __construct($maxAttempts = 5, $timeWindow = 300) {
        $this->maxAttempts = $maxAttempts;
        $this->timeWindow = $timeWindow; // 5 minutes default
        $this->storageFile = sys_get_temp_dir() . '/rate_limit_' . md5(__FILE__) . '.json';
    }
    
    /**
     * Check if the request should be allowed
     * @param string $identifier - Usually IP address or email
     * @return bool
     */
    public function isAllowed($identifier) {
        $attempts = $this->getAttempts($identifier);
        
        // Clean old attempts
        $attempts = array_filter($attempts, function($timestamp) {
            return (time() - $timestamp) < $this->timeWindow;
        });
        
        return count($attempts) < $this->maxAttempts;
    }
    
    /**
     * Record an attempt
     * @param string $identifier
     */
    public function recordAttempt($identifier) {
        $attempts = $this->getAttempts($identifier);
        $attempts[] = time();
        
        // Clean old attempts before saving
        $attempts = array_filter($attempts, function($timestamp) {
            return (time() - $timestamp) < $this->timeWindow;
        });
        
        $this->saveAttempts($identifier, $attempts);
    }
    
    /**
     * Get remaining time until next attempt is allowed
     * @param string $identifier
     * @return int seconds
     */
    public function getRetryAfter($identifier) {
        $attempts = $this->getAttempts($identifier);
        
        if (empty($attempts)) {
            return 0;
        }
        
        // Get the oldest attempt within the time window
        $oldestAttempt = min($attempts);
        $timePassed = time() - $oldestAttempt;
        
        if ($timePassed >= $this->timeWindow) {
            return 0;
        }
        
        return $this->timeWindow - $timePassed;
    }
    
    /**
     * Reset attempts for an identifier
     * @param string $identifier
     */
    public function reset($identifier) {
        $this->saveAttempts($identifier, []);
    }
    
    private function getAttempts($identifier) {
        if (!file_exists($this->storageFile)) {
            return [];
        }
        
        $data = json_decode(file_get_contents($this->storageFile), true);
        return $data[$identifier] ?? [];
    }
    
    private function saveAttempts($identifier, $attempts) {
        $data = [];
        if (file_exists($this->storageFile)) {
            $data = json_decode(file_get_contents($this->storageFile), true) ?? [];
        }
        
        $data[$identifier] = array_values($attempts);
        file_put_contents($this->storageFile, json_encode($data));
    }
}
?>
