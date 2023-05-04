import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "components/Header";
import {
    Box,
} from "@mui/material";
import { getallClassrooms } from 'helper/helper';


const Dashboard = () => {

    const [classrooms, setClassrooms] = useState([]);

    const loadCourses = async () => {
        try {
            const { data } = await getallClassrooms();
            setClassrooms(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const formatTime = (time) => {
        const date = new Date(`January 1, 2022 ${time}`);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="DASHBOARD" subtitle="" />
            {/* <div className="w-full pr-4 mb-16 max-w-full flex-grow flex-auto">
                <span className="flex justify-center uppercase text-white mr-0 whitespace-no-wrap text-3xl font-bold px-0">
                    Current Classes
                </span>
                <span className="flex justify-center text-white mr-0 whitespace-no-wrap text-sm pt-2">
                    Current courses will be showed here
                </span>
            </div> */}
            <div className="flex flex-wrap px-2">
                {classrooms.map((classroom, index) => (
                    <div className="w-full lg:w-6/12 xl:w-6/12 px-4 py-4" id={index}>
                        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg">
                            <div className="flex-auto p-4">
                                <div className="flex flex-wrap justify-between">
                                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                        <h5 className="text-gray-800 uppercase font-bold text-lg">
                                            {classroom.name}
                                        </h5>
                                        <div className="flex items-center mt-2">
                                            <span className="text-black text-sm">
                                               Time: {formatTime(classroom.startTime)}
                                            </span>
                                            <span className="mx-2 text-black text-sm">
                                                -
                                            </span>
                                            <span className="text-black text-sm">
                                                {formatTime(classroom.endTime)}
                                            </span>
                                        </div>
                                        <span className="mt-4 text-sm text-black">
                                            Date:  {new Date(classroom.date).toLocaleDateString("en-GB")}
                                        </span>
                                        <p className="mt-8">
                                          <Link to={`/classrooms/${classroom.name}`}>
                                            <button className="bg-purple-800 text-white rounded p-2 font-bold text-base transition duration-300 hover:bg-yellow-500">
                                              Show Details
                                            </button>
                                          </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    )
};

export default Dashboard;
