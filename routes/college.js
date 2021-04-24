const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult, query } = require('express-validator');
const CollegeSchema = require('../schemas/College');
const StudentSchema = require('../schemas/Student');
const config = require('config');
const student = require("../schemas/Student");
var speakeasy = require('speakeasy');

router.get(
    '/',
    async (req,res) => {
    return res.status(200).json({msg : "hello"});
    });

router.post(
    '/signup',
    async (req,res) => {
        try{
            
            let {email,password,name,about,college_type,year_of_established,location,website,social_media : {twitter,facebook,linkedin,instagram},vedio_link,approve} = req.body;
            let college = await CollegeSchema.findOne({email : email});
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(401).json({errors : errors.array()});
            }

            if(college){
                return res.status(401).json({ msg : "present"})
            }
            
            const salt = await bcryptjs.genSalt(10);
            password = await bcryptjs.hash(password,salt);

            college = new CollegeSchema({
                email,
                password,
                name,
                about,
                college_type,
                year_of_established,
                location,
                website,
                social_media : {twitter,facebook,linkedin,instagram},
                vedio_link,
                approve
             });
             await college.save();

             const payload = {
                college : {
                    id : college.id
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
            let college = await CollegeSchema.findOne({email})
            if(college.approve == false)
            {
                return res.status(401).json({text : "you are not approved"});
            }
            if(!errors.isEmpty()){
                return res.status(401).json({errors : errors.array})
            
            }
            if(!college){
                return res.status(401).json("Not Found");
            }

            let isPasswordMatch = await bcryptjs.compare(password,college.password);

            if(isPasswordMatch === true){
                const payload = {
                    college : {
                        id : college.id
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
                        res.send(college);
                    }
                 )
                
            }
            else {
                res.status(401).json('password dont match');
            }

       } catch (error){
            console.log(error.message);
            return res.status(500).json({msg : "Server Error..."});
       }
    }
);

router.get(
    '/list/:page',
    async (req,res) => {
        var page = req.params.page;
        console.log("list");
        page = (page - 1) * 8;
        const data = await CollegeSchema.find({},{password : 0},{skip : page, limit : 8});
        res.send(data);
    }
);

router.get(
    '/approvec/:page',
    async (req,res) => {
        var page = req.params.page;
        console.log("list");
        page = (page - 1) * 10;
        const data = await CollegeSchema.find({approve : false},{password : 0},{skip : page, limit : 10});
        res.send(data);
    }
);

router.post(
    '/studentlist',
    async (req,res) => {
        let {college_id} = req.body;
        const data = await CollegeSchema.findById(college_id);
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
    '/edit',
    async(req,res) => {
        let {college_id,name,about,location,website,social_media : {twitter,facebook,linkedin,instagram},vedio_link} = req.body;
        var data = await CollegeSchema.findByIdAndUpdate(college_id,{ "name" : name,"about" : about,"location": location,"website" : website, social_media : {"twitter" : twitter,"facebook" : facebook,"linkedin" : linkedin,"instagram" : instagram},"vedio_link" : vedio_link});
        console.log(data);
        var data2 = await CollegeSchema.findById(college_id)
        res.send(data2);
    }
);

router.post(
    '/data',
    async (req,res) => {
        let {college_id} = req.body;
        var data = await CollegeSchema.findById(college_id,{password : 0});
        res.send(data);
    }
);

router.post(
    '/delete',
    async (req,res) => {
        let {name} = req.body;
        var data = await CollegeSchema.findOneAndDelete({name});
        res.send(data);
    }
);

router.post(
    "/jaccept",
    async (req,res) => {
        let {job_id,college_id} = req.body;
        let college = await CollegeSchema.findById(college_id);
        let datas = college.job;
        for(i = 0;i<datas.length;i++)
        {
            if(datas[i] == job_id)
            {
                return res.send("Already Applied");
            }
        }
        var data = await CollegeSchema.findByIdAndUpdate(college_id,{$push : { "job" : job_id}});
        res.send(data);
    }
);

module.exports = router;
