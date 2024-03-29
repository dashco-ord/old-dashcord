import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

const updateTg = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { rollNo, tgId } = await req.body;
    try {
      await prisma.student.update({
        where: { rollNo: rollNo },
        data: { tgId: tgId },
      });
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
  res.status(405).end();
};

export default updateTg;
