import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage'


import ForceRedirect from './privacy/ForceRedirect'
import PrivateRouter from './privacy/PrivateRouter'
import PrivateRouterAdmin from './privacy/PrivateRouterAdmin'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

import Noaccess from './pages/Noaccess'


import { useContext } from "react";
import { GlobalContext } from "./context/AuthContext";

function App() {
  const [count, setCount] = useState(0)

  const {user} = useContext(GlobalContext);


  const userInfo = {
  isconnected: user ? true : false,
  role: user ? user.role : null
};



  return (
     <div>

 

    <Routes>



      <Route path='/register' element={ <ForceRedirect user={userInfo} > <Register /></ForceRedirect>} />
      <Route path='/login' element={ <ForceRedirect user={userInfo} > <Login /></ForceRedirect>} />


     

      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<LandingPage />} />

      <Route path='/home' element={<PrivateRouter user={userInfo}><HomePage /></PrivateRouter>} />
      <Route path='/homepage' element={<PrivateRouter user={userInfo}><HomePage /></PrivateRouter>} />

     <Route path='/chat/:id' element={<PrivateRouter user={userInfo}><ChatPage /></PrivateRouter>} />
    

      



     
      


     

      <Route path='*' element={<h1 className='text-center text-3xl font-bold mt-10'>404 Not Found</h1>} />

      <Route path='/Noaccess' element={<Noaccess />} />


    </Routes>
    
  

    </div>
  )
}

export default App
