import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avator from '../assests/profile.png'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'

export default function Register() {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: ""
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        values = await Object.assign(values, { profile: file || '' });
        const registerSubmit = registerUser(values);
        toast.promise(registerSubmit, {
          loading: 'Registering...',
          success: <b>Registration Successful!</b>,
          error: (err) => {
            const message = typeof err === 'object' && err.error ? err.error.message : 'Registration Unsuccessful';
            return <b>{message}</b>;
          }
        });
        await registerSubmit;
        navigate('/');
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }

    }
  }
  )

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '3em' }}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to join you!
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={file || avator} className={styles.profile_img} alt="avatar" />
              </label>
              <input type="file" onChange={onUpload} name="profile" id="profile" />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input type="text" {...formik.getFieldProps('email')} className={styles.textbox} placeholder='Email' />
              <input type="text" {...formik.getFieldProps('username')} className={styles.textbox} placeholder='User Name' />
              <input type="text" {...formik.getFieldProps('password')} className={styles.textbox} placeholder='Passowrd' />
              <button className={styles.btn} type='submit'>Register</button>
            </div>
            <div className="text-center py-4">
              <span>Already Register? <Link className='text-red-500' to="/">Log Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


