import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

const unallocateTg = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { rollNo } = await req.body;
    try {
      await prisma.student.update({
        where: { rollNo: rollNo },
        data: { tgId: null },
      });
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
  res.status(405).end();
};

export default unallocateTg;
