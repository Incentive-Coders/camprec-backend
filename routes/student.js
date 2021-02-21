const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const StudentSchema = require('../schemas/student');
const User = require("../schemas/student");
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
        check('names','name is required').not().isEmpty(),
        check('college','college is required').not().isEmpty(),
        check('cgpa','cgpa is required').not().isEmpty(),
        check('premium','premium is required').not().isEmpty(),
    ],
    async (req,res) => {
        try{
            let { email,password,name,college,cgpa,about,premium } = req.body;
            let user = await StudentSchema.findOne({email : email});
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return res.status(401).json({errors : errors.array()});
            }

            if(user){
                return res.status(401).json({ msg : "present"})
            }
            
            const salt = await bcryptjs.genSalt(10);
            password = await bcryptjs.hash(password,salt);

            user = new StudentSchema({
                email,
                password,
                name,
                college,
                cgpa,
                about,
                premium
             });

             await user.save();

             const payload = {
                user : {
                    id : user.id
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
            let user = await StudentSchema.findOne({email})

            if(!errors.isEmpty()){
                return res.status(401).json({errors : errors.array})
            }

            if(!user){
                return res.status(401).json("Not Found");
            }

            let isPasswordMatch = await bcryptjs.compare(password,user.password);

            if(isPasswordMatch === true){
                const payload = {
                    user : {
                        id : user.id
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