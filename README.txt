PAWCONNECT — FRONTEND APP EDITION
=================================

WHAT'S INCLUDED
- App-like responsive design with mobile bottom navigation
- Home, Explore, Report, Care & Awareness, Contact
- Animal cards and filters for type, age and location
- Demo sign-up / login and profile
- Demo adoption-interest form
- Report form with optional photo preview
- Contact form
- Progressive Web App manifest, icon and service worker

IMPORTANT: FRONTEND-ONLY LIMITATIONS
This project does NOT have a backend, database, real authentication, or server.
Demo profiles and form entries are saved in the browser's local storage on the
same device only. They are NOT sent to you and cannot be seen by other visitors.
The selected report photo is previewed in the browser; it is not uploaded.
For real submissions, connect a form service later (for example, Formspree).

HOW TO OPEN
1. Extract this ZIP.
2. Open the extracted PawConnect_App folder in VS Code.
3. For a quick preview, open index.html in a browser.
4. For PWA installation/service-worker testing, run it through a local server
   (VS Code Live Server extension) or publish it using GitHub Pages.
5. On a supported phone browser, open the published HTTPS site and choose
   "Add to Home Screen" / "Install app".

PUBLISHING ON GITHUB PAGES
Upload the CONTENTS of this folder (index.html, style.css, app.js,
manifest.json, service-worker.js, assets/) to the root of your existing
pawconnect repository. Keep your old project backed up first.
In GitHub: Repository > Settings > Pages > deploy from branch > main > /root.
After publishing, open the Pages URL over HTTPS.

BEFORE SUBMISSION
- Replace pawconnect@example.com in index.html with your real project email.
- The animal names, descriptions, locations and photos are sample/demo content.
  Replace them with accurate, verified animal details and photos.
- Internet is required for the Google font and Unsplash photos.
- Check the website on both mobile and desktop.
