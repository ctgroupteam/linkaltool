# Free Student CV Subdomains (`*.linkal.in`)

This directory hosts direct student portfolio / CV websites on custom subdomains of **linkal.in** without requiring any student login, account creation, or manual configuration in Cloudflare or Vercel.

---

## How It Works

1. **Wildcard DNS & Routing**:
   - `*.linkal.in` already points to Vercel via Cloudflare wildcard DNS.
   - Any requested subdomain (e.g. `https://cv1.linkal.in` or `https://rahul.linkal.in`) automatically hits the server.
   - The server inspects this directory (`free CVs/`) and serves the student's CV instantly.

2. **Adding a New Student CV**:
   - Create a new folder (e.g. `CV3`, `rahul`, etc.).
   - Put their HTML code inside `index.html`.
   - In `mapping.json`, add the subdomain slug you want:
     ```json
     {
       "cv1": "CV1",
       "cv2": "CV2",
       "rahul": "CV3"
     }
     ```
   - Visiting `https://rahul.linkal.in` immediately displays their CV!

3. **No Setup Needed**:
   - 0 Cloudflare subdomain entries needed.
   - 0 Vercel projects needed.
   - 0 User logins or accounts required.
