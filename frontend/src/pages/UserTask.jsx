import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_base_url } from "../helper";

const UserTask = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to view tasks.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(api_base_url + "/task/user-tasks", {
                    mode: "cors",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify({
                        token :token,
                    })
                });
                const data = await response.json();

                if (data.success) {
                    setTasks(data.tasks);
                } else {
                    alert("Failed to fetch tasks: " + data.message);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                alert("Something went wrong!");
            }
        };

        fetchTasks();
    }, [navigate]);

    return (
        <div>
            <h2>My Tasks</h2>
            <p> Task Completed : 0</p>
            {tasks.length > 0 ? (
                <div>
                    {tasks.map((task) => (
                        <div key={task.taskName._id} className="task w-screen h-[100px] border border-black p-5">
                            <h3 className="text-[20px] mx-1 my-1">{task.taskName.name}</h3>
                            <p className="mx-1 ">{task.taskName.details}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No tasks assigned yet.</p>
            )}
        </div>
    );
};

export default UserTask;

