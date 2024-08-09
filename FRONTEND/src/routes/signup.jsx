import React, { useState } from 'react';
import Heading from '../components/Heading';
import SubHeading from '../components/SubHeading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import axios from 'axios';
import BottomWarning from '../components/BottomWarning';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:5500/api/v1/user/signup", {
                userName,
                firstName,
                lastName,
                password
            });

            // Assuming the presence of a token means success
            if (response.status === 200 && response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate('/signin');
            } else {
                setError("Signup failed. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during signup.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" label={"First Name"} />
                    <InputBox onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" label={"Last Name"} />
                    <InputBox onChange={(e) => setUserName(e.target.value)} placeholder="yourself@gmail.com" label={"Email"} />
                    <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="A Secret Maybe?" label={"Password"} />
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="pt-4">
                        <Button onClick={handleSignup} label={"Sign up"} />
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    );
}

export default Signup;
