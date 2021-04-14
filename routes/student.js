const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const StudentSchema = require('../schemas/Student');
const Student = require("../schemas/Student");
const config = require('config');
const CollegeSchema = require("../schemas/College");

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
            let {email,password,name,college,cgpa,about,date_of_birth,experience : [{names,description,duration,companys,link}],
            education : [{course,institute,marks}],
            certification : [{courses,institutes,valid_till,links}],
            skills:[],resume,social_media : {twitter,facebook,linkedin,instagram},contactno,premium,approve } = req.body;
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
                experience : [{names,description,duration,companys,link}],
                education : [{course,institute,marks}],
                certification : [{courses,institutes,valid_till,links}],
                skills:[],
                resume,
                social_media : {twitter,facebook,linkedin,instagram},
                contactno,
                premium,
                approve
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
             );
             var id =  await CollegeSchema.findOne({name : college});
             var data = await CollegeSchema.findByIdAndUpdate(id.id,{$push : { "student" : student.id}});
             console.log(data);
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
        let {name,about,date_of_birth,resume,social_media : {twitter,facebook,linkedin,instagram},contactno} = req.body;
            var data = await StudentSchema.findByIdAndUpdate(
                student_id,{ "name" : name,"about" : about,"date_of_birth": date_of_birth, "resume" : resume,"contactno": contactno,
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

router.post(
    '/addexp',
    async (req,res) => {
        let {student_id,names,description,duration,link,companys} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$push: {experience : {names : names, description : description, duration : duration,link : link,companys : companys}}});
        res.send(data);
    }
);

router.post(
    '/addedu',
    async (req,res) => {
        let {student_id,course,institute,marks} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$push: {education : {course : course,institute : institute,marks : marks}}});
        res.send(data);
    }
);

router.post(
    '/addcer',
    async (req,res) => {
        let {courses,institutes,valid_till,links,student_id} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$push: {certification : {courses : courses, institutes : institutes, valid_till : valid_till,links : links}}});
        res.send(data);
    }
);
router.post(
    '/addskill',
    async (req,res) => {
        let {student_id,skill} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$push: {"skills" : skill}});
        res.send(data);
    }
)

router.post(
    '/delskill',
    async (req,res) => {
        let {student_id,skill} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$pull: {"skills" : skill}});
        res.send(data);
    }
);

router.post(
    '/delexp',
    async (req,res) => {
        let {student_id,names,companys} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$pull: {experience : {names : names,companys : companys}}});
        res.send(data);
    }
);

router.post(
    '/deledu',
    async (req,res) => {
        let {student_id,course,institute} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$pull: {education : {course : course,institute : institute}}});
        res.send(data);
    }
);
router.post(
    '/delcer',
    async (req,res) => {
        let {courses,institutes,student_id} = req.body;
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$pull: {certification : {courses : courses, institutes : institutes}}});
        res.send(data);
    }
);

router.post(
    "/jaccept",
    async (req,res) => {
        let {job_id,student_id} = req.body;
        let student = await StudentSchema.findById(student_id);
        let datas = student.job;
        for(i = 0;i<datas.length;i++)
        {
            if(datas[i] == job_id)
            {
                return res.send("Already Applied");
            }
        }
        var data = await StudentSchema.findByIdAndUpdate(student_id,{$push : { "job" : job_id}});
        res.send(data);
    }
);

router.get(
    '/list/:page',
    async (req,res) => {
        var page = req.params.page;
        console.log("list");
        page = (page - 1) * 10;
        const data = await StudentSchema.find({},{password : 0},{skip: page, limit: 10});
        res.send(data);
    }
);

router.get(
    '/approves/:page',
    async (req,res) => {
        var page = req.params.page;
        console.log("list");
        page = (page - 1) * 10;
        const data = await StudentSchema.find({approve : false},{password : 0},{skip: page, limit: 10});
        res.send(data);
    }
);

module.exports = router;
