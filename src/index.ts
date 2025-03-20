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
  const { name, dateOfBirth, aadharNumber, proctorId } =
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
        aadharNumber: aadharNumber,
        proctorId: proctorId,
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
        proctorId: professorId,
      },
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

//

serve(app); 
