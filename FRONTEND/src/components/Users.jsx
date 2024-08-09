import React, { useEffect, useState, useCallback } from "react";
import Button from "./Button";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:5500/api/v1/user/bulk?filter=${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const loggedInUserId = response.data.loggedInUserId;
            const filteredUsers = response.data.users.filter(user => user._id !== loggedInUserId);
            setUsers(filteredUsers);
        } catch (error) {
            setError("Error fetching users. Please try again.");
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), [fetchUsers]);

    useEffect(() => {
        debouncedFetchUsers();
        return () => {
            debouncedFetchUsers.cancel();
        };
    }, [filter, debouncedFetchUsers]);

    return (
        <>
            <div className="font-bold mt-6 text-lg mb-4 px-4">
                Users
            </div>
            <div className="my-2 mb-6 px-4">
                <input
                    onChange={e => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div>
                {users.map(user => <MemoizedUser key={user._id} user={user} />)}
            </div>
        </>
    );
};

const User = ({ user }) => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-between mb-4 px-4">
            <div className="flex pb-4">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div className="px-2">
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center h-full px-4">
                <Button onClick={() => {
                    navigate(`/transaction?id=${user._id}&name=${user.firstName}`);
                }} label={"Send Money"} />
            </div>
        </div>
    );
};

const MemoizedUser = React.memo(User);

export default Users;
