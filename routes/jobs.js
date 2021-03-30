const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const JobSchema = require('../schemas/Jobs');
const config = require('config');
const CompanySchema = require('../schemas/Company');
const Jobs = require("../schemas/Jobs");

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
        check('comapany_id','company_id is not given')
    ],
    async (req,res) => {
        try{
            let {job_title,location,job_description,student,college,company_id} = req.body;
            jobs = new JobSchema({
                job_title,
                job_description,
                location,
                student,
                college,
                company_id
             });
             await jobs.save();

             const payload = {
                jobs : {
                    id : jobs.id
                }
             }
             console.log(jobs.id);
             console.log(company_id);
             var data = await CompanySchema.findByIdAndUpdate(company_id,{$push : { "jobs" : jobs.id}});
             console.log(data);
             res.send('true');
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : "Server Error....."});
        }
    }
);

router.post(
    "/list" ,
    async (req,res) => {
        console.log(req.body);
        var data = await CompanySchema.findById(req.body.company_id);
        let job = [];
        for (i = 0;i<data.jobs.length;i++)
            job.push(await JobSchema.findById(data.jobs[i]));
        res.send(job)
    }
);

router.post(
    "/saccept",
    async (req,res) => {
        let {job_id,student_id} = req.body;
        let student = await JobSchema.findOne({"student":student_id});
        if(student){
            return res.status(401).json("Already Applied");
        }
        var data = await JobSchema.findByIdAndUpdate(job_id,{$push : { "student" : student_id}});
        res.send('true');
    }
);
router.post(
    "/caccept",
    async (req,res) => {
        let {job_id,college_id} = req.body;
        let college = await JobSchema.findOne({"college":college_id});
        if(college){
            return res.status(401).json("Already Applied");
        }
        var data = await JobSchema.findByIdAndUpdate(job_id,{$push : { "college" : college_id}});
        res.send('true');
    }
);
module.exports = router;