const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const CollegeSchema = require('../schemas/college');
const config = require('config');
var MongoClient = require('mongodb').MongoClient;
const { rawListeners } = require("../schemas/college");

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

router.get(
    '/list',
    async (req,res) => {
        console.log("list");
        const data = await CollegeSchema.find({});
        res.send(data);
    }
);

module.exports = router;