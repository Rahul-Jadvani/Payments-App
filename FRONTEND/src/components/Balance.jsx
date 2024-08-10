import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Balance = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const getBalance = async () => {
            try {
                const response = await axios.get("https://payments-app-aafe.onrender.com/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setBalance(Math.round(response.data.balance));
            } catch (err) {
                setError("Failed to fetch balance. Please try again.");
                console.error("Error fetching balance:", err);
            }
        };

        getBalance();
    }, [balance]);

    return (
        <div className="flex items-center p-4">
            {error && <div className="text-red-500">{error}</div>}
            {!error && (
                <>
                    <div className="font-bold text-xl">
                        Your balance -
                    </div>
                    <div className="font-semibold ml-4 text-lg  text-green-500">
                        Rs {balance !== null ? balance : "Loading..."}
                    </div>
                </>
            )}
        </div>
    );
};

export default Balance;
