const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const StudentSchema = require('../schemas/student');
const Student = require("../schemas/student");
const config = require('config');

router.get(
    '/',
    async (res) => {
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
            let {profile_image : {file_name,file_content},email,password,name,college,cgpa,about,experience : [{names,description,duration,link}],
            education : [{course,institute,marks}],
            certification : [{courses,institutes,valid_till,links}],
            skills : [],resume,premium } = req.body;
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
                profile_image : {file_name,file_content},
                email,
                password,
                name,
                college,
                cgpa,
                about,
                experience : [{names,description,duration,link}],
                education : [{course,institute,marks}],
                certification : [{courses,institutes,valid_till,links}],
                skills : [],
                resume,
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
                        res.status(200).json({token,msg : "password matched"});
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

module.exports = router;