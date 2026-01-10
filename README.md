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

Note: do not edit the admin settings (checkboxes for the components)

Running the App: on local host since it's not deployed-

1. Database Setup
Create a new project on Supabase.
Go to the SQL Editor tab in the sidebar.
Click New Query, paste the contents of schema.sql, and hit Run.
Your tables are built, and the admin user (admin@gmail.com / admin123) is created.

3. Environment Variables
Create a file named .env in the root of the project (and inside the /client folder if needed).
Add your Supabase credentials found in Settings > API:
Download the folder and open it in VS Code.

(Backend): Open a terminal, cd into the backend folder, run npm install.

(Frontend): Open a second terminal window, cd into the frontend folder.

(Backend): run node server.js in the terminal of the backend folder.

(Frontend): run npm run dev in the terminal of the frontend folder.

Open your browser to the local link (usually http://localhost:3000) and the app will be live.

Author:
Savia Chalak Taufiq
Software engineering student.
