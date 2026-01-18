import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true
        })
        setUser(res.data)
        console.log('User data:', res.data)
      } catch (error) {
        setError(error.response?.data?.message || error.message)
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) return <div className='text-center mt-10'>Loading...</div>
  if (error) return <div className='text-red-500 text-center mt-10'>Error: {error}</div>

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-4'>Dashboard</h1>
        {user && (
          <div>
            <p className='font-bold text-lg mb-2'>Welcome back, {user.username}!</p>
            <div className='bg-indigo-700 text-white p-4 rounded-lg'>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.username}</p>
              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard