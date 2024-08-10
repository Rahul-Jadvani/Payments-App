import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppBar = () => {
    const [userInitial, setUserInitial] = useState('U'); // Default initial
    const [showLogout, setShowLogout] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://payments-app-aafe.onrender.com/api/v1/user/bulk", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                if (response.data.loggedInUser) {
                    const { firstName } = response.data.loggedInUser;
                    setUserInitial(firstName ? firstName.charAt(0).toUpperCase() : 'U');
                }
            } catch (err) {
                setError("Failed to fetch user data.");
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Clear all storage items
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to /signup
        navigate('/signup');
    };

    return (
        <div className="relative shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4 text-blue-600 text-2xl">
                Payments App
            </div>
            <div className="flex items-center">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello
                </div>
                <div
                    className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mb-2 mt-1 mr-2 cursor-pointer"
                    onClick={() => setShowLogout(!showLogout)}
                >
                    <div className="flex flex-col justify-center h-full text-xl">
                        {userInitial}
                    </div>
                </div>
                {showLogout && (
                    <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg p-2">
                        <button
                            onClick={handleLogout}
                            className="text-red-500 font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppBar;
