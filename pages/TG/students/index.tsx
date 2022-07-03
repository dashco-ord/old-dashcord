import Layout from "components/Layout/TgLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { Student } from "@prisma/client";
import Table from "components/Table/Table";
import Card from "components/cards/Card";
import Toast, { ToastParams } from "components/Toast";
import Link from "next/link";
import readXlsxFile from "read-excel-file";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [xlFile, setXlFile] = useState();
  const [toast, setToast] = useState<ToastParams>();

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/tg/students");

      setStudents(res.data);
    } catch (e) {
      setToast({
        type: "error",
        message: "There was an error while fetching the students",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const genderColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "text-white bg-purple-800";
      case "female":
        return "text-white bg-pink-800";
    }
  };

  const handelXls = async (e) => {
    e.preventDefault();
    //@ts-ignore
    readXlsxFile(xlFile).then((row) => {
      console.log(row);
    });
  };

  return (
    <Layout>
      <div>
        {toast && (
          <Toast
            type={toast.type}
            className='mb-5'
            open={true}
            setOpen={() => setToast(undefined)}>
            {toast.message}
          </Toast>
        )}
      </div>

      <div className='flex mb-10'>
        <Card title='All Students' value={students.length} />
      </div>

      <Table
        title='All Students'
        headings={["name", "rollNo", "email", "gender", "department"]}>
        {students.map((student) => (
          <tr key={student?.rollNo}>
            <td className='pl-5 p-2 whitespace-nowrap text-violet-700'>
              <Link href={`/TG/students/${student?.rollNo}`}>
                <a>{student?.name}</a>
              </Link>
            </td>
            <td className='p-2 whitespace-nowrap'>{student?.rollNo}</td>
            <td className='p-2 whitespace-nowrap text-indigo-500'>
              <a href={`mailto:${student?.email}`}>{student?.email}</a>
            </td>
            <td
              className={`mt-1.5 inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${genderColor(
                //@ts-ignore
                student.gender
              )}`}>
              {student.gender}
            </td>
            <td className='p-2 whitespace-nowrap'>{student.department}</td>
          </tr>
        ))}
      </Table>
      <div className='mt-5'>
        <form onSubmit={handelXls}>
          <input
            type='file'
            onChange={(e) =>
              setXlFile(
                //@ts-ignore
                e.target.files[0]
              )
            }
          />
          <input type='submit' />
        </form>
      </div>
    </Layout>
  );
};

export default StudentsPage;
