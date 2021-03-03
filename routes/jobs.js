const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const JobSchema = require('../schemas/Jobs');
const config = require('config');

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
             jwt.sign(
                payload,
                config.get('jwtSecret'),
                (err,token) =>
                {
                    if(err)
                    {
                        throw err;
                    }      
                    res.json({token});
                }
             )
             res.send('true');
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : "Server Error....."});
        }
    }
);

module.exports = router;