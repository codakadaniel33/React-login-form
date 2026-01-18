import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/Register', {
        email: email,
        password: password,
        username: username
      })
      console.log(res.data)
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || error.message)
      console.error('Error during registration:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className='text-2xl font-semibold font-serif mt-2'>Register</h2>
        </div>

        <div>
          <input
            type="text"
            name="username"
            placeholder='Username'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {error && <p className='text-red-500 mt-2'>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className='cursor-pointer col-auto w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400'
        >
          {loading ? 'Registering...' : 'Register Now'}
          
        </button>

        <p className='mt-4 text-center'>
          Already have an account? <Link to="/" className='text-blue-600 hover:underline font-semibold'>Login here</Link>
        </p>
      </form>
    </div>
  )
}

export default Register