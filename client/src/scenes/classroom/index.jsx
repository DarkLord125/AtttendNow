import React, { useState, useEffect } from 'react';
import { TableData, TableInfo } from 'components/TableData';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import Header from "components/Header";
import { CSVLink, CSVDownload } from 'react-csv';
import {
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";

function Classroom() {
  const { className }  = useParams();
  const { palette } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classroom, setClassroom] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`http://localhost:5001/classroom/${className}`);
      console.log(response.data);
      setClassroom(response.data);
    }
    fetchData();
  }, [className, loading]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:4000/detect_faces', formData);
      const detectedFaceNames = response.data.detected_faces.map(face => face.name);
      const fetchedStudents = await Promise.all(detectedFaceNames.map(name => axios.get(`http://localhost:5001/student/${name}`)));
  
      // Assuming you have a Classroom model and a database connection
      const classroom = await axios.get(`http://localhost:5001/classroom/${className}/get`);
      if (!classroom.data) {
        console.error('Classroom not found!');
        setLoading(false);
        return;
      }
  
      // Append fetched student data to the classroom's students array
      const updatedStudents = [...fetchedStudents.map(student => student.data)];
      classroom.data.students = updatedStudents;
      await axios.put(`http://localhost:5001/classroom/${className}/put`, classroom.data);
  
      // Map the updated students to get just their names
      const studentNames = updatedStudents.map(student => student.name);
  
      setStudents(studentNames);
      setDetectedFaces(detectedFaceNames);
      setSelectedFile(null);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  

  return (
    <Box m="1.5rem 2.5rem">
		      <Header title={`${className}`} subtitle="Upload a photo" />
									<div className="flex flex-col px-80 mt-6 mb-4">
										<label className="flex flex-col mt-6">
											<span className="text-white font-semibold">Student Photo</span>
											<span className="text-white font-light">
												Upload a group photo of the class, the photo should contain all the students who have attended the class to record their attendance on the website.
											</span>
										</label>
                    <br/>
                    <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setSelectedFile(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!selectedFile ? (
                    <label className="flex flex-col items-center px-4 py-6 mt-2 rounded text-white cursor-pointer hover:text-purple-600 hover:border-purple-600">
                    <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-1 font-semibold">Choose a image</span>
                  </label>
                  ) : (
                    <FlexBetween>
                      <Typography>{selectedFile.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {selectedFile && (
                  <IconButton
                    onClick={() => setSelectedFile(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
										<button
											className="mt-6 flex flex-col items-center px-2 py-4 rounded text-white cursor-pointer bg-purple-800 hover:bg-yellow-500 focus:border-white"
											onClick={handleUpload}
										>
											<span className="font-semibold uppercase">Upload</span>
										</button>
              <br/><br/><br/>
                    {loading && <p>Loading...</p>} {/* display loading indicator when loading is true */}

									</div>
        <div className="flex flex-col px-80 mt-6 mb-4">
				<table className="min-w-full">
					<thead>
						<tr>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white ">
								ID
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white ">
							  Name
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white ">
								Roll Number
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left text-base font-bold leading-4 text-white ">
								Attendance Status 
							</th>
						</tr>
					</thead>
					<tbody className="">
						{classroom?.students?.map((student, index)  => (
							<tr>
								<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
									<div className="flex items-center">
										<div>
											<div className="text-sm leading-5 text-white">{index}</div>
										</div>
									</div>
								</td>
								<td className=" py-4 whitespace-no-wrap border-b border-gray-500">
									<div className="text-sm leading-5 text-white">{student.name}</div>
								</td>
								<td className="px-6 py-4 whitespace-no-wrap border-b text-white border-gray-500 text-sm leading-5">
									{student.rollNo}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap border-b text-white border-white text-sm leading-5">
									{TableInfo.active}
								</td>
							</tr>
						))}
					</tbody>
				</table>
        {/* <button   className="mt-6 flex flex-col items-center px-2 py-4 rounded text-white cursor-pointer bg-purple-800 hover:bg-yellow-500 focus:border-white">
          <span className="font-semibold uppercase">Generate Report</span>
        </button> */}

			</div>
  </Box>   
  );
}

export default Classroom;
