import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setLogin, setUserInfo } from '../redux/userSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLikedSong, setPlaylist } from '../redux/playlistSlice';
import { setHistory } from '../redux/playerSlice';
import toast from 'react-hot-toast';
import { sendToast } from '../redux/toastSlice';

const useGetUser =()=>{
    const dispatch = useDispatch()
    
    useEffect(()=>{

        async function getData() 
        {
            const token = localStorage.getItem("jwt");
            var email=''
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const expiration = new Date(payload.exp * 1000);
                const now = new Date();

                if (now >= expiration) {
                    localStorage.removeItem("jwt");
                    dispatch(sendToast("Session expired, please log in again."));
                } else {
                    email=payload.email
                    const timeout = expiration.getTime() - now.getTime();
                    setTimeout(() => {
                        localStorage.removeItem("jwt");
                        dispatch(setLogin(false))
                        dispatch(sendToast("Session expired, please log in again."));
                        window.location.href='/login'
                    }, timeout);
                }
            }

        console.log(email)
        if (email){
            dispatch(setLogin(true))
            try{
                const response = await axios.post('http://localhost:8000/api/v1/getuserdata/',{'email':email})
                console.log(response.data)
                dispatch(setUserInfo(response.data.profile)); //{'email':email,'name':name} obj
                dispatch(setPlaylist(response.data.playlist)); //obj
                dispatch(setLikedSong(response.data.likedsongs)); //array
                dispatch(setHistory(response.data.history)); //array
            }
            catch(err){
                console.log(err)
            }
        }
        }

        getData()

    },[])
} 

export default useGetUser