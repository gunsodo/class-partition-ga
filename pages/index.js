import Head from 'next/head'
import { ChevronDoubleRightIcon, PlusCircleIcon, TrashIcon, UploadIcon, UserIcon, XIcon } from '@heroicons/react/solid'
import { createRef, useState } from 'react'
import { Workbook } from 'exceljs';

import { Population } from '../lib/ga';
import Chart from 'react-google-charts';

export default function Main() {
  const [students, setStudents] = useState([
    ['M', 'John Doe', 37],
    ['M', 'Jxhn Doe', 35],
    ['M', 'Joe Low', 34],
    ['F', 'Jane Doe', 40],
    ['F', 'Jane Dxe', 39],
    ['F', 'Susie High', 35],
  ]);
  const [name, setName] = useState("");
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [gender, setGender] = useState('F');
  let file = createRef();

  const [numClasses, setNumClasses] = useState(4);
  const [capacity, setCapacity] = useState(10);
  const [numSteps, setNumSteps] = useState(50);

  const [popArray, setPopArray] = useState([]);
  const [studentsByClass, setStudentByClass] = useState();
  const [fitnessHistory, setFitnessHistory] = useState([['Steps', 'Standard Deviation']]);

  // GA
  var population;

  function evolve() {
    const malesArray = students.filter(a => a[0] === 'M');
    const femalesArray = students.filter(a => a[0] === 'F');

    population = new Population(malesArray, femalesArray, capacity, numClasses);
    population.initialize();

    var tempFitnessHistory = [['Steps', 'Standard Deviation']];

    for (var i = 0; i < numSteps; i++) {
      population.step();
      tempFitnessHistory.push([i + 1, population.population[0].fitness]);

      if (population.population[0].fitness <= 0) break;
    }
    setFitnessHistory(tempFitnessHistory);
    setPopArray(population.population);

    // initialize classes array
    var classesArray = []
    for (var i = 0; i < numClasses; i++) {
      classesArray = [...classesArray, []];
    }

    // separate into classes
    const bestChromosome = population.population[0];
    bestChromosome.male.map((classNum, i) => {
      const student = population.malesArray[i];
      classesArray[classNum].push(student);
    })

    bestChromosome.female.map((classNum, i) => {
      const student = population.femalesArray[i];
      classesArray[classNum].push(student);
    })

    setStudentByClass(classesArray);
  }

  function reset() {
    population = null;
    setPopArray([]);
    setStudentByClass();
    setFitnessHistory([]);
  }

  // UI
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

  function importStudents() {
    const wb = new Workbook();
    const reader = new FileReader();

    reader.readAsArrayBuffer(file.current.files[0]);
    reader.onload = () => {
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        workbook.eachSheet((sheet) => {
          sheet.eachRow((row) => {
            let array = row.values;
            array.shift();
            setStudents(old => [...old, array]);
          })
        })
      })
    }
  }

  function resetAll() {
    setStudents([]);
    reset();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Class Partition GA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col flex-1 p-8">
        <div className="flex flex-col sm:flex-row sm:flex-grow sm:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="flex flex-col sm:flex-grow col-span-2 sm:col-span-1 sm:w-2/5">
            <div className="flex flex-row items-center justify-between">
              <div className="text-xl font-bold">Student List</div>
              <div className="flex flex-row space-x-2">
                <button onClick={resetAll}
                  className="inline-flex items-center px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none cursor-pointer">
                  <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Reset
                </button>
                <label htmlFor="file_upload" className="inline-flex items-center px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none cursor-pointer">
                  <UploadIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Import
                </label>
                <input onChange={importStudents} id="file_upload" type="file" className="hidden" ref={file}></input>
              </div>
            </div>

            <div className="flex-grow rounded-lg border mt-4">
              <div className="relative h-full">
                <div className="sm:absolute border border-black w-full h-full overflow-scroll rounded-lg">
                  <table className="w-full divide-y divide-gray-200 border-collapse">
                    <thead className="min-w-full bg-white text-black border-b border-black sticky top-0 z-10">
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

          {/* Right Panel */}
          <div className="flex flex-col sm:flex-grow col-span-2 sm:col-span-1 sm:w-3/5">
            <div className="flex flex-row items-center justify-between">
              <div className="text-xl font-bold">Results</div>
              <div className="flex flex-row flex-wrap space-x-2">
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-start sm:justify-between px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium">
                  <div className="flex flex-row sm:w-1/3">
                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide mr-2">Steps</p>
                    <input type="number" autoComplete="off" min="1" max="100" value={numSteps} onChange={(e) => setNumSteps(parseInt(e.target.value))}
                      className="text-xs font-medium text-gray-400 uppercase tracking-wide focus:outline-none w-8"></input>
                  </div>
                  <div className="flex flex-row sm:w-1/3">
                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide mr-2">Rooms</p>
                    <input type="number" autoComplete="off" min="2" max="10" value={numClasses} onChange={(e) => setNumClasses(parseInt(e.target.value))}
                      className="text-xs font-medium text-gray-400 uppercase tracking-wide focus:outline-none w-8"></input>
                  </div>
                  <div className="flex flex-row sm:w-1/3">
                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide mr-2">Capacity</p>
                    <input type="number" autoComplete="off" min="3" max="20" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))}
                      className="text-xs font-medium text-gray-400 uppercase tracking-wide focus:outline-none w-8"></input>
                  </div>
                </div>
                <button onClick={reset}
                  className="inline-flex items-center px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none cursor-pointer">
                  <XIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Clear
                </button>
                <button onClick={evolve}
                  className="inline-flex items-center px-4 py-2 border border-black rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 focus:outline-none cursor-pointer">
                  <ChevronDoubleRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Evolve
                </button>
              </div>
            </div>

            <div className="flex-grow rounded-lg mt-4">
              <div className="relative h-full">
                <div className="sm:absolute w-full h-full">
                  <div className="flex w-full h-full">
                    {fitnessHistory.length > 1 ? (
                      <Chart
                        chartType="LineChart"
                        width={"100%"}
                        height={"100%"}
                        loader={<div>Loading...</div>}
                        data={fitnessHistory}
                        options={{
                          hAxis: { title: 'Step' },
                          vAxis: { title: 'STD' },
                          legend: { position: 'none' },
                        }}
                      />) :
                      (<div className="flex flex-grow w-full h-full justify-center items-center text-gray-400">
                        Click the "Evolve" button to see the results
                      </div>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow rounded-lg border mt-4">
              <div className="relative h-full">
                <div className="sm:absolute border border-black w-full h-full overflow-scroll rounded-lg">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="min-w-full bg-white text-black border-b border-black sticky top-0 z-10">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 w-2/3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Best Solution
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 w-2/3 text-right text-xs font-medium uppercase tracking-wider"
                        >
                          Fitness: {popArray && popArray[0] && Math.round(popArray[0].fitness * 1000) / 1000}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-scroll min-w-full bg-white divide-y divide-gray-200">
                      {studentsByClass && studentsByClass.map((classes, i) => (
                        <tr key={"class" + i} className="hover:bg-gray-50">
                          <td colSpan={2} className="px-5 py-3">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex flex-row justify-between items-center col-span-3">
                                <p className="text-sm font-bold text-gray-900 mb-2">{"Class " + (i + 1)}</p>
                                <p className="text-sm font-bold text-gray-900 mb-2">{"Age sum: " + (popArray && popArray[0] && popArray[0].sumArray[i])}</p>
                              </div>
                              {classes && classes.map((student) => (
                                <div key={student[1]} className="flex flex-row items-center space-x-2 col-span-3 sm:col-span-1">
                                  <UserIcon className={student[0] === 'M' ? "h-4 w-4 text-blue-500" : "h-4 w-4 text-pink-500"} />
                                  <p className="text-xs font-medium text-gray-900">{student[1]}</p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex flex-row items-center justify-between h-20 sm:h-16 p-4 text-xs text-gray-500 bg-gray-200">
        <div className="flex flex-col">
          <p className="font-bold">Genetic Algorithm for Class Partitioning</p>
          <p>As a project assignment of CS454 AI Based Software Engineering</p>
          <p>Developed by Guntitat Sawadwuthikul</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap sm:space-x-4">
          <a href="https://gunsodo.github.io/" target="_blank" className="hover:underline cursor-pointer">Website</a>
          <a href="https://github.com/gunsodo" target="_blank" className="hover:underline cursor-pointer">GitHub</a>
        </div>
      </footer>
    </div>
  )
}
