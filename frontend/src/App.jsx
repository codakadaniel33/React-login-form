import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Register from './Register'
import axios from 'axios'
import Dashboard from './dashboard.jsx'


function App() {

  

  //fetch data from backend
 
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
  )
}

export default App
