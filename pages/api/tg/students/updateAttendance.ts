import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const updateAttendance = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (req.method == "POST") {
    const { data, year } = await req.body;
    console.log(data, year);
  }
};

export default updateAttendance;
