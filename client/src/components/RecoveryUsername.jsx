import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import avatar from '../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../state/store'
import styles from '../styles/Login.module.css';

export default function RecoveryUsername() {


  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      setUsername(values.username);
      navigate('/recovery');
    }
  })


  return (
    <div className="container mx-auto bg-white">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-3xl font-bold'>Recovery Username</h4>
            <span className='py-4 text-xl w-2/3 text-center text-indigo-200'>
              Type Your Username to get OTP in your registered email address
            </span>
          </div>

          <form className='py-10' onSubmit={formik.handleSubmit}>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' />
                  <button className={styles.btn} type='submit'>Get OTP</button>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}