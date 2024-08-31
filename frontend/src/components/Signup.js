import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setUserInfo } from '../redux/userSlice';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((store)=>store.user.isLoggedIn)
  const emailPattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
  const emailRegex = new RegExp(emailPattern);

  if (isLoggedIn){
    navigate('/')
  }

  const handleGetOtp =async()=>{
    const isValidEmail = (email) => emailRegex.test(email);   
    
    if(isValidEmail){
      try{
        await axios.post('http://localhost:8000/api/v1/getotp/',{"email":email})
        setErrMsg("Otp sent successfully to "+email)
      }
      catch(err){
        console.log(err)
        setErrMsg("Error while sending Otp")
      }
    }
    else{
      setErrMsg("Please enter a valid Email ")
    }
}

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrMsg('Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/signup/', {
        name: fullName,
        email: email,
        phone: contactNumber,
        password: password,
        otp: otp,
      });
      if (response.data.status===200){
        localStorage.setItem('jwt',response.data.jwt_token)
        navigate('/login');
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

      dispatch(setLogin(true));
      dispatch(setUserInfo({
        email: response.data.email,
        name: response.data.name,
      }));
      if (response.data.status===200){
        localStorage.setItem('jwt',response.data.jwt_token)
        navigate('/');
      }

    } catch (error) {
      console.log(error)
      if (error.response && error.response.data) {
        setErrMsg(error.response.data.error || 'An error occurred.');
      } else {
        setErrMsg('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-tr from-[#181818] to-[#121111]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#212529] rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-white">
            Full Name <sup className='text-red-500 text-base'>*</sup>
          </label>
          <input
            id="full-name"
            name="full-name"
            type="text"
            required
            placeholder="Enter your full name"
            className="w-full px-3 py-2 mt-1 text-black outline-none bg-[#4e4b48] border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email <sup className='text-red-500 text-base'>*</sup>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 mt-1 text-black outline-none bg-[#4e4b48] border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="contact-number" className="block text-sm font-medium text-white">
            Contact Number
          </label>
          <input
            id="contact-number"
            name="contact-number"
            type="number"
            required
            placeholder="Enter your contact number"
            className="w-full px-3 py-2 mt-1 text-black outline-none bg-[#4e4b48] border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
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
            placeholder="Enter your password "
            className="w-full px-3 py-2 mt-1 text-black outline-none bg-[#4e4b48] border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
            Confirm Password <sup className='text-red-500 text-base'>*</sup>
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            placeholder="Confirm your password"
            className="w-full px-3 py-2 mt-1 text-black outline-none bg-[#4e4b48] border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 items-center">
          <button
            onClick={handleGetOtp}
            type="button"
            className="col-span-1 px-4 py-2 font-bold text-white outline-none bg-[#4e4b48] border-gray-300 rounded-md hover:bg-gray-900 focus:ring focus:ring-indigo-400"
          >
            Get OTP <sup className='text-red-500 text-base'>*</sup>
          </button>
          <input
            id="otp"
            name="otp"
            type="text"
            required
            placeholder="Enter OTP"
            className="col-span-2 px-3 py-2 text-black outline-none bg-[#4e4b48] border border-gray-500 rounded-md focus:ring focus:ring-indigo-400 focus:border-indigo-400"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={handleSignup}
            type="submit"
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-[#234459] rounded-md hover:bg-[#2d5771] focus:ring focus:ring-indigo-400"
          >
            Sign Up
          </button>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-500"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-300">OR</span>
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
        <div className="text-center text-white">
          Already have an account?{' '}
          <Link to="/login" className="font-bold hover:underline">
            Login
          </Link>
        </div>
        {errMsg && <p className="text-red-500 mt-4 text-center">{errMsg}</p>}
      </div>
    </div>
  );
};

export default Signup;
