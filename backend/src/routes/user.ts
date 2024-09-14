import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const userRoute = express.Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});

userRoute.post("/signup", async function (req: Request, res: Response) {
  const response = signupSchema.safeParse(req.body);

  if (!response.success) {
    return res.status(411).json({
      message:
        "incorrect inputs password should have 6 characters & email should be valid type",
    });
  }

  const { email, password, firstName, lastName } = response.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
      },
    });

    res.status(201).json({
      message: "user created successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("unable to create new user", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default userRoute;
