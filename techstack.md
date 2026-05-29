# Technology Stack: HamroCinema
**Document Version:** 1.0
**Project:** Online Movie Ticket Booking System (TU BCA 6th Semester)

---

## 1. Frontend Architecture (Client-Side)
The frontend is responsible for the dark cinematic user interface, interactive seat mapping, and routing.

*   **Core Library:** React.js (v18+)
*   **Routing:** React Router DOM (For seamless navigation without page reloads)
*   **State Management:** React Context API (For managing the user's logged-in state/JWT token)
*   **API Client:** Axios (For sending asynchronous HTTP requests to the Django backend)
*   **Styling:** Tailwind CSS *(Recommended)* or standard CSS3 (To strictly enforce the custom dark cinematic theme without fighting pre-built Bootstrap light themes)
*   **Icons:** FontAwesome or React Icons

## 2. Backend Architecture (Server-Side & API)
The backend handles all business logic, database transactions, security, and external API communication.

*   **Programming Language:** Python 3.x
*   **Web Framework:** Django (v5.x)
*   **API Framework:** Django REST Framework (DRF) - Used to convert Django data into JSON for React.
*   **Authentication:** `djangorestframework-simplejwt` (JSON Web Tokens for secure, stateless logins)
*   **PDF Generation:** `reportlab` or `WeasyPrint` (Python libraries to draw the e-ticket)
*   **Email Sending:** Python's built-in `smtplib` / Django `core.mail` module

## 3. Database Layer
*   **Database Engine:** SQLite 3
*   **ORM (Object-Relational Mapper):** Django ORM (Allows writing database queries in Python instead of raw SQL)

## 4. Third-Party Integrations
*   **Payment Gateway:** eSewa Merchant API (REST-based integration for processing ticket payments)
*   **Mail Server:** Gmail SMTP Server (For dispatching PDF tickets)

## 5. Development & Testing Tools
*   **Version Control:** Git & GitHub (Mandatory for Unit 3: Teamwork & Collaboration syllabus)
*   **Code Editor:** Visual Studio Code (VS Code)
*   **API Testing:** Postman (To test Django REST endpoints before connecting React)
*   **Database Viewer:** DB Browser for SQLite (To visually check if the 5-minute seat lock is updating in the database)

---

## 6. Technology Justification (Viva Defense Prep)

**Q: Why use React.js instead of standard Django HTML templates?**
*Answer:* Using React allows for a decoupled application. It provides a Single Page Application (SPA) experience where the visual seat map can update dynamically without reloading the entire web page, preventing users from losing their selected seats during a page refresh.

**Q: Why use Django REST Framework (DRF)?**
*Answer:* Since React handles the frontend, Django cannot pass HTML directly. DRF is required to serialize complex database models into JSON (JavaScript Object Notation), which is the standard format React understands.

**Q: Why use SQLite instead of MySQL?**
*Answer:* SQLite is a file-based database that requires no separate server installation. It is highly portable, meaning the project can be run directly from a flash drive on the university computer during the final defense without needing to configure a local MySQL server like XAMPP.

**Q: Why JWT (JSON Web Tokens) instead of session cookies?**
*Answer:* Because the React frontend and Django backend run on different ports (e.g., localhost:3000 vs localhost:8000), standard Django session cookies will fail due to Cross-Origin Resource Sharing (CORS) security. JWT provides a secure, stateless authentication method perfect for decoupled APIs.
