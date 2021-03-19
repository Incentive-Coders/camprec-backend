const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const JobSchema = require('../schemas/Jobs');
const config = require('config');
const { Router } = require("express");

router.get(
    '/',
    async (req,res) => {
    return res.status(200).json({msg : "hello"});
    });

router.post(
    '/create',
    [
        check('job_title','jobtitle is required').not().isEmpty(),
        check('job_description','job_description is required').not().isEmpty(),
    ],
    async (req,res) => {
        try{
            let {job_title,location,job_description,student,college} = req.body;
            jobs = new JobSchema({
                job_title,
                job_description,
                location,
                student,
                college
             });
             await jobs.save();

             const payload = {
                jobs : {
                    id : jobs.id
                }
             }
             res.send('true');
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : "Server Error....."});
        }
    }
);

Router.post(
    "/list" ,
    async (req,res) => {
        let job = await JobSchema.findById({"$in" : req.id});
        res.send(job);
    }
);

module.exports = router;