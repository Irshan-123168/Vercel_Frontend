# Student Attendance System - Backend

This is the Spring Boot backend for the Student Attendance Management System.

## 🛠️ Tech Stack
- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: MySQL
- **Security**: Spring Security (Simplified for Demo)
- **Utilities**: Lombok

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven
- MySQL Server running

### 🗄️ Database Setup
1. Ensure MySQL is running on your machine.
2. The application is configured to automatically create the database `attendflow_db` if it doesn't exist.
3. Update your credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

### Installation & Run

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access the API**:
   The server will start on `http://localhost:8080`.

### 🔗 API Endpoints

#### Authentication
- `POST /api/auth/register` - Create a new faculty/admin account.
- `POST /api/auth/login` - Authenticate and get user details.

#### Students
- `GET /api/students` - Get all students.
- `GET /api/students/search?query={search}` - Search students by name or roll number.
- `PUT /api/students/{id}/status` - Update attendance status for a student.
- `POST /api/students` - Add a new student.

## 📂 Project Structure
- `com.attendflow.backend.model`: Data entities (Student, User).
- `com.attendflow.backend.repository`: JPA repositories for database access.
- `com.attendflow.backend.controller`: REST controllers for API endpoints.
- `com.attendflow.backend.config`: Configuration for Security and Data Initialization.
