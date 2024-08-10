import React, { useState } from 'react';
import Heading from '../components/Heading';
import SubHeading from '../components/SubHeading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import BottomWarning from '../components/BottomWarning';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const response = await axios.post("https://payments-app-aafe.onrender.com/api/v1/user/signin", {
        userName,
        password
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Assuming the presence of a token means success
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate('/dashboard'); // Navigate to dashboard on success
      } else {
        setError("Signin failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signin.");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox onChange={(e) => setUserName(e.target.value)} placeholder="yourself@gmail.com" label={"Email"} />
          <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="your secret" label={"Password"} />
          {error && <div className="text-red-500">{error}</div>}
          <div className="pt-4">
            <Button onClick={handleSignin} label={"Sign in"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  )
}

export default Signin;
