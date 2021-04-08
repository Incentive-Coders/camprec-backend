const express = require('express');
const router = express.Router();
const CollegeSchema = require('../schemas/College');

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

module.exports = router;