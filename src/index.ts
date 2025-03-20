import { PrismaClient } from "@prisma/client";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
const prisma = new PrismaClient();

// get all students
app.get("/students", async (context) => {
  try {
    const student = await prisma.student.findMany();
    return context.json(student);
  } catch {
    return context.json("404 Error: Data not found.", 404);
  }
});

// get all students who has assigned to proctor
app.get("/students/enriched", async (context) => {
  try {
    const enriched = await prisma.student.findMany({
      include: {
        proctor: true,
      },
    });
    return context.json(enriched);
  } catch {
    return context.json("404 Error: Data not found.", 404);
  }
});

// get all professors
app.get("/professors", async (context) => {
  try {
    const professor = await prisma.professor.findMany();
    return context.json(professor);
  } catch {
    return context.json("404 Error: Data not found.", 404);
  }
});

// create student
app.post("/students", async (context) => {
  const { name, dateOfBirth, aadharNumber } =
    await context.req.json();
  try {
    const aadharExists = await prisma.student.findUnique({
      where: {
        aadharNumber: aadharNumber,
      },
    });
    if (aadharExists) {
      return context.json("Error: Aadhar number already exists.", 400);
    }

    const student = await prisma.student.create({
      data: {
        name: name,
        dateOfBirth: dateOfBirth,
        aadharNumber: aadharNumber
      },
    });
    return context.json(student, 200);
  } catch {
    return context.json("404 Error: Unable to create a student data.", 400);
  }
});

// create professor
app.post("/professors", async (context) => {
  const { name, seniority, aadharNumber } = await context.req.json();
  try {
    const aadharExists = await prisma.professor.findUnique({
      where: {
        aadharNumber: aadharNumber,
      },
    });

    if (aadharExists) {
      return context.json("Error: Aadhar number already exists.", 400);
    }

    const prof = await prisma.professor.create({
      data: {
        name: name,
        seniority: seniority,
        aadharNumber: aadharNumber,
      },
    });

    return context.json(prof, 200);
  } catch {
    return context.json("404 Error: Unable to create a professor data.", 404);
  }
});

// get all professors who has assigned to student
app.get("/professors/:professorId/proctorships", async (context) => {
  const professorId = context.req.param("professorId");
  try {
    const students = await prisma.student.findMany({
      where: {
        proctorId: professorId
      }
    });
    return context.json(students);
  } catch {
    return context.json("404 Error: Unable to find proctorships.", 404);
  }
});

// update student details using studentId
app.patch("/students/:studentId", async (context) => {
  const studentId = context.req.param("studentId");
  const { name, dateOfBirth, aadharNumber, proctorId } = await context.req.json();
  try {
    const uniqueStudentId = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });


    if (!uniqueStudentId) {
      return context.json("404 Error: Unable to find student data.", 404);
    }
    const student = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        name: name,
        dateOfBirth: dateOfBirth,
        aadharNumber: aadharNumber,
        proctorId: proctorId
      }
    });
    return context.json(student, 200);
  }

  catch {
    return context.json("404 Error: Unable to update student data.", 404);
  }
});

//update professor details using professorId
app.patch("/professors/:professorId", async (context) => {
  const professorId = context.req.param("professorId");
  const { name, seniority, aadharNumber } = await context.req.json();
  try {
    const uniqueProfessorId = await prisma.professor.findUnique({
      where: {
        professorId: professorId,
      },
    });
    if (!uniqueProfessorId) {
      return context.json("404 Error: Unable to find professor data.", 404);
    }
    const professor = await prisma.professor.update({
      where: {
        professorId: professorId,
      },
      data: {
        name: name,
        seniority: seniority,
        aadharNumber: aadharNumber,
      },
    });
    return context.json(professor, 200);
  } catch {
    return context.json("404 Error: Unable to update professor data.", 404);
  }
});

//delete student using studentId
app.delete("/students/:studentId", async (context) => {
  const studentId = context.req.param("studentId");
  try {
    const student = await prisma.student.delete({
      where: {
        id: studentId,
      },
    });
    return context.json(student, 200);
  } catch {
    return context.json("404 Error: Unable to delete student data.", 404);
  }
});

//delete professor using professorId
app.delete("/professors/:professorId", async (context) => {
  const professorId = context.req.param("professorId");
  try {
    const uniqueProfessorId = await prisma.professor.findUnique({
      where: {
        professorId: professorId,
      },
    });
    if (!uniqueProfessorId) {
      return context.json("404 Error: Unable to find professor data.", 404);
    }
    const professor = await prisma.professor.delete({
      where: {
        professorId: professorId,
      },
    });
    return context.json(professor, 200);
  } catch {
    return context.json("404 Error: Unable to delete professor data.", 404);
  }   
});

//post professor with proctorship
app.post("/professors/:professorId/proctorships", async (context) => {
  const professorId = context.req.param("professorId");
  const { studentId } = await context.req.json();
  try {
    const uniqueProfessorId = await prisma.professor.findUnique({
      where: {
        professorId: professorId,
      },
    });
    if (!uniqueProfessorId) {
      return context.json("404 Error: Unable to find professor data.", 404);
    }
    const student = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        proctorId: professorId,
      },
    });
    return context.json(student, 200);
  } catch {
    return context.json("404 Error: Unable to update student data.", 404);
  }
});

//get student with library membership
app.get("/students/:studentId/libraryMembership", async (context) => {
  const studentId = context.req.param("studentId");
  try {
    const uniqueStudentId = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!uniqueStudentId) {
      return context.json("404 Error: Unable to find student data.", 404);
    }
    const libraryMembership = await prisma.libraryMembership.findMany({
      where: {
        studentId: studentId,
      },
    });
    return context.json(libraryMembership, 200);
  } catch {
    return context.json("404 Error: Unable to update student data.", 404);
  }
});

//post students with library membership
app.post("/students/:studentId/libraryMembership", async (context) => {
  const studentId = context.req.param("studentId");
  const { issueDate, expiryDate } = await context.req.json();
  try {
    const uniqueStudentId = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!uniqueStudentId) {
      return context.json("404 Error: Unable to find student data.", 404);
    }
    const libraryMembership = await prisma.libraryMembership.create({
      data: {
        studentId: studentId,
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
    });
    return context.json(libraryMembership, 200);
  } catch {
    return context.json("404 Error: Unable to update student data.", 404);
  }
});

//update student with library membership
app.patch("/students/:studentId/libraryMembership", async (context) => {
  const studentId = context.req.param("studentId");
  const { issueDate, expiryDate } = await context.req.json();
  try {
    const uniqueStudentId = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!uniqueStudentId) {
      return context.json("404 Error: Unable to find student data.", 404);
    }
    const libraryMembership = await prisma.libraryMembership.update({
      where: {
        studentId: studentId,
      },
      data: {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
    });
    return context.json(libraryMembership, 200);
  } catch {
    return context.json("404 Error: Unable to update student data.", 404);
  }
});

//delete student with library membership
app.delete("/students/:studentId/libraryMembership", async (context) => {
  const studentId = context.req.param("studentId");
  try {
    const uniqueStudentId = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!uniqueStudentId) {
      return context.json("404 Error: Unable to find student data.", 404);
    }
    const libraryMembership = await prisma.libraryMembership.delete({
      where: {
        studentId: studentId,
      },
    });
    return context.json(libraryMembership, 200);
  } catch {
    return context.json("404 Error: Unable to update student data.", 404);    
  }
});

serve(app); 
