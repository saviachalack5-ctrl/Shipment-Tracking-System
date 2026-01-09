Shipment Tracking System

This project is a shipment tracking system built with React for the frontend and Node.js for the backend. 
It supports role-based access, admin-controlled user management, and shipment tracking functionality. 
The system was designed to reflect real application structure rather than a simple demo or static interface.

Project Overview:

The application supports two roles: users and admin.

Users can track shipments and view shipment details.
Admins have elevated privileges that allow them to manage users and shipment data.
Admin privileges are not hardcoded directly into the backend logic. 
Instead, the system requires an initial setup step that designates a user as an admin. 
This design ensures that admin access is controlled intentionally and cannot be gained through the frontend alone.
Some application state is currently handled using local storage, while other parts rely on backend logic. 
The system is structured so that missing pieces can be added incrementally without rewriting the core architecture.

Admin Setup and Access Control:

The system supports one admin at a time.

To create an admin:

A user must first exist in the database.
The make-admin script located in the backend login folder is executed.
This script promotes the selected user to admin status.
Only an existing admin can add new users and manage admin-level functionality.
Access control is enforced by backend checks and by conditional rendering on the frontend. 
Admin-only components are hidden from regular users and cannot be accessed without proper authorization.

Features:

- Shipment tracking using a shipment ID
- User authentication and role-based access
- Admin-controlled user creation
- Admin dashboard for managing shipments
- Conditional visibility of application components based on role
- Separation between frontend and backend logic

Tech Stack

Frontend:
React
CSS

Backend:
Node.js
Express


Other:

Local storage (for some client-side state)
Database integration for user and shipment data
Git and GitHub for version control

Running the Project Locally

Frontend:
Navigate to the frontend directory (login) and run:

npm install
npm run dev

Backend:
Navigate to the backend directory (login backend) and run:

npm install
node server.js

Both the frontend and backend must be running for the application to function correctly.

Architecture Notes:

The project is structured with a clear separation between frontend and backend responsibilities. 
Authentication, role checks, and admin promotion logic are handled on the backend.
while the frontend focuses on user interaction and conditional rendering based on authorization state.

Although some functionality currently relies on local storage, 
the existing structure allows these parts to be migrated to full database-backed solutions without major refactoring.

Limitations and Extensibility:

This project is not deployed and is intended to run locally. While not production-ready, it is designed to be extensible. Future improvements could include:

Expanding database usage to replace remaining local storage logic
Supporting multiple admin accounts
Adding stronger validation and error handling
Improving persistence and security hardening

Author:

Savia Chalack
Software engineering student
