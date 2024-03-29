import { Student, Tg } from "@prisma/client";
import axios from "axios";
import Layout from "components/Layout/TgLayout";
import Table from "components/Table/Table";
import { prisma } from "lib/prisma";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { refresh } from "@cloudinary/url-gen/qualifiers/artisticFilter";

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Student[]>();

  const assignStudent = async (rollNo: string) => {
    const data = {
      tgId: tg.id,
      rollNo: rollNo,
    };
    await axios.post("/api/incharge/students/updateTg", data);
  };

  const unassigStudent = async (rollNo: string) => {
    try {
      const res = await axios.post("/api/incharge/students/unallocateTg", {
        rollNo,
      });
      if (res.status == 200) {
        router.reload();
      }
    } catch (error) {
      //handle error
    }
  };

  const handleSearch = async () => {
    const res = await axios.post("/api/incharge/students/search", {
      data: searchQuery,
    });
    if (res.status == 200) {
      setResults(res.data);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.post("/api/incharge/deleteTg", { data: tg.id });
      if (res.status == 200) {
        router.push("/INCHARGE/tgs");
      }
    } catch (error) {
      //Handle Error
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 3) {
      handleSearch();
    }
  }, [searchQuery]);

  return (
    <Layout>
      <main>
        <div className='flex flex-wrap bg-white rounded-lg p-8'>
          <div className='flex flex-row-reverse'>
            <div>
              <div className='flex w-80 h-80 bg-slate-200 rounded-md ml-60'>
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
                <div className='flex flex-col pb-6 mr-4'>
                  <label className='text-2xl font-semibold mr-3 pb-2'>
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

        <div className='px-8 pb-8 bg-white rounded-b-lg'>
          {/*Search Bar*/}
          <div className='mb-8'>
            <h1 className='text-xl font-semibold pb-4'>Add new Students</h1>
            <form>
              <input
                className='w-[23.2rem]  border-slate-500 border-2 p-1 px-2 rounded'
                type='search'
                placeholder='Search by Student name or Email'
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {results && (
              <div className='z-20 fixed bg-white rounded w-fit min-w-[15rem] min-h-[4rem] border-2 border-slate-500'>
                <Table
                  title='Search Results'
                  headings={["Name", "Roll No", "Year", "Section"]}
                  noShadow={true}>
                  {results.map((student) => (
                    <tr key={student.rollNo}>
                      <td className='p-2 whitespace-nowrap text-violet-400 flex content-center'>
                        <button
                          className='pr-2 text-blue-700'
                          onClick={() => assignStudent(student.rollNo)}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                            />
                          </svg>
                        </button>
                        <Link href={`/INCHARGE/students/${student.rollNo}`}>
                          <a>{student.name}</a>
                        </Link>
                      </td>
                      <td className='p-2 whitespace-nowrap'>
                        {student.rollNo}
                      </td>
                      <td className='p-2 whitespace-nowrap'>{student.year}</td>
                      <td className='p-2 whitespace-nowrap'>
                        {student.section}
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
          </div>

          {/*Table Section*/}

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
            noShadow={true}
            refresh={() => router.reload()}>
            {students.map((student) => (
              <tr key={student.rollNo}>
                <td className='pl-2 p-2 whitespace-nowrap text-violet-400'>
                  <button
                    className='pr-2 text-red-700'
                    onClick={() => unassigStudent(student.rollNo)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M20 12H4'
                      />
                    </svg>
                  </button>
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
          <button
            className='flex items-center font-semibold bg-red-600 p-2 rounded-md text-white mt-10'
            onClick={() => handleDelete()}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 pr-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
            Delete TG
          </button>
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
