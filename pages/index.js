import Head from 'next/head'
import { PlusCircleIcon, TrashIcon, UploadIcon, UserIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export default function Main() {
  const [students, setStudents] = useState([['M', 'John Doe', 37]]);
  const [name, setName] = useState("");
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [gender, setGender] = useState('F');

  function addStudent() {
    setStudents(old => [...old, [gender, name, parseInt(year) * 12 + parseInt(month)]]);
    setName("");
    setYear(0);
    setMonth(0);
    setGender('F');
  }

  function deleteStudent(index) {
    const arr = students.filter((_, i) => i !== index);
    setStudents(arr);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Class Partition GA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:flex-grow sm:grid-cols-2 gap-6">
          <div className="flex flex-col sm:flex-grow col-span-2 sm:col-span-1 sm:w-2/5 p-8">
            <div className="flex flex-row items-center justify-between">
              <div className="text-xl font-bold">Student List</div>
              <div className="flex flex-row space-x-2">
                {/* <button className="inline-flex items-center px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none cursor-pointer">
                  <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add
                </button> */}
                <button className="inline-flex items-center px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none cursor-pointer">
                  <UploadIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Import
                </button>
              </div>
            </div>

            <div className="flex-grow rounded-lg border mt-4">
              <div className="relative h-full">
                <div className="sm:absolute border border-black w-full h-full overflow-scroll rounded-lg">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="min-w-full text-black border-b border-black sticky top-0 z-10">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 w-2/3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 w-1/3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Age
                        </th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-scroll min-w-full bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-5 py-3">
                          <div className="flex flex-row items-center space-x-2">
                            <UserIcon onClick={() => setGender(gender === 'F' ? 'M' : 'F')}
                              className={gender === 'M' ? "h-4 w-4 text-blue-500 cursor-pointer" : "h-4 w-4 text-pink-500 cursor-pointer"} />
                            <input id="student_name" type="text" autoComplete="off" placeholder="Add a new student..." value={name} onChange={(e) => setName(e.target.value)}
                              className="text-xs font-medium text-gray-400 uppercase tracking-wide focus:outline-none"></input>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-center justify-start">
                              <input id="student_year" type="number" autoComplete="off" min="0" max="100" value={year} onChange={(e) => setYear(e.target.value)}
                                className="text-xs font-medium text-gray-400 uppercase tracking-wide focus:outline-none w-8"></input>
                              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide mr-4">yr</p>
                              <input id="student_month" type="number" autoComplete="off" min="0" max="12" value={month} onChange={(e) => setMonth(e.target.value)}
                                className="text-xs font-medium text-gray-400 uppercase tracking-wide focus:outline-none w-8"></input>
                              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide">mo</p>
                            </div>
                            <PlusCircleIcon onClick={addStudent} className="h-5 w-5 cursor-pointer" />
                          </div>
                        </td>
                      </tr>

                      {students && students.map((s, i) => (
                        <tr key={s[1]} className="hover:bg-gray-50">
                          <td className="px-5 py-3">
                            <div className="flex flex-row items-center space-x-2">
                              <UserIcon className={s[0] === 'M' ? "h-4 w-4 text-blue-500" : "h-4 w-4 text-pink-500"} />
                              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide">{s[1]}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex flex-row items-center justify-between">
                              <p className="text-xs font-medium text-gray-900 uppercase tracking-wide">{Math.floor(s[2] / 12)} yr {s[2] % 12} mo</p>
                              <TrashIcon onClick={() => deleteStudent(i)}
                                className="h-4 w-4 text-gray-300 cursor-pointer" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-grow col-span-2 sm:col-span-1 sm:w-3/5 p-8">

          </div>
        </div>
      </main>

      <footer className="flex flex-row items-center justify-between h-16 p-4 text-xs text-gray-500 bg-gray-200">
        <div className="flex flex-col">
          <p className="font-bold">Genetic Algorithm for Class Partitioning</p>
          <p>As a project assignment of CS454 AI Based Software Engineering</p>
          <p>Developed by Guntitat Sawadwuthikul</p>
        </div>
        <div className="flex flex-row">
          <a className="hover:underline cursor-pointer">GitHub</a>
        </div>
      </footer>
    </div>
  )
}
