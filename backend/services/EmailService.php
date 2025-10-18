<?php
/**
 * Email Service for sending verification codes
 * Uses Gmail SMTP (free tier)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Enable 2-Step Verification in your Gmail account
 * 2. Generate App Password: https://myaccount.google.com/apppasswords
 * 3. Update the credentials below
 */

class EmailService {
    private $smtpHost = 'smtp.gmail.com';
    private $smtpPort = 587;
    private $smtpUsername = 'your-email@gmail.com'; // TODO: Replace with your Gmail
    private $smtpPassword = 'your-app-password';    // TODO: Replace with Gmail App Password
    private $fromEmail = 'your-email@gmail.com';
    private $fromName = 'DRRM App';
    
    /**
     * Send verification code via email
     * For now, this is a simple implementation without PHPMailer
     * In production, you should use PHPMailer or similar library
     */
    public function sendVerificationCode($toEmail, $code, $name = 'User') {
        // For development: Log the code instead of sending
        // This allows testing without actual email service
        error_log("=== EMAIL VERIFICATION CODE ===");
        error_log("To: $toEmail");
        error_log("Name: $name");
        error_log("Code: $code");
        error_log("===============================");
        
        // TODO: Implement actual email sending with PHPMailer when ready
        // For now, return true to simulate successful sending
        return true;
        
        /* 
        // PRODUCTION CODE (uncomment when ready):
        
        require_once __DIR__ . '/../vendor/autoload.php'; // PHPMailer via Composer
        
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = $this->smtpHost;
            $mail->SMTPAuth   = true;
            $mail->Username   = $this->smtpUsername;
            $mail->Password   = $this->smtpPassword;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $this->smtpPort;
            
            // Recipients
            $mail->setFrom($this->fromEmail, $this->fromName);
            $mail->addAddress($toEmail, $name);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'DRRM App - Email Verification Code';
            $mail->Body    = $this->getEmailTemplate($name, $code);
            $mail->AltBody = "Your verification code is: $code\n\nThis code will expire in 10 minutes.";
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Email sending failed: {$mail->ErrorInfo}");
            return false;
        }
        */
    }
    
    /**
     * Send phone verification code via SMS
     * This is a mock implementation for development
     */
    public function sendPhoneVerificationCode($phoneNumber, $code, $name = 'User') {
        // For development: Log the code instead of sending SMS
        error_log("=== SMS VERIFICATION CODE ===");
        error_log("To: $phoneNumber");
        error_log("Name: $name");
        error_log("Code: $code");
        error_log("=============================");
        
        // TODO: Implement actual SMS sending with Semaphore/Twilio when ready
        // For now, return true to simulate successful sending
        return true;
        
        /*
        // PRODUCTION CODE (uncomment when ready with SMS service):
        
        // Example with Semaphore API:
        $apiKey = 'your-semaphore-api-key';
        $message = "Your DRRM App verification code is: $code. Valid for 10 minutes.";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.semaphore.co/api/v4/messages');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'apikey' => $apiKey,
            'number' => $phoneNumber,
            'message' => $message,
            'sendername' => 'DRRM'
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return $response !== false;
        */
    }
    
    private function getEmailTemplate($name, $code) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4A90E2; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; }
                .code { font-size: 32px; font-weight: bold; color: #4A90E2; text-align: center; 
                        padding: 20px; background: white; border-radius: 8px; margin: 20px 0; 
                        letter-spacing: 8px; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>DRRM App</h1>
                </div>
                <div class='content'>
                    <h2>Hello $name,</h2>
                    <p>Thank you for registering with DRRM App. Please use the verification code below to complete your registration:</p>
                    <div class='code'>$code</div>
                    <p><strong>This code will expire in 10 minutes.</strong></p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 DRRM App. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
}
?>
