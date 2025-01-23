import React, { useState } from 'react';
import { registerUser, loginUser, logoutUser } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../BaseURL';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Use navigate here

  // Handle change for input fields
  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(userData);
      if(response.message== 'User registered successfully')
      {
        window.alert('User registered successfully');
      
      setUserData({ username: '', email: '', password: '' });
    }
    else window.alert(`${response.message || 'User Registration Failed' } `)
    } catch (err) {
      window.alert(err.message);
      setMessage('');
    }
  };

  // Redirect to backend Google OAuth route
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
    
  };
  

  // Login user
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      console.log(response)
      if(response.message=='Login successful'){
        window.alert('Logged in successfully');
        setError('');
        window.localStorage.setItem('user',response.user.email)
        navigate('/home'); // Navigate after successful login
      } else {
        window.alert(response.data?.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };
  

  // Logout user
  

  return (
    <>
    
    <div className="flex flex-col items-center justify-center py-40 bg-gray-100 h-fit">
    <h1 className=' items-center justify-center' >The Project will take around 50-60 seconds to log in . Plz wait</h1>
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <div className="flex justify-between mb-4">
          <button
            className={`py-2 px-4 font-semibold ${isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 font-semibold ${!isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        

        <div className={`relative w-full overflow-hidden transition-all duration-500 ${isLogin ? 'h-64' : 'h-96'}`}>
          <div
            className="absolute inset-0 flex transition-transform duration-500"
            style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(-100%)' }}
          >
            <div className="w-full flex-shrink-0">
              <LoginForm 
                handleChange={handleChange} 
                loginData={loginData} 
                setLoginData={setLoginData} 
                handleLogin={handleLogin} 
                handleGoogleLogin={handleGoogleLogin} 
              />
            </div>
            <div className="w-full flex-shrink-0">
              <SignupForm 
                handleChange={handleChange} 
                userData={userData} 
                setUserData={setUserData} 
                handleRegister={handleRegister} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Login Form Component
const LoginForm = ({ handleChange, loginData, setLoginData, handleLogin, handleGoogleLogin }) => (
  <form className="space-y-6 text-center" onSubmit={handleLogin}>
    <div >
      <div  onClick={handleGoogleLogin} className=' items-center justify-items-center'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg></div>
      <div onClick={handleGoogleLogin} className="text-sm cursor-pointer text-blue-500 underline"> Login with Google</div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        name="email"
        required
        className="w-full px-3 py-2 mt-1 border rounded-md"
        value={loginData.email}
        onChange={(e) => handleChange(e, setLoginData)}
      />
    </div>
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        type="password"
        name="password"
        required
        className="w-full px-3 py-2 mt-1 border rounded-md"
        value={loginData.password}
        onChange={(e) => handleChange(e, setLoginData)}
      />
    </div>
    <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-md">
      Login
    </button>
  </form>
);

// Signup Form Component
const SignupForm = ({ handleChange, userData, setUserData, handleRegister }) => (
  <form className="space-y-6 text-center" onSubmit={handleRegister}>
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
        Username
      </label>
      <input
        type="text"
        name="username"
        required
        className="w-full px-3 py-2 mt-1 border rounded-md"
        value={userData.username}
        onChange={(e) => handleChange(e, setUserData)}
      />
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        name="email"
        required
        className="w-full px-3 py-2 mt-1 border rounded-md"
        value={userData.email}
        onChange={(e) => handleChange(e, setUserData)}
      />
    </div>
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        type="password"
        name="password"
        required
        className="w-full px-3 py-2 mt-1 border rounded-md"
        value={userData.password}
        onChange={(e) => handleChange(e, setUserData)}
      />
    </div>
    <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-md">
      Signup
    </button>
  </form>
);

export default AuthForm;
