import React, { useEffect, useState } from "react";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [allTask, setAllTask] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDetail, setTaskDetail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch(api_base_url + "/task/getAllTask", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    setAllTask(data.task);
                } else {
                    console.error("Failed to fetch tasks:", data.message);
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    }, [isCreate]);

    const submitForm = (e) => {
        e.preventDefault();
        if (!taskName || !taskDetail) {
            console.error("Both Task Name and Task Detail are required");
            return;
        }

        fetch(api_base_url + "/task/addTask", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskName: taskName,
                taskDetail: taskDetail,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    setIsCreate(false);
                    setTaskName("");
                    setTaskDetail("");
                } else {
                    console.error(data.message);
                }
            })
            .catch((error) => console.error("Fetch error:", error));
    };

    const handleTaskClick = async (taskId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(api_base_url + "/task/assignTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskId ,token }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Task successfully added to your account!");
            } else {
                alert("Failed to assign task: " + data.message);
            }
        } catch (error) {
            console.error("Error assigning task:", error);
            alert("An error occurred. Please try again.");
        }
    };



    return (
        <>
            {isCreate && (
                <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[rgba(255,255,255,0.2)] flex items-center justify-center">
                    <div className="createModel w-[25vw] h-[22vh] shadow-lg shadow-black/50 bg-[#ffffff] rounded-[10px] p-[20px]">
                        <h3 className="text-2xl"> Create New Task</h3>
                        <div className="inputbox !bg-[#ffffff] mt-4">
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>
                        <div className="inputbox !bg-[#ffffff] mt-4">
                            <input
                                type="text"
                                placeholder="Task Detail"
                                value={taskDetail}
                                onChange={(e) => setTaskDetail(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-[10px] w-full mt-4">
                            <button
                                className="btnBlue rounded-[5px] w-[49%] mb-4 !p-[5px] !px-[10px] !py-[10px]"
                                onClick={submitForm}
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setIsCreate(false)}
                                className="btnBlue !bg-[#ffffff] rounded-[5px] w-[49%] mb-4 !p-[5px] !px-[10px] !py-[10px]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center">
                <div
                    className="create w-[100px] h-[100px] border border-black flex items-center justify-center cursor-pointer"
                    onClick={() => setIsCreate(true)}
                >
                    Add Task
                </div>
            </div>
            <div className="container w-screen h-screen flex flex-col">
                {allTask.map((task) => (
                    <div
                        key={task._id}
                        className="task w-screen h-[100px] border border-black p-5 cursor-pointer"
                        onClick={() => handleTaskClick(task._id)}
                    >
                        <h3 className="text-[20px] mx-1 my-1">{task.name}</h3>
                        <p className="mx-1">{task.details}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Home;

