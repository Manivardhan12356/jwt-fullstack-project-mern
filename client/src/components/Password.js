import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avator from '../assests/profile.png'
import styles from '../styles/Username.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidates } from '../helper/validate';
import { useAuthStore } from '../store/store';
import { verifyPassword } from '../helper/helper';
import useFetch from '../hooks/fetch.hook';


export default function Password() {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);

  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: ""
    },
    validate: passwordValidates,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        const loginPromise = verifyPassword({ username, password: values.password });
        toast.promise(loginPromise, {
          loading: "Checking...",
          success: <b>Login Successfully!</b>,
          error: <b>Password Not Match!</b>
        });

        const res = await loginPromise;
        const { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile');
      } catch (error) {
        console.error(error);
        toast.error("An error occurred during login");
      }
    }
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore more by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avator} className={styles.profile_img} alt="avatar" />
            </div>

            <div className='textbox flex flex-col items-center gap-6'>
              <input
                type="text" // corrected input type
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                placeholder='Password' // corrected typo
              />
              <button className={styles.btn} type='submit'>Sign in</button>
            </div>

            <div className="text-center py-4">
              <span>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
