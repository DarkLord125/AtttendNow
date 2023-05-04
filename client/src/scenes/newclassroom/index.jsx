import React, { useState } from 'react';
import Header from "components/Header";
import { Box} from "@mui/material";
import { DatePicker, TimePicker } from "antd";
import toast, { Toaster } from 'react-hot-toast';
import { createClassroom } from 'helper/helper';

function NewClassroom() {
  const [courseName, setCourseName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState([]);

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date.format('YYYY-MM-DD')));
  };
  
  const handleTimeRangeChange = (time) => {
    const startTime = time[0].format('HH:mm');
    const endTime = time[1].format('HH:mm');
    setTimeRange([startTime, endTime]);
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Validate course name
    if (courseName.trim() === '') {
      toast.error('Please enter a valid course name');
      return;
    }
  
    // Validate selected date
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
  
    // Validate time range
    if (timeRange.length !== 2 || !timeRange[0] || !timeRange[1]) {
      toast.error('Please select a valid time range');
      return;
    }
  
    console.log('Course name:', courseName);
    console.log('Selected date:', selectedDate);
    console.log('Time range:', timeRange);
  
    const classroomData = {
      name: courseName,
      date: selectedDate.toISOString().slice(0, 10),
      startTime: timeRange[0],
      endTime: timeRange[1]
    };
  
    // Show a loading spinner while the classroom is being created
    const promise = createClassroom(classroomData);
    const loadingToastId = toast.loading('Creating classroom...');
  
    promise
      .then((classroom) => {
        toast.success('Classroom created successfully!');
        // Do something with the newly created classroom object
        console.log(classroom);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Could not create classroom');
      })
      .finally(() => {
        // Remove the loading spinner once the classroom creation is complete
        toast.dismiss(loadingToastId);
      });
  };
  
  return (	
    <Box m="1.5rem 2.5rem">
		<Toaster position="top-center" reverseOrder={false} />
      <Header title="NEW CLASSROOM" subtitle="Create New Classroom" />
      <div className="p-6">
          <div className="w-full px-6">
            <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className=" w-full pr-4 max-w-full flex-grow flex-auto">
                  </div>
                </div>
                <div className="flex flex-col px-80 mt-6 mb-4">
				<label className="flex flex-col justify-center">
  				  <span className="text-white font-semibold mb-1">Class/Course Name</span>
  					<input
    					type="text"
    					value={courseName}
    					onChange={handleCourseNameChange}
    					className="text-box mt-1 block rounded h-10 px-4 text-black border border-gray-300 focus:outline-none focus:border-purple-800"
   						placeholder="eg: Artificial Intelligence"
  					/>
				</label>
                  <label className="flex flex-col mt-6 ">
                    <span className="text-white font-semibold">Pick a date</span>
                    <DatePicker
                      className='w-full mt-2 h-10'
                      onChange={handleDateChange}
                    />
                  </label>
				  <label className="flex flex-col mt-6 ">
                    <span className="text-white font-semibold">Pick a time</span>
					<TimePicker.RangePicker
                      className='w-full mt-2 h-10'
                      format='h:mm a'
                      onChange={handleTimeRangeChange}
                    />
                  </label>
				  <button
  					className="mt-6 flex items-center justify-center px-6 py-3 rounded bg-purple-800 text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
  					onClick={handleSubmit}
				  >
     				<span className="font-semibold uppercase">Save</span>
				  </button>

                </div>
              </div>
            </div>
          </div>
      </div>
    </Box>
  );
}

export default NewClassroom;
