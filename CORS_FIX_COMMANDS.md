# Quick CORS Fix - Copy & Paste Commands

## Open Google Cloud Shell
1. Go to: https://console.cloud.google.com/
2. Click the Cloud Shell icon (>_) in top-right
3. Wait for terminal to load

## Run These Commands (Copy & Paste Each Block)

### 1. Set Project
```bash
gcloud config set project questionpaper-3ae4a
```

### 2. Create CORS File
```bash
cat > cors.json << 'EOF'
[
  {
    "origin": ["http://localhost:5173", "http://localhost:*", "https://*.firebaseapp.com", "https://*.web.app"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
  }
]
EOF
```

### 3. Apply CORS Configuration (Try both bucket formats)

**First, try the standard format:**
```bash
gsutil cors set cors.json gs://questionpaper-3ae4a.appspot.com
```

**If that fails, list your buckets to find the correct name:**
```bash
gsutil ls
```

**Then use the bucket name from the list:**
```bash
gsutil cors set cors.json gs://YOUR_ACTUAL_BUCKET_NAME
```

### 4. Verify Configuration
```bash
gsutil cors get gs://questionpaper-3ae4a.appspot.com
```

(Or use the actual bucket name you found from `gsutil ls`)

## Done!
Your upload should work immediately after step 3 completes.
Test at: http://localhost:5173/upload
