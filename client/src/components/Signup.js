import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, resetStatus } from '../features/user/userSlice';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  // Reset on mount AND on unmount (when navigating away)
  useEffect(() => {
    dispatch(resetStatus());
    return () => dispatch(resetStatus());
  }, [dispatch]);

  const getFriendlyError = (error) => {
    if (!error) return null;
    const msg = error.toLowerCase();
    if (msg.includes('already exists') || msg.includes('duplicate') || msg.includes('already registered')) {
      return 'This email is already registered. Please login instead.';
    }
    if (msg.includes('username')) {
      return 'This username is already taken. Please choose another.';
    }
    if (msg.includes('email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('password')) {
      return 'Password does not meet requirements.';
    }
    return 'Signup failed. Please try again.';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup({ username, email, password })).then((action) => {
      if (action.type === 'user/signup/fulfilled') {
        dispatch(resetStatus());
        navigate('/login');
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-12 shadow-lg w-full max-w-sm h-[450px]">
        <h2 className="font-condensed text-2xl font-bold mb-6 text-center text-custom-blue -mt-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 rounded-md hover:border-custom-blue"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 rounded-md hover:border-custom-blue"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 rounded-md hover:border-custom-blue"
              style={{ marginBottom: '9px' }}
              required
            />
            <button
              type="submit"
              className="w-full font-condensed text-white px-5 mr-6 mt-6 font-normal bg-custom-blue rounded pt-2 pb-2"
            >
              {userStatus === 'loading' ? 'Signing up...' : 'Signup'}
            </button>
          </div>
        </form>
        {userStatus === 'failed' && (
          <p className="mt-4 text-center text-red-500 text-sm">{getFriendlyError(error)}</p>
        )}
        {userStatus === 'succeeded' && (
          <p className="mt-4 text-center text-green-500 text-sm">Signup successful! Redirecting...</p>
        )}
      </div>
    </div>
  );
};