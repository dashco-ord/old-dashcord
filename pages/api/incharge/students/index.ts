import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const maxLimit = 50;

const StudentsRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();
  if (req.method == "GET") {
    //@ts-ignore
    const page = parseInt(req.query?.page ?? "1") ?? 1; // @ts-ignore
    const limit = parseInt(req.query?.limit ?? "10") ?? 10; // @ts-ignore
    const fetchStats = req.query.stats == "true";
    const perPage = limit > maxLimit ? maxLimit : limit;
    const offset = (page - 1) * perPage;
    //@ts-ignore
    const yearFilter = parseInt(req.query.y) ?? 0;
    const sectionFilter = req.query.se;

    const query = {
      where: {
        //@ts-ignore
        year: yearFilter != 0 ? yearFilter : undefined,
        section: sectionFilter != "all" ? sectionFilter : undefined,
      },
    };

    try {
      //@ts-ignore
      const students = await prisma.student.findMany({
        ...query,
        include: {
          Tg: true,
        },
        orderBy: { rollNo: "asc" },
        skip: offset,
        take: perPage,
      });

      const resData = {
        students: students ?? [],
        limit: perPage,
        stats: {},
      };

      if (fetchStats) {
        //@ts-ignore
        const total = await prisma.student.count({ ...query });
        const totalSecond = await prisma.student.count({
          where: {
            year: 2,
          },
        });
        const totalThird = await prisma.student.count({
          where: {
            year: 3,
          },
        });
        const totalForth = await prisma.student.count({
          where: {
            year: 4,
          },
        });
        resData.stats = {
          total,
          totalSecond,
          totalThird,
          totalForth,
        };
      } else {
        // @ts-ignore
        resData.stats = undefined;
      }

      res.json(resData);
    } catch (error) {
      console.log(error);
    }
  }
};

export default StudentsRoute;
