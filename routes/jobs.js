const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const JobSchema = require('../schemas/Jobs');
const config = require('config');
const CompanySchema = require('../schemas/Company');
const StudentSchema = require('../schemas/Student');
const CollegeSchema = require('../schemas/College');

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
        let {company_id} = req.body;
        console.log(req.body);
        var data = await CompanySchema.findById(company_id);
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
        let student = await JobSchema.findById(job_id);
        let data = student.student;
        console.log(data.length)
        for(i = 0;i<data.length;i++)
        {
            if(data[i] == student_id)
            {
                return res.send("Already Applied");
            }
        }
        var datas = await JobSchema.findByIdAndUpdate(job_id,{$push : { "student" : student_id}});
        res.send(datas);
    }
);


router.post(
    "/caccept",
    async (req,res) => {
        let {job_id,college_id} = req.body;
        let college = await JobSchema.findById(job_id);
        let data = college.college;
        for(i = 0;i<data.length;i++)
        {
            if(data[i] == college_id)
            {
                return res.send("Already Applied");
            }
        }
        var datas = await JobSchema.findByIdAndUpdate(job_id,{$push : { "college" : college_id}});
        res.send(datas);
    }
);

router.post(
    '/edit',
    [
        check('job_title','jobtitle is required').not().isEmpty(),
        check('job_description','job_description is required').not().isEmpty(),
        check('comapany_id','company_id is not given')
    ],
    async (req,res) => {
        try{
            let {job_id,job_title,location,job_description} = req.body;
            jobs = new JobSchema({
                job_id,
                job_title,
                job_description,
                location,
            });
            var responss = await JobSchema.findById(job_id);
            if(responss == null)
            {
                res.send("the job is not present");
            }
             var data = await JobSchema.findByIdAndUpdate(job_id,{ "job_title" : job_title,"job_description" : job_description,"location" : location});
             console.log(data);
             res.send('true');
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : "Server Error....."});
        }
    }
);

router.post(
    '/clist',
    async (req,res) => {
        let {job_id} = req.body;
        var data = await JobSchema.findById(job_id);
        const len = data.college.length;
        let data_s = [];
        for(let i = 0;i<len;i++)
        {
            let Obj = data.college[i];
            data_s.push(await CollegeSchema.findById(Obj,{password : 0}));
        }
        console.log(data_s);
        res.send(data_s);
    }
);

router.post(
    '/slist',
    async (req,res) => {
        let {job_id} = req.body;
        var data = await JobSchema.findById(job_id);
        const len = data.student.length;
        let data_s = [];
        for(let i = 0;i<len;i++)
        {
            let Obj = data.student[i];
            data_s.push(await StudentSchema.findById(Obj,{password : 0}));
        }
        console.log(data_s);
        res.send(data_s);
    }
);

router.post(
    '/delete',
    async (req,res) => {
        let {job_id,company_id} = req.body;
        var data = await JobSchema.findByIdAndDelete(job_id);
        console.log(data);
        var datas = await  CompanySchema.findByIdAndUpdate(company_id,{$pull : {"jobs" : job_id}});
        res.send(datas);
    }
);


module.exports = router;