const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
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
    [
        check('email','E-mail is required').isEmail(),
        check('password','Password is required').not().isEmpty(),
        check('name','name is required').not().isEmpty(),
        check('premium','premium is required').not().isEmpty(),
        check('location','location is required').not().isEmpty(),
        check('year_of_established','year_of_established is required').not().isEmpty(),
    ],
    async (req,res) => {
        try{
            
            let {email,password,name,about,college_type,year_of_established,location,website,social_media : {twitter,facebook,linkedin,instagram},vedio_link,student,premium } = req.body;
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
                student,
                premium
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
)
router.get(
    '/list',
    async (req,res) => {
        console.log("list");
        const data = await CollegeSchema.find({});
        res.send(data);
    }
);
router.post(
    '/studentlist',
    [
        check('email','type your email').isEmail(),
    ],
    async (req,res) => {
        let {email} = req.body;
        const data = await CollegeSchema.findOne({email});
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

module.exports = router;
