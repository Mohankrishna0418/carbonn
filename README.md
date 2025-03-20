# College Database Management System

This project implements a College Database Management System with a RESTful API, enabling efficient management of students, professors, proctorships, and library memberships.

## Features

- **Student Management**: Add, update, retrieve, and delete student records.
- **Professor Management**: Add, update, retrieve, and delete professor records.
- **Proctorship Assignment**: Assign students to professors as their proctors.
- **Library Membership**: Manage library memberships for students.

## Database Schema

### Student
- `id` (UUID, Primary Key)
- `name` (String)
- `dateOfBirth` (Date)
- `aadharNumber` (String, Unique)

### Professor
- `id` (UUID, Primary Key)
- `name` (String)
- `seniority` (Enum: JUNIOR, SENIOR, ASSOCIATE, HEAD)
- `aadharNumber` (String, Unique)

### Proctorship
Defines the relationship where each student is assigned to a professor as their proctor.
- `studentId` (UUID, Foreign Key referencing Student)
- `professorId` (UUID, Foreign Key referencing Professor)

### LibraryMembership
- `id` (UUID, Primary Key)
- `studentId` (UUID, Foreign Key referencing Student, Unique)
- `issueDate` (Date)
- `expiryDate` (Date)

## API Endpoints

### Students
- `GET /students` - Retrieve all students.
- `GET /students/enriched` - Retrieve all students along with their proctor details.
- `POST /students` - Create a new student. Ensures no duplicates based on `aadharNumber`.
- `PATCH /students/:studentId` - Update details of a student by their ID.
- `DELETE /students/:studentId` - Delete a student by their ID.

### Professors
- `GET /professors` - Retrieve all professors.
- `POST /professors` - Create a new professor. Ensures no duplicates based on `aadharNumber`.
- `PATCH /professors/:professorId` - Update details of a professor by their ID.
- `DELETE /professors/:professorId` - Delete a professor by their ID.

### Proctorships
- `GET /professors/:professorId/proctorships` - Retrieve all students under the proctorship of the specified professor.
- `POST /professors/:professorId/proctorships` - Assign a student to the proctorship of the specified professor.

### Library Memberships
- `GET /students/:studentId/library-membership` - Retrieve the library membership details of the specified student.
- `POST /students/:studentId/library-membership` - Create a library membership for the specified student. Ensures no duplicate memberships for a student.
- `PATCH /students/:studentId/library-membership` - Update the library membership details of the specified student.
- `DELETE /students/:studentId/library-membership` - Delete the library membership of the specified student.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Neon.tech](https://neon.tech/) (Managed PostgreSQL database)
- [Prisma](https://www.prisma.io/) (Database ORM)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mohankrishna0418/carbon.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd carbon
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up the database**:
   - Create a database on [Neon.tech](https://neon.tech/).
   - Update the database connection URL in `.env`:
     ```env
     DATABASE_URL="your_neon_database_url"
     ```
   - Run the Prisma migration to set up the database schema:
     ```bash
     npx prisma migrate dev --name "PROVIDE_SUITABLE_MIGRATION_NAME"
     ```

5. **Start the server**:
   ```bash
   npm run dev
   ```
   The server should now be running at `http://localhost:3000`.

## Technologies Used
- **Backend**: Node.js with Hono
- **Database ORM**: Prisma
- **Database**: Neon.tech (Managed PostgreSQL)
- **Language**: TypeScript

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License
This project is licensed under the MIT License. See the [LICENSE](License.txt) file for details.

## Acknowledgements
Special thanks to all contributors and the open-source community for their invaluable support and resources.
