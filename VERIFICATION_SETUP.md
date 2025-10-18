# Email & Phone Verification Setup Guide

## ✅ What's Been Implemented

### Backend (Complete)
1. **Database Migration** ✓
   - Added `email_verified`, `phone_verified` columns
   - Added `email_verification_code`, `phone_verification_code` columns
   - Added `verification_code_expires_at` column

2. **Email Service** ✓
   - Created `EmailService.php` with mock email/SMS sending
   - Logs codes to console for testing (no actual email sent yet)
   - Ready for Gmail SMTP or SendGrid integration

3. **API Endpoints** ✓
   - `POST /api/auth.php?action=send-verification` - Send OTP code
   - `POST /api/auth.php?action=verify-code` - Verify OTP code

4. **User Model** ✓
   - Added `saveVerificationCode()` method
   - Added `verifyCode()` method
   - Codes expire after 10 minutes

### Frontend (Complete)
1. **Email Verification Screen** ✓
   - `app/(auth)/verify-email.tsx` created
   - 6-digit code input
   - Resend functionality with 60s cooldown
   - Auto-sends code on mount

2. **Updated Signup Flow** ✓
   - Signup → Email Verification → Onboarding → Home

3. **Services** ✓
   - `verificationService.ts` for API calls
   - Updated `User` interface with verification fields

---

## 🚀 How It Works Now

### User Registration Flow:
```
1. User signs up
   ↓
2. Account created (email_verified = false, phone_verified = false)
   ↓
3. Redirected to Email Verification screen
   ↓
4. 6-digit code sent (logged to console for now)
   ↓
5. User enters code
   ↓
6. Email verified ✓ (email_verified = true)
   ↓
7. Redirected to Onboarding (address collection)
   ↓
8. User can access app
```

### Phone Verification (For Relief Requests):
```
1. User tries to request relief goods
   ↓
2. System checks: phone_verified?
   ↓
3. If NO → Show "Verify Phone" prompt
   ↓
4. Send SMS code (logged to console for now)
   ↓
5. User enters code
   ↓
6. Phone verified ✓ (phone_verified = true)
   ↓
7. Can now request relief goods
```

---

## 📝 Testing Instructions

### Test Email Verification:
1. **Sign up** with a new account
2. You'll be redirected to **Email Verification** screen
3. **Check Docker logs** for the verification code:
   ```bash
   docker logs drrm_php --tail 20
   ```
4. Look for:
   ```
   === EMAIL VERIFICATION CODE ===
   To: your-email@example.com
   Code: 123456
   ===============================
   ```
5. **Enter the code** in the app
6. Should redirect to onboarding

### Test Phone Verification (Later):
1. Go to **Profile** screen
2. You'll see **Phone: ⚠️ Unverified**
3. Try to **request relief goods**
4. System will prompt to verify phone
5. Check Docker logs for SMS code
6. Enter code to verify

---

## 🔧 Next Steps (Optional - When Ready for Production)

### To Enable Real Email Sending:

1. **Get Gmail App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Generate app password
   - Copy the 16-character password

2. **Update EmailService.php:**
   ```php
   private $smtpUsername = 'your-email@gmail.com';
   private $smtpPassword = 'your-16-char-app-password';
   ```

3. **Install PHPMailer:**
   ```bash
   docker exec -it drrm_php bash
   cd /var/www/html
   composer require phpmailer/phpmailer
   ```

4. **Uncomment production code** in `EmailService.php`

### To Enable Real SMS Sending:

1. **Sign up for Semaphore:**
   - Go to https://semaphore.co/
   - Get API key
   - Load ₱100 minimum

2. **Update EmailService.php:**
   ```php
   $apiKey = 'your-semaphore-api-key';
   ```

3. **Uncomment SMS production code** in `EmailService.php`

---

## 📱 Profile Screen Updates Needed

To show verification status in profile, update `app/screens/profile.tsx`:

```tsx
// Add verification badges
<View style={styles.infoItem}>
  <Ionicons name="mail-outline" size={20} color="#4A90E2" />
  <View style={styles.infoContent}>
    <Text style={styles.infoLabel}>Email</Text>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={styles.infoText}>{user?.email}</Text>
      {user?.emailVerified ? (
        <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{marginLeft: 8}} />
      ) : (
        <Text style={{color: '#F59E0B', fontSize: 12, marginLeft: 8}}>Unverified</Text>
      )}
    </View>
  </View>
</View>

<View style={styles.infoItem}>
  <Ionicons name="call-outline" size={20} color="#4A90E2" />
  <View style={styles.infoContent}>
    <Text style={styles.infoLabel}>Phone</Text>
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <Text style={styles.infoText}>{user?.phone}</Text>
      {!user?.phoneVerified && (
        <TouchableOpacity onPress={handleVerifyPhone}>
          <Text style={{color: '#4A90E2', fontSize: 12, fontWeight: '600'}}>Verify Now</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
</View>
```

---

## 🎯 Current Status

### ✅ Working (FREE - No Setup Required):
- Email verification with mock sending (codes logged to console)
- Phone verification with mock sending (codes logged to console)
- Database properly tracks verification status
- API endpoints functional
- Frontend screens created

### ⏳ Pending (When You're Ready):
- Real email sending (requires Gmail setup - 5 minutes)
- Real SMS sending (requires Semaphore account - ₱100 minimum)
- Profile screen verification badges
- Relief request phone verification check

---

## 🐛 Troubleshooting

### Code not appearing in logs?
```bash
# Check Docker logs
docker logs drrm_php --follow

# Or check specific file
docker exec drrm_php tail -f /var/log/apache2/error.log
```

### Verification failing?
- Check code hasn't expired (10 minutes)
- Ensure user_id is correct
- Check database has verification columns

### Need to reset verification?
```sql
UPDATE users 
SET email_verified = FALSE, 
    phone_verified = FALSE,
    email_verification_code = NULL,
    phone_verification_code = NULL
WHERE id = 'user_id';
```

---

## 📞 Support

For testing, verification codes are logged to Docker console:
```bash
docker logs drrm_php --tail 50
```

Look for lines like:
```
=== EMAIL VERIFICATION CODE ===
To: user@example.com
Code: 123456
===============================
```

Everything is set up and ready to test! 🎉
