import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, resetStatus } from '../features/user/userSlice';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  // Reset status on mount AND on unmount (when navigating away)
  useEffect(() => {
    dispatch(resetStatus());
    return () => dispatch(resetStatus());
  }, [dispatch]);

  const getFriendlyError = (error) => {
    if (!error) return null;
    const msg = error.toLowerCase();
    if (msg.includes('not found') || msg.includes('not registered') || msg.includes('no user')) {
      return 'Not registered. Please signup first.';
    }
    if (msg.includes('password') || msg.includes('incorrect password') || msg.includes('wrong password')) {
      return 'Incorrect password. Please try again.';
    }
    if (msg.includes('email') || msg.includes('invalid email')) {
      return 'Email is incorrect. Please try again.';
    }
    if (msg.includes('invalid credentials') || msg.includes('unauthorized')) {
      return 'Email or password is incorrect.';
    }
    return 'Login failed. Please try again.';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })).then((action) => {
      if (action.type === 'user/login/fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-12 shadow-lg w-full max-w-xs h-[400px]">
        <h2 className="font-condensed text-2xl font-bold mb-6 text-center text-custom-blue -mt-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
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
              {userStatus === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        {userStatus === 'failed' && (
          <p className="mt-4 text-center text-red-500 text-sm">{getFriendlyError(error)}</p>
        )}
      </div>
    </div>
  );
};