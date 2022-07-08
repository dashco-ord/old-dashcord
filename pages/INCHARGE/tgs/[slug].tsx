import { Student, Tg } from "@prisma/client";
import Layout from "components/Layout/TgLayout";
import Table from "components/Table/Table";
import { prisma } from "lib/prisma";
import Link from "next/link";

export const getServerSideProps = async (context: any) => {
  const { params } = context;
  const rawTG = await prisma.tg.findUnique({
    where: {
      id: params.slug,
    },
    include: {
      Student: true,
    },
  });
  return {
    props: {
      tg: JSON.parse(JSON.stringify(rawTG)),
      students: JSON.parse(JSON.stringify(rawTG?.Student)),
    },
  };
};

const SingleTgPage = ({ tg, students }: TgPageProps) => {
  return (
    <Layout>
      <main>
        <div className='flex flex-wrap bg-white rounded-lg p-8'>
          <div className='flex flex-row-reverse'>
            <div>
              <div className='flex w-80 h-80 bg-slate-200  rounded-md ml-60'>
                <img
                  //@ts-ignore
                  src={tg?.pictureUrl}
                  width={350}
                  height={350}
                />
              </div>
            </div>
            <div>
              <div className='flex'>
                <div className='flex flex-col pb-6 mr-8'>
                  <label className='text-2xl font-semibold mr-5 pb-2'>
                    Name :
                  </label>
                  <input
                    className='p-2 pl-0 rounded-sm bg-white text-xl border-b-2 border-b-gray-500 focus:outline-none focus:border-blue-500 transition ease-in-out delay-75 duration-75'
                    type='text'
                    placeholder='Enter your Name'
                    defaultValue={tg?.name}
                    required
                  />
                </div>
                <div className='flex flex-col pb-6 mr-8'>
                  <label className='text-2xl font-semibold mr-5 pb-2'>
                    Phone.no :
                  </label>
                  <input
                    className='p-2 pl-0 rounded-sm bg-white text-xl border-b-2 border-b-gray-500 focus:outline-none focus:border-blue-500 transition ease-in-out delay-75 duration-75'
                    type='text'
                    placeholder='Enter your Roll.No'
                    //@ts-ignore
                    defaultValue={tg?.phoneNo}
                    required
                  />
                </div>
                <div className='flex flex-col pb-6 mr-8'>
                  <label className='text-2xl font-semibold mr-5 pb-2'>
                    Email :
                  </label>
                  <input
                    className='w-96 p-2 pl-0 rounded-sm bg-white text-xl border-b-2 border-b-gray-500 focus:outline-none focus:border-blue-500 transition ease-in-out delay-75 duration-75'
                    type='email'
                    placeholder='Enter your Email'
                    defaultValue={tg?.email}
                    required
                  />
                </div>
              </div>

              <div className='flex'>
                <div className='flex flex-col pb-6 mr-8'>
                  <label className='text-2xl font-semibold mr-5 pb-2'>
                    Department :
                  </label>
                  <input
                    className='p-2 pl-0 rounded-sm bg-white text-xl border-b-2 border-b-gray-500 focus:outline-none focus:border-blue-500 transition ease-in-out delay-75 duration-75'
                    type='text'
                    placeholder='Enter your Department'
                    //@ts-ignore
                    defaultValue={tg?.department}
                    required
                  />
                </div>

                <div className='flex flex-col pb-6 mr-8'>
                  <label className='text-2xl font-semibold mr-5 pb-2'>
                    Gender :
                  </label>
                  <input
                    className='p-2 pl-0 rounded-sm bg-white text-xl border-b-2 border-b-gray-500 focus:outline-none focus:border-blue-500 transition ease-in-out delay-75 duration-75'
                    type='text'
                    placeholder='Enter your Gender'
                    //@ts-ignore
                    defaultValue={tg?.gender}
                    required
                  />
                </div>
              </div>
              <div className='flex'>
                <div className='flex flex-col pb-6 mr-8'>
                  <label className='text-2xl font-semibold mr-5 pb-2 w-fit'>
                    Bio :
                  </label>
                  <input
                    className='p-2 pl-0 rounded-sm bg-white text-xl border-b-2 border-b-gray-500 focus:outline-none focus:border-blue-500 transition ease-in-out delay-75 duration-75'
                    type='text'
                    placeholder='Enter your Bio'
                    //@ts-ignore
                    defaultValue={tg?.bio}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='pl-8 pb-8 bg-white rounded-b-lg'>
          <div className='mb-10'>
            <form>
              <input
                className='border-slate-500 border p-1 px-2 rounded'
                type='search'
                placeholder='Search by Student name or Email'
              />
            </form>
          </div>
          <Table
            title='Allocated Students'
            headings={[
              "name",
              "rollNo",
              "email",
              "gender",
              "department",
              "year",
              "section",
            ]}
            noShadow={true}>
            {students.map((student) => (
              <tr key={student.rollNo}>
                <td className='pl-2 p-2 whitespace-nowrap text-violet-400'>
                  <input type='checkbox' />
                  <Link href={`/INCHARGE/students/${student.rollNo}`}>
                    <a className='pl-2'>{student.name}</a>
                  </Link>
                </td>
                <td className='p-2 whitespace-nowrap'>{student.rollNo}</td>
                <td className='p-2 whitespace-nowrap text-indigo-300'>
                  <a href={`mailto:${student.email}`}>{student.email}</a>
                </td>
                <td
                  className={`mt-1.5 inline-flex font-medium rounded-full text-center px-2.5 py-0.5`}>
                  {student.gender}
                </td>
                <td className='p-2 whitespace-nowrap'>{student.department}</td>
                <td className='p-2 whitespace-nowrap'>{student.year}</td>
                <td className='p-2 whitespace-nowrap'>{student.section}</td>
              </tr>
            ))}
          </Table>
        </div>
      </main>
    </Layout>
  );
};

export default SingleTgPage;

type TgPageProps = {
  tg: Tg;
  students: Student[];
};
