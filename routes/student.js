const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const StudentSchema = require('../schemas/Student');
const Student = require("../schemas/Student");
const config = require('config');

router.get(
    '/',
    async (req,res) => {
    return res.status(200).json({msg : "hello"});
    });

router.post(
    '/signup',
    [
        check('email','E-mail is required').isEmail(),
        check('password','Password is required').not().isEmpty(),
        check('name','name is required').not().isEmpty(),
        check('college','college is required').not().isEmpty(),
        check('cgpa','cgpa is required').not().isEmpty(),
        check('premium','premium is required').not().isEmpty(),
    ],
    async (req,res) => {
        try{
            let {email,password,name,college,cgpa,about,date_of_birth,experience : {names,description,duration,link},
            education : {course,institute,marks},
            certification : {courses,institutes,valid_till,links},
            skills,resume,social_media : {twitter,facebook,linkedin,instagram},contactno,premium } = req.body;
            let student = await StudentSchema.findOne({email : email});
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(401).json({errors : errors.array()});
            }

            if(student){
                return res.status(401).json({ msg : "present"})
            }
            
            const salt = await bcryptjs.genSalt(10);
            password = await bcryptjs.hash(password,salt);

            student = new StudentSchema({
                email,
                password,
                name,
                college,
                cgpa,
                about,
                date_of_birth,
                experience : {names,description,duration,link},
                education : {course,institute,marks},
                certification : {courses,institutes,valid_till,links},
                skills,
                resume,
                social_media : {twitter,facebook,linkedin,instagram},
                contactno,
                premium,
             });
             await student.save();

             const payload = {
                student : {
                    id : student.id
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

router.post(
    '/login',
    [
        check('email','type your email').isEmail(),
        check('password','Password is required').not().isEmpty()
    ],
    async (req,res) => {
        try {
            let {email,password} = req.body;
            console.log(req.body);
            const errors = validationResult(req);
            let student = await StudentSchema.findOne({email})

            if(!errors.isEmpty()){
                return res.status(401).json({errors : errors.array})
            
            }
            if(!student){
                return res.status(401).json("Not Found");
            }

            let isPasswordMatch = await bcryptjs.compare(password,student.password);

            if(isPasswordMatch === true){
                const payload = {
                    student : {
                        id : student.id
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
                        res.send(student);
                    }
                 )
                
            }
            else {
                res.status(401).json('password dont match');
            }

       } catch (error){
            console.log(error.message);
            return res.status(500);
       }
    }
);

router.post(
    '/edit',
    async(req,res) => {
        let {name,about,date_of_birth,experience : {names,description,duration,link},
            education : {course,institute,marks},
            certification : {courses,institutes,valid_till,links},
            skills,resume,social_media : {twitter,facebook,linkedin,instagram},contactno} = req.body;
            var data = await CollegeSchema.findByIdAndUpdate(
                student_id,{ "name" : name,"about" : about,"date_of_birth": date_of_birth,
                experience : {"names" : names,"description" : description,"duration" : duration,"link" : link},
                experience : {"course" : course,"institute" : institute,"marks" : marks},
                "skills" : skills, "resume" : resume,
                certification : {"courses" : courses,"institutes" : institutes,"valid_till" : valid_till,"links" : links},
                "website" : website, social_media : {"twitter" : twitter,"facebook" : facebook,"linkedin" : linkedin,"instagram" : instagram},
                "vedio_link" : vedio_link});
            console.log(data);
            res.send("true");
    }
);

router.post(
    '/data',
    async (req,res) => {
        let {student_id} = req.body;
        var data = await StudentSchema.findById(student_id,{password : 0});
        res.send(data);
    }
);

router.post(
    '/delete',
    async (req,res) => {
        let {name} = req.body;
        var data = await StudentSchema.findOneAndDelete({name});
        res.send(data);
    }
);

module.exports = router;
