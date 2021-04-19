const express = require('express');
const router = express.Router();
const CollegeSchema = require('../schemas/College');
const CompanySchema = require('../schemas/Company');
const StudentSchema = require('../schemas/Student');
router.post(
    '/approvecollege',
    async (req,res) =>{
        let {email} = req.body;
        var data = await CollegeSchema.findOne({email : email});
        var tt = true;
        var data_s = await CollegeSchema.findByIdAndUpdate(data.id,{approve : tt});
        res.send(data_s); 
    }
);

router.post(
    '/approvecompany',
    async (req,res) =>{
        let {email} = req.body;
        var data = await CompanySchema.findOne({email : email});
        var tt = true;
        var data_s = await CompanySchema.findByIdAndUpdate(data.id,{approve : tt});
        res.send(data_s); 
    }
);

router.post(
    '/approvestudent',
    async (req,res) =>{
        let {email} = req.body;
        var data = await StudentSchema.findOne({email : email});
        var tt = true;
        var data_s = await StudentSchema.findByIdAndUpdate(data.id,{approve : tt});
        res.send(data_s); 
    }
);

router.post(
    '/premium',
    async (req,res) => { 
        let {email} = req.body;
        var data = await StudentSchema.findOne({email : email});
        var tt = true;
        var data_s = await StudentSchema.findByIdAndUpdate(data.id,{premium : tt});
        res.send(data_s);
    } 
)

module.exports = router;