Shipment Tracking System
This is a tracking dashboard built with React, Node.js/Express, and Supabase. It helps manage shipments, monitor status updates, and customize the user experience.

Data Origin
The data for this application is hosted on Supabase.

Authentication: Managed via Supabase Auth.

Real-time: The app listens for database changes to update the UI instantly without needing a page refresh.

Key Features
Shipment Management: Create, view and track shipments with estimated arrival times.

Archives: A dedicated space for completed or old shipments to keep your main dashboard clean.

Component Visibility (Customization): You can toggle specific UI elements on or off. By going into your user settings and unchecking components (like "News" or "Estimated Time"), they will be hidden from your view immediately.

Dynamic Status Updates: Update shipment progress through a simple, interactive interface.

Admin Access
To keep the system secure and centralized, the app currently supports only one admin account with full privileges:

Email: admin@gmail.com

Password: admin123

Note: do not edit the admin settings (checkboxes for the components)

Running the App: on local host since it's not deployed-

Download the folder and open it in VS Code.

(Backend): Open a terminal, cd into the backend folder, run npm install.

(Frontend): Open a second terminal window, cd into the frontend folder.

(Backend): run node server.js in the terminal of the backend folder.

(Frontend): run npm run dev in the terminal of the frontend folder.

Open your browser to the local link (usually http://localhost:3000) and the app will be live.

