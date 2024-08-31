
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setUserInfo } from '../redux/userSlice';
import { sendToast } from '../redux/toastSlice';


const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((store)=>store.user.isLoggedIn)

  if (isLoggedIn){
    navigate('/')
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/login/', {
        cred:emailOrPhone,
        password: password,
      });
      
      if (response.data.status===200){
        dispatch(setLogin(true))
        dispatch(setUserInfo({'email':response.data.user.email,'name':response.data.user.name}))
        localStorage.setItem('jwt',response.data.jwt)
        dispatch(sendToast("Welcome , "+response.data.user.name))
        navigate('/');
      }
      else{
        dispatch(sendToast("Some Error Occured while Logging IN"))
      }
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrMsg(error.response.data.message); 
      } else {
        setErrMsg('An unexpected error occurred.');
      }
    }
  };

  const handleGoogleAuth = async (googleUser) => {
    try {
      const token = googleUser.credential;
      const response = await axios.post('http://localhost:8000/api/v1/google-auth/', {
        token: token
      });

      if (response.data.status===200){
              dispatch(setLogin(true));
              dispatch(setUserInfo({
                email: response.data.email,
                name: response.data.name,
              }));
        localStorage.setItem('jwt',response.data.jwt)
        dispatch(sendToast("Welcome , "+response.data.name))
        navigate('/');
      }
      else{
        dispatch(sendToast("Some Error Occured while google Login"))
      }

    } catch (error) {
      if (error.response && error.response.data) {
        setErrMsg(error.response.data.error || 'An error occurred.');
      } else {
        console.log(error)
        setErrMsg('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#181818] to-[#121111]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#212529] rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        <div>
          <label htmlFor="email-or-username" className="block text-sm font-medium text-white">
            Email or Phone Number <sup className='text-red-500 text-base'>*</sup>
          </label>
          <input
            id="email-or-phone"
            name="email-or-phone"
            type="text"
            required
            placeholder="Enter your email or phone number"
            className=" w-full px-3 py-2 mt-1 text-white outline-none bg-[#4e4b48] border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-white">
            Password <sup className='text-red-500 text-base'>*</sup>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            className=" outline-none bg-[#4e4b48] w-full px-3 py-2 mt-1 text-black  border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-2 text-sm text-left">
            <Link to="/forgot-password" className="text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <div>
          <button
            onClick={handleLogin}
            type="submit"
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-[#234459] rounded-md hover:bg-[#2d5771] focus:ring focus:ring-indigo-400"
          >
            Login
          </button>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2  text-gray-300">OR</span>
          </div>
        </div>
        <div className='w-full flex justify-center items-center'>
          <GoogleOAuthProvider clientId='1074917906223-pf2simq4kkr0itiue7f7ofb9t6bbikfq.apps.googleusercontent.com'>
            <GoogleLogin
              onSuccess={handleGoogleAuth}
              onFailure={(error) => setErrMsg('Google Sign-In failed')}
              useOneTap
            />
          </GoogleOAuthProvider>
        </div>
        <div className="mt-6 text-center text-white">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center text-red-500">
          {errMsg}
        </div>
      </div>
    </div>
  );
};

export default Login;
