const express=require("express");
const TASK = require("../models/tasks");
const User = require("../models/user");
const { verifyToken } = require("../middleware/auth");

const router=express.Router();

router.post("/addTask",async (req,res)=>{
    const {taskName,taskDetail}=req.body;

    await TASK.create({
        name : taskName,
        details : taskDetail,
    })

    return res.json({success : true , message : "Task added"});
})

router.post("/getAllTask", async (req, res) => {
    try {
        const data = await TASK.find({});
        return res.json({ success: true, message: "All Task Provided", task: data });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    }
});


router.post("/user-tasks", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await User.findById(userId).populate("taskGiven.taskName");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, tasks: user.taskGiven });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/assignTask", verifyToken, async (req, res) => {
    try {
        const { taskId ,token } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const task = await TASK.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        user.taskGiven.push({ taskName: task._id });
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Task assigned to user successfully",
            user,
        });
    } catch (error) {
        console.error("Error assigning task:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports= router;