const express = require('express')
const Task = require('../models/task')

//! different route approach than "users.js" 
const app = express()

//*************************************!    CREATE TASK   ****************************************
app.post("/task", async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//*************************************!    FIND TASK S   ****************************************
app.get("/task", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks);
    }
    catch (e) {
        app.status(500).send();
    }
});

//*************************************!    FIND TASK   ****************************************
app.get("/task/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (e) {
        app.status(500).send();
    }
});

//*************************************!    UPDATE TASK   ****************************************
app.patch("/task/:id", async (req, res) => {
    const taskProperty = Object.keys(req.body)
    const validProp = ['description', 'completed']
    const isValidProp = taskProperty.every((inputProp) => validProp.includes(inputProp))
    if (!isValidProp) {
        return res.status(404).send('!invalid property')
    }
    try {
        const task=await Task.findById(req.params.id)
        taskProperty.forEach((property)=>task[property]=req.body[property])
        await task.save()
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//*************************************!    DELETE TASK   ****************************************
app.delete("/task/:id", async (req, res) => {
    try {
         await Task.findByIdAndDelete(req.params.id)
        res.send("!successful")
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = app

