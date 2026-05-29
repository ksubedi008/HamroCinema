# Master Project Documentation: HamroCinema
**Course:** Project II (CAPJ356)
**Degree:** Bachelor of Computer Application (BCA) 6th Semester
**University:** Tribhuvan University (TU), Nepal
**Project Title:** HamroCinema – An Online Movie Ticket Booking System
**Tech Stack:** React.js (Frontend), Python/Django REST Framework (Backend), SQLite (Database)

---

## Phase 1: Project Proposal (Submission: Within 20 Days of Semester Start)

### 1. Introduction
The entertainment industry in Nepal is rapidly digitizing, yet many independent cinemas lack an efficient, centralized booking platform. **HamroCinema** is a modern, web-based online movie ticket booking system designed to provide a seamless, dark-themed cinematic user interface. It bridges the gap between cinema management and customers by offering real-time visual seat selection, tiered pricing, and automated e-ticketing.

### 2. Problem Statement
*   Existing cinema systems often suffer from race conditions (double-booking) during high-traffic ticket sales.
*   Physical ticketing queues waste customer time and reduce theater operational efficiency.
*   Independent theaters lack affordable, modern software to manage dynamic seating and digital local payments (eSewa).

### 3. Objectives
*   To develop a RESTful API using Django and a dynamic frontend using React.js.
*   To implement an interactive, visual seat selection map supporting 3 screens with 75 seats each and tiered pricing.
*   To integrate a 5-minute database locking mechanism to prevent race conditions during checkout.
*   To integrate eSewa for secure payment processing and SMTP for automated PDF ticket delivery.

### 4. Methodology
**4.1 Requirement Identification**
*   *Study of Existing System:* Analysis of platforms like QFX Cinemas and BigMovies.
*   *Requirement Analysis:* Gathering functional (eSewa, PDF generation) and non-functional (dark UI, security) requirements.

**4.2 Feasibility Study**
*   *Technical:* Highly feasible. React and Django are robust, well-documented technologies. SQLite is sufficient for local MVP development.
*   *Operational:* The dual-dashboard system ensures theater managers and admins can operate the system with minimal training.
*   *Economic:* Development costs are minimal as open-source frameworks and local environments will be used.

**4.3 High-Level Design (System Architecture)**
The system follows a Model-View-Controller (MVC) architecture decoupled via a REST API. The React frontend consumes JSON data provided by the Django backend, which securely interacts with the SQLite database.

### 5. Gantt Chart (Timeline)
*(To be drawn using tools like MS Project or Draw.io)*
*   **Week 1-2:** Requirement Analysis & Proposal
*   **Week 3-5:** Database Design & Backend API (Django)
*   **Week 6-8:** Frontend UI/UX Design (React)
*   **Week 9-10:** eSewa Integration & Seat Locking Logic
*   **Week 11-12:** Testing, Mid-Term Defense & Bug Fixing
*   **Week 13-15:** Final Report Documentation & Deployment Prep

### 6. Expected Outcome
A fully functional web application capable of handling user authentication, real-time seat locking, digital payments, and automated PDF ticket generation, alongside secure admin dashboards.

### 7. References
*   Official Django Documentation: *https://docs.djangoproject.com/*
*   Official React Documentation: *https://react.dev/*
*   eSewa Merchant API Documentation

---

## Phase 2: Mid-Term Progress Report (Submission: 12th Week)

### 1. System Analysis Draft
*   **Booking Logic:** When a user selects a seat, the system issues a `POST` request to the Django API. The seat status changes from `Available` to `Locked` for 5 minutes. If the eSewa callback is successful, the status updates to `Booked`.
*   **Role-Based Access Control (RBAC):** JWT tokens determine if a user is routed to the customer homepage or the secure Theater Manager dashboard.

### 2. UI Drafts (React Wireframes)
*(Include screenshots of your current React components here)*
*   Figure 2.1: Dark Cinematic Homepage (Movie Listings)
*   Figure 2.2: Visual Seat Selection Grid (75 Seats with Tiered Colors)
*   Figure 2.3: Theater Manager Dashboard

### 3. Database Schema Draft (SQLite)
*   **Users:** `id`, `name`, `email`, `password_hash`, `role` (Admin/Manager/Customer)
*   **Movies:** `id`, `title`, `duration`, `genre`, `poster_image`
*   **Shows:** `id`, `movie_id`, `screen_number`, `show_time`
*   **Seats:** `id`, `show_id`, `seat_number`, `tier` (Gold/Silver/Platinum), `status` (Available/Locked/Booked)
*   **Bookings:** `id`, `user_id`, `show_id`, `seat_id`, `payment_status`

---

## Phase 3: Final Project Report (Submission: 10 Days Before Final Viva)

### Preliminary Pages
*(Numbered in Roman numerals: i, ii, iii...)*
*   Cover & Title Page *(Must be Golden embracing with Black Binding per TU rules)*
*   Certificate Page (Supervisor's Certificate & Examiner's Approval)
*   Acknowledgement
*   Abstract
*   Table of Contents, List of Figures, List of Tables, List of Abbreviations

### Chapter 1: Introduction
*   1.1 Introduction
*   1.2 Problem Statement
*   1.3 Objectives
*   1.4 Scope and Limitation *(Limitation: Currently limited to 3 screens, uses SQLite for academic purposes).*
*   1.5 Development Methodology *(Agile Methodology)*
*   1.6 Report Organization

### Chapter 2: Background Study & Literature Review
*   Comparison between HamroCinema and existing systems (QFX, Fandango).
*   Justification for choosing decoupled React + Django over a monolithic architecture.

### Chapter 3: System Analysis and Design *(Crucial for Viva)*
*   **3.1 Requirement Analysis:** Detailed breakdown of Functional and Non-Functional requirements.
*   **3.2 Feasibility Analysis:** Expanded from the proposal.
*   **3.3 Data Modeling:** Entity-Relationship (ER) Diagram showing 1-to-many relationships between Movies, Shows, and Seats.
*   **3.4 Process Modeling:** Data Flow Diagrams (DFD - Level 0, Level 1) and UML Diagrams (Use Case, Sequence, Activity).

### Chapter 4: Implementation and Testing
*   **4.1 Implementation:** 
    *   *Tools Used:* VS Code, Node.js, Python, DB Browser for SQLite, Postman.
    *   *Implementation Details:* Explanation of JWT authentication, DRF views, and React state management.
*   **4.2 Testing:**
    *   *Unit Testing:* Testing individual API endpoints using Postman.
    *   *System Testing:* End-to-end testing of the eSewa checkout and 5-minute seat lock.
    *   *(Must include tables showing Test Cases: Input, Expected Output, Actual Output, Pass/Fail).*

### Chapter 5: Conclusion and Future Recommendations
*   **5.1 Lesson Learnt:** Overcoming challenges with API integration and state management.
*   **5.2 Conclusion:** Summary of project success.
*   **5.3 Future Recommendations:** Migrating database to PostgreSQL, adding mobile app support (React Native), and AI-based movie recommendations.

### References & Bibliography
*(Must use IEEE Referencing Standard)*

### Appendices
*   Appendix A: Important Source Code (Seat locking logic, API endpoints)
*   Appendix B: System Screenshots
*   Appendix C: Supervisor Visit Log Sheet *(Mandatory TU requirement tracking your meetings)*

---
**TU Formatting Strict Rules to Remember for the Final Document:**
*   **Font:** Times New Roman, Size 12 for paragraphs.
*   **Headings:** Chapter Titles (Size 16, Bold), Sections (Size 14, Bold), Sub-sections (Size 12, Bold).
*   **Spacing & Alignment:** 1.5 Line Spacing, Justified Alignment.
*   **Margins:** Top = 1", Bottom = 1", Right = 1", Left = 1.25".
