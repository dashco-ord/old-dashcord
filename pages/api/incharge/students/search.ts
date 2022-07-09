import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

const searchStudents = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const searchQuery = await req.body.data;
    const students = await prisma.student.findMany({
      where: { name: { contains: searchQuery } },
    });
    res.json(students);
    res.status(200);
  }
  res.status(405);
};

export default searchStudents;
