# System Architecture: HamroCinema
**Document Version:** 1.0
**Pattern:** Decoupled Client-Server Architecture (RESTful API)

---

## 1. High-Level Architecture Overview
HamroCinema operates on a decoupled architecture where the Frontend (React.js) and Backend (Django) act as two separate applications. They communicate entirely over HTTP using JSON payloads. 

*   **Presentation Layer (Frontend):** Handles all UI rendering, routing, visual state (dark theme), and user interactions.
*   **Business Logic Layer (Backend):** Handles validation, database locking, payment callback verification, PDF generation, and email dispatching.
*   **Data Access Layer (Database):** A relational SQLite database storing all persistent data.

---

## 2. Text-Based Architecture Diagram
This diagram illustrates the flow of data from the user's browser down to the database and external APIs.

```text
       [ User Browser (Desktop/Mobile) ]
                     |
            (React Router DOM)
                     v
+------------------------------------------+
|            REACT FRONTEND                |
|  - Auth Context (JWT)                    |
|  - Customer UI (Dark Theme Cinematic)    |
|  - Admin / Manager Dashboard UI          |
|  - Visual Seat Map Component             |
+------------------------------------------+
                     |
           (Axios / Fetch API) 
         HTTP GET/POST (JSON Data)
                     v
+------------------------------------------+
|           DJANGO REST BACKEND            |
|  - URL Router (urls.py)                  |
|  - Views / Controllers (views.py)        |
|  - Serializers (serializers.py)          |
|  - Models / ORM (models.py)              |
+------------------------------------------+
        |            |             |
        v            v             v
   [ SQLite ]   [ eSewa API ]   [ Gmail ]
   (Database)    (Payments)      (SMTP)
```

## 3. Frontend Architecture (React.js)
The frontend uses a component-based architecture. To maintain a clean codebase, the folder structure will be organized by "features" rather than file types.

**Component Structure:**
*   `/src/components/common`: Reusable UI elements (Navbar, Buttons, Modals).
*   `/src/components/cinema`: Movie grids, Trailer modals.
*   `/src/components/booking`: The interactive 75-seat grid, Cart summary.
*   `/src/layouts`: Layout wrappers (e.g., CustomerLayout.js for the dark theme, AdminLayout.js for dashboards).

**State Management:**
*   **Local State (useState):** Used for handling form inputs and toggling UI modals.
*   **Global State (Context API):** Used to store the User Auth Token (JWT) so the user stays logged in across pages.

## 4. Backend Architecture (Django REST Framework)
The backend strictly follows Django's MTV (Model-Template-View) pattern, but because we are building an API, the "Template" is replaced by "Serializers".
*   **Models:** Define the SQLite database tables.
*   **Serializers:** Convert Python Model objects into JSON format for React, and validate incoming JSON data from React.
*   **Views (API endpoints):** Contains the core business logic (e.g., checking if a seat is locked, triggering the eSewa request).

## 5. Database Schema (SQLite)
The database is highly normalized to prevent redundancy (3NF).
*   **User Table:** id, name, email, password_hash, role (Admin, Manager, Customer).
*   **Movie Table:** id, title, description, duration, poster_url, is_active.
*   **TheaterScreen Table:** id, screen_name, total_capacity (Defaults to 75).
*   **Showtime Table:** id, movie_id (FK), screen_id (FK), start_time, end_time.
*   **Seat Table:** id, screen_id (FK), seat_label (e.g., A1, G4), tier (Gold/Silver/Platinum).
*   **Booking Table:** id, user_id (FK), showtime_id (FK), total_amount, payment_status (Pending/Completed), esewa_ref_id.
*   **TicketItem Table:** id, booking_id (FK), seat_id (FK), lock_status (Available/Locked/Booked), lock_timestamp.

## 6. Logic Flow: Concurrency & eSewa Payment
This is the core architectural algorithm to prevent two users from booking the same seat:
*   **Select:** User A clicks Seat A1 in React.
*   **Request:** React sends POST `/api/lock-seat/` to Django.
*   **Validate:** Django queries SQLite. If `lock_status == 'Available'`, Django changes it to Locked and sets `lock_timestamp = NOW()`.
*   **Redirect:** Django sends a success response; React redirects User A to the eSewa portal.
*   **Simultaneous Click:** If User B tries to click Seat A1, Django checks the timestamp. Since it is locked and `NOW() < lock_timestamp + 5 mins`, User B gets an error.
*   **Callback:** eSewa sends a success webhook to Django. Django updates `payment_status` to Completed and `lock_status` to Booked.
*   **Expiration:** If User A closes the browser at eSewa, a Django background task (or check-on-query logic) reverts the seat back to Available after 5 minutes.
