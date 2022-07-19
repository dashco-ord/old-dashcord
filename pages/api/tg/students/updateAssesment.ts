import { UserRole } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const updateAssesment = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (req.method == "POST") {
    if (session?.role == UserRole.TG) {
      const data = await req.body;
      console.log(data);
      res.status(200).end();
    }
    res.status(401).end();
  }
  res.status(405).end();
};

export default updateAssesment;
