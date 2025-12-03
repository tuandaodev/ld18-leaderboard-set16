# Security Review: Leader Board Controller

## Executive Summary
This document outlines critical and high-priority security vulnerabilities found in `leader-board.controller.ts`. Several issues require immediate attention to prevent potential security breaches.

---

## 🔴 CRITICAL VULNERABILITIES

### 1. Path Traversal Vulnerability (CWE-22)
**Location:** `getLeaderBoardList` function (lines 20-24)
```typescript
const dateString = req.query.date as string;
if (dateString) {
  userFilePath = path.resolve(__dirname, `../../data/user-leaderboard-${dateString}.json`);
}
```

**Issue:** User-controlled input (`dateString`) is directly interpolated into file paths without sanitization, allowing attackers to read arbitrary files.

**Attack Example:**
```
GET /leaderboard/list?date=../../../.env
GET /leaderboard/list?date=../../../../etc/passwd
```

**Fix:** Sanitize and validate the date string:
```typescript
// Validate date format strictly
if (dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
  userFilePath = path.resolve(__dirname, `../../data/user-leaderboard-${dateString}.json`);
  // Ensure path stays within data directory
  const dataDir = path.resolve(__dirname, '../../data');
  if (!userFilePath.startsWith(dataDir)) {
    throw new Error('Invalid path');
  }
}
```

---

### 2. Insecure File Upload - No Type Validation (CWE-434)
**Location:** `uploadCSV` function (lines 289-386)

**Issues:**
- No file type validation (MIME type or extension check)
- No file size limits specified
- Files accepted without verifying they are actually CSV files
- Predictable file naming could allow overwrite attacks

**Attack Scenarios:**
- Upload executable files disguised as CSV
- Upload extremely large files causing DoS
- Upload malicious scripts that get executed

**Fix:**
```typescript
const csvUploadOptions: multer.Options = {
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Validate MIME type
    const allowedMimes = ['text/csv', 'application/csv', 'text/plain'];
    const allowedExtensions = ['.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
};
```

---

### 3. API Key Exposure in Query Parameters (CWE-598)
**Location:** `initUsersLeaderBoard` (line 227), `uploadCSV` (line 292), `exportLeaderBoardCSV` (line 391)

**Issue:** API keys are passed in query parameters and request bodies, which:
- Get logged in server logs
- Appear in browser history
- Can be leaked via referrer headers
- Visible in network monitoring tools

**Fix:** Use HTTP headers instead:
```typescript
// Client sends: X-API-Key header
const apiKey = req.headers['x-api-key'] as string;
if (!apiKey || apiKey !== process.env.API_KEY) {
  return res.status(401).json({ success: false, message: 'Unauthorized' });
}
```

**Additional:** Consider implementing proper JWT-based authentication instead of simple API key comparison.

---

## 🟠 HIGH PRIORITY ISSUES

### 4. Synchronous File Operations (DoS Risk)
**Location:** Multiple locations using `fs.readFileSync`, `fs.writeFileSync`

**Issue:** Synchronous file operations block the Node.js event loop, making the server unresponsive during I/O operations.

**Affected Functions:**
- `getLeaderBoardList` (line 28)
- `processInitUsersLeaderBoard` (lines 60, 78, 96, 127, 181, 203, 212)
- `uploadCSV` (lines 374)
- `exportLeaderBoardCSV` (line 400)

**Fix:** Use async/await with `fs.promises`:
```typescript
// Instead of:
const jsonString = fs.readFileSync(userFilePath, 'utf-8');

// Use:
const jsonString = await fs.promises.readFile(userFilePath, 'utf-8');
```

---

### 5. No Input Sanitization (XSS/Injection Risk)
**Location:** Throughout the controller

**Issues:**
- No XSS protection middleware
- User inputs not sanitized before use
- CSV content not validated before parsing

**Fix:** Add XSS sanitization middleware:
```typescript
import { xss } from 'express-xss-sanitizer';

export const uploadCSV = [
  upload,
  xss(), // Add XSS protection
  asyncHandler(async (req: Request, res: Response) => {
    // ... rest of code
  })
];
```

---

### 6. Unauthenticated File System Access
**Location:** `getLeaderBoardList` (line 17)

**Issue:** Public endpoint that reads files from disk without authentication, potentially exposing sensitive data.

**Recommendation:** 
- Add authentication middleware if the data is sensitive
- Or implement proper public data serving mechanism (CDN, static file server)
- Add rate limiting to prevent abuse

---

### 7. Error Information Disclosure
**Location:** Throughout the controller

**Issue:** Error messages and stack traces might leak sensitive information about the system.

**Example:** Line 31 catches errors but doesn't log them securely.

**Fix:** Implement proper error handling:
```typescript
catch (error) {
  console.error('Error reading leaderboard file:', error);
  // Don't expose internal paths or details
  return res.status(500).json({
    success: false,
    message: 'Unable to load leaderboard data'
  });
}
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 8. No Rate Limiting on Sensitive Endpoints
**Location:** `initUsersLeaderBoard`, `uploadCSV`, `exportLeaderBoardCSV`

**Issue:** These endpoints perform expensive operations but have no rate limiting, allowing DoS attacks.

**Fix:** Add rate limiting:
```typescript
import rateLimit from 'express-rate-limit';

const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many upload requests, please try again later'
});

export const uploadCSV = [
  uploadRateLimiter,
  upload,
  // ... rest
];
```

---

### 9. Predictable File Naming
**Location:** `uploadCSV` (line 332)

**Issue:** Files are named with predictable timestamps, potentially allowing attackers to guess file names.

**Fix:** Use cryptographically secure random names:
```typescript
import crypto from 'crypto';
const randomId = crypto.randomBytes(16).toString('hex');
const formattedFilename = `${fileType}_${randomId}${path.extname(file.originalname)}`;
```

---

### 10. No CSV Content Validation
**Location:** `uploadCSV` function

**Issue:** CSV files are parsed without validating:
- Row count limits
- Column structure
- Data types
- Malicious content

**Fix:** Add validation before processing:
```typescript
// Validate CSV structure
const records = await getCSVForUsers(clonedFilePath);
if (records.length > 10000) {
  throw new Error('CSV file too large');
}
// Validate each record structure
for (const record of records) {
  if (!record[0] || typeof record[0] !== 'string') {
    throw new Error('Invalid CSV format');
  }
}
```

---

### 11. Hardcoded Paths
**Location:** Multiple locations

**Issue:** File paths are hardcoded, making the code less maintainable and potentially insecure.

**Recommendation:** Use environment variables or configuration files for paths.

---

### 12. Missing Input Validation
**Location:** `testController` (line 255)

**Issue:** Test endpoint exposed in production without proper validation.

**Recommendation:** 
- Remove test endpoints from production
- Or protect with authentication and environment checks

---

## 🔵 LOW PRIORITY / BEST PRACTICES

### 13. Inconsistent Error Handling
Some functions use try-catch, others don't. Standardize error handling patterns.

### 14. Missing Logging
Add structured logging for security events (failed auth attempts, file uploads, etc.)

### 15. No Request Timeout
Long-running operations (like `processInitUsersLeaderBoard`) should have timeouts.

### 16. Environment Variable Validation
Add startup validation to ensure required environment variables are set.

---

## Recommended Security Improvements Priority

1. **Immediate (This Week):**
   - Fix path traversal vulnerability (#1)
   - Add file type validation (#2)
   - Move API keys to headers (#3)

2. **Short Term (This Month):**
   - Convert to async file operations (#4)
   - Add rate limiting (#8)
   - Implement proper error handling (#7)

3. **Medium Term:**
   - Add input sanitization (#5)
   - Implement proper authentication (#6)
   - Add CSV content validation (#10)

4. **Long Term:**
   - Security audit and penetration testing
   - Implement security headers
   - Add security monitoring and alerting

---

## Additional Security Recommendations

1. **Use Content Security Policy (CSP)** headers
2. **Implement request signing** for sensitive operations
3. **Add file virus scanning** for uploads
4. **Use secure file storage** (S3, etc.) instead of local filesystem
5. **Implement audit logging** for all admin operations
6. **Regular security dependency updates**
7. **Consider using a WAF** (Web Application Firewall)

---

## Testing Recommendations

1. **Penetration Testing:**
   - Test path traversal attempts
   - Test file upload with various file types
   - Test rate limiting effectiveness
   - Test API key security

2. **Automated Security Scanning:**
   - Use tools like `npm audit`
   - Use SAST tools (SonarQube, Snyk)
   - Use dependency scanning

3. **Code Review:**
   - Regular security-focused code reviews
   - Use security linting tools (eslint-plugin-security)

---

**Review Date:** 2025-01-27
**Reviewed By:** Security Audit
**Next Review:** After implementing critical fixes

