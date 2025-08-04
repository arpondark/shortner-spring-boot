// Quick CORS test - Add this to your browser console on localhost:3000

// Test 1: Direct fetch
fetch('http://localhost:8080/api/auth/public/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'john_doe', password: 'password123' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);

// If this fails with CORS error, the backend needs CORS configuration
// If this succeeds, the frontend API client has an issue

// Test 2: Check current origin
console.log('Current origin:', window.location.origin);
console.log('API target:', 'http://localhost:8080');
