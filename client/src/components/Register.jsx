import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { registerValidate } from '../helper/validate';
import { registerUser } from '../helper/helper'
// import Logo from '../assets/Logo.png'


import styles from '../styles/Login.module.css';

const Register = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate : registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { role : ''})
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success : <b>Register Successfully...!</b>,
        error : <b>Could not Register.</b>
      });

      registerPromise.then(function(){ navigate('/')});
    }
  })

  return (
    <>
      <div className=" bg-white flex flex-row gap-20">
        <Toaster position="top-center" reverseOrder={false} />

        <div
          className="w-1/2 h-screen bg-cover bg-center"
          style={{ backgroundImage: 'url(https://img.freepik.com/premium-vector/face-recognition-concept-design-can-use-web-banner-infographics-hero-images_100456-7355.jpg?w=740', 
        //   backgroundPosition: 'left 1px center',
        }}
        >
        </div>

        <div className="w-1/3 h-screen flex justify-end items-center">
          <div className={styles.glass} style={{ width: "45%", paddingTop: '3em'}}>

            <div className="title flex flex-col items-center">
              <h4 className="text-3xl font-bold text-white">Register Now</h4>
              <span className="py-4 text-xl w-2/3 text-center text-indigo-200">
              Stay on top of attendance with ease - register now.
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="textbox flex flex-col items-center gap-6">
              <input
                  {...formik.getFieldProps('email')}
                  className={styles.textbox}
                  type="email"
                  placeholder="Email"
                />
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
                  Register
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-white">
                Already Register? <Link className="text-red-500" to="/login">Login Now</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
