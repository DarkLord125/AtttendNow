import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {themeSettings} from "theme";
import {useSelector} from "react-redux";
import {useMemo} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "scenes/dashboard";
import Classroom from "scenes/classroom";
import NewClassroom from "scenes/newclassroom";
import Layout from "scenes/layout";
import Login from "components/Login";
import Register from "components/Register";
import Recovery from "components/Recovery";
import Reset from "components/Reset";
import RecoveryUsername from "components/RecoveryUsername";
import { AuthorizeUser } from './middleware/auth'
import AllStudents from "scenes/allstudents";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)),[mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
            <Routes>
            <Route path='/register' element={<Register/>} />
            <Route path='/recoveryusername' element={<RecoveryUsername/>} />
            <Route path='/recovery' element={<Recovery/>} />
            <Route path='/reset' element={<Reset/>} />
            <Route path='/login' element={<Login/>} />
            <Route path="/" element={<Navigate to="/login" replace />}/>
              <Route element={<Layout/>}>
                <Route path="/dashboard" element={<AuthorizeUser><Dashboard/></AuthorizeUser>}/>
                <Route path="/classrooms/:className" element={<AuthorizeUser><Classroom/></AuthorizeUser>}/>
                <Route path="/new classroom" element={<AuthorizeUser><NewClassroom/></AuthorizeUser>}/>
                <Route path="/all students" element={<AuthorizeUser><AllStudents/></AuthorizeUser>}/>
              </Route>
            </Routes>
    </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
