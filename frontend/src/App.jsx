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

function App() {
  const [count, setCount] = useState(0)



  const userInfo = {
  isconnected: true,
  role:"user"
};

  return (
     <div>

 

    <Routes>



      <Route path='/Register' element={ <ForceRedirect user={userInfo} > <Register /></ForceRedirect>} />
      <Route path='/Login' element={ <ForceRedirect user={userInfo} > <Login /></ForceRedirect>} />


     

      <Route path='/'element={<LandingPage />} />
      <Route path='/Home' element={<LandingPage />} />

      <Route path='/HomePage' element={ <PrivateRouter user={userInfo} > <HomePage /></PrivateRouter>} />

      <Route path='/ChatPage' element={ <PrivateRouter user={userInfo} > <ChatPage /></PrivateRouter>} />
    

      



     
      


     

      <Route path='*' element={<h1 className='text-center text-3xl font-bold mt-10'>404 Not Found</h1>} />

      <Route path='/Noaccess' element={<Noaccess />} />


    </Routes>
    
  

    </div>
  )
}

export default App
