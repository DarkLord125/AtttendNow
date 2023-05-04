import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { loginValidate } from '../helper/validate';
import { verifyPassword } from '../helper/helper';
import { useAuthStore } from '../state/store'
// import Logo from '../assets/Logo.png'
import styles from '../styles/Login.module.css';


const Login = () => {

  const navigate = useNavigate()
  const setUsername = useAuthStore(state => state.setUsername);
  const { username } = useAuthStore(state => state.auth)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      setUsername(values.username);

      let loginPromise = verifyPassword({ username, password : values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success : <b>Login Successfully...!</b>,
        error : <b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/dashboard')
      })
    }
  })


  return (
    <>
      <div className=" bg-white flex flex-row gap-20">
        <Toaster position="top-center" reverseOrder={false} />

        <div
          className="w-1/2 h-screen bg-cover bg-center"
          style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/verification-technologies-abstract-concept-illustration_335657-3894.jpg?w=740&t=st=1681626239~exp=1681626839~hmac=02a22e47ed5751b75c17cc2a4c9bb4bea2f51d3b7e40f61319330357f3275d3a', 
          backgroundPosition: 'left 40px center',
        }}
        >
        </div>

        <div className="w-1/3 h-screen flex justify-end items-center">
          <div className={styles.glass} style={{ width: "45%", paddingTop: '3em'}}>

            <div className="title flex flex-col items-center">
              <h4 className="text-3xl font-bold text-white">Welcome Back</h4>
              <span className="py-4 text-xl w-2/3 text-center text-indigo-200">
              Get a grip on your attendance records - login today.
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="textbox flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps('username')}
                  className={styles.textbox}
                  type="text"
                  placeholder="Username"
                />
                <input
                  {...formik.getFieldProps('password')}
                  className={styles.textbox}
                  type="password"
                  placeholder="Password"
                />
                <button className={styles.btn} type="submit">
                  Login
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-white">
                  Not a Member? <Link className="text-red-500" to="/register">Register Now</Link>
                </span>
              </div>
              <div className="text-center py-4">
                <span className='text-white-500'>Forgot Password? <Link className='text-red-500' to="/recoveryusername">Recover Now</Link></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
