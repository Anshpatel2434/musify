import React, { useEffect, useState } from 'react';
import './App.css';
import useGetTracks from './hooks/useGetTracks';
import useNewRelease from './hooks/useNewRelease';
import useGetArtists from './hooks/useGetArtists';
import useGetToken from './hooks/useGetToken';
import useGetPlaylist from './hooks/useGetPlaylist';
import LandingPage from './components/LandingPage';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import useGetPlaying from './hooks/useGetPlaying';
import MusicContainer from './components/MusicContainer';
import Playlist from './components/Playlist';
import DisplayPlaylist from './components/DisplayPlaylist';
import { Toaster } from 'react-hot-toast';
import useGetUser from './hooks/useGetUser';
import { useSelector } from 'react-redux';

function App() {

    useGetUser();
    useGetToken();
    useGetPlaylist();
    useGetPlaying();
    useGetTracks();
    useGetArtists();
    useNewRelease();

    
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn)

  return (
    <>
      <Router>
        <Routes>
          {isLoggedIn ? (
            <>
            <Route path="/" element={<Layout />}>
              <Route path="" element={<LandingPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="play-music" element={<MusicContainer />} />
              <Route path="likedsongs" element={<DisplayPlaylist type={'likedsong'} />} />
              <Route path="history" element={<DisplayPlaylist type={'history'} />} />
              <Route path="playlist" element={<Playlist />} />
              <Route path="userplaylists/:param" element={<DisplayPlaylist type={'userplaylist'} />} />
              <Route path="albums/:param" element={<DisplayPlaylist type={'album'} />} />
              <Route path="artists/:param" element={<DisplayPlaylist type={'artist'} />} />
              <Route path="playlists/:param" element={<DisplayPlaylist type={'playlist'} />} />
              <Route path="result/:param" element={<DisplayPlaylist type={'result'} />} />
            </Route>
            <Route path="*" element={<Navigate to={"/"} />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="*" element={<Navigate to={"/login"} />} /> */}
            </>
          )}
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
