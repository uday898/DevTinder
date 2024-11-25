//const express = require("express");
import express from 'express';

const app = express();

app.post('/user',(req,res,next)=>{
    console.log("req handler 1");
    console.log(req.query);//query params user/userId=101&name=rajesh
    //res.send("Data Saved");
    next();
},
(req,res)=>{
    console.log("req handler 2");
    console.log(req.query);//query params user/userId=101&name=rajesh
    res.send("Data Saved from 2nd req handler");
});

// app('/route, rh , [rh2,rh3],rh4) // adding in the array doesn't make any difference
app.post('/user',(req,res,next)=>{
    console.log("req handler 1");
    console.log(req.query);//query params user/userId=101&name=rajesh
    //res.send("Data Saved");
    next();
},
[(req,res)=>{
    console.log("req handler 2");
    console.log(req.query);//query params user/userId=101&name=rajesh
    res.send("Data Saved from 2nd req handler");
},
(req,res)=>{
    console.log("req handler 2");
    console.log(req.query);//query params user/userId=101&name=rajesh
    res.send("Data Saved from 2nd req handler");
},
(req,res)=>{
    console.log("req handler 2");
    console.log(req.query);//query params user/userId=101&name=rajesh
    res.send("Data Saved from 2nd req handler");
}]);


app.post('/user',(req,res)=>{
    console.log(req.query);//query params user/userId=101&name=rajesh
    //res.send("Data Saved");
});

app.post('/user/:userId',(req,res)=>{
    console.log(req.params) // dynamic routes
    res.send("Data Saved");
});

app.get('/user',(req,res)=>{
    res.send({
        firstname:"Uday Kumar",
        lastname:"Porandla"
    });
});


//b is optional , ac , abc 
app.get('/ab?c',(req,res)=>{
    res.send({
        firstname:"Uday Kumar",
        lastname:"Porandla"
    });
});

//can have any no.s of b , abbbbbbbc , abc 
app.get('/ab+c',(req,res)=>{
    res.send({
        firstname:"Uday Kumar",
        lastname:"Porandla"
    });
});

//we can have anything in between ab & cd.. "abggggggcd"
app.get('/ab*cd',(req,res)=>{
    res.send({
        firstname:"Uday Kumar",
        lastname:"Porandla"
    });
});
// bc is optional
app.get('/a(bc)?cd',(req,res)=>{
    res.send({
        firstname:"Uday Kumar",
        lastname:"Porandla"
    });
});

// all regex will work 

app.post('/user',(req,res)=>{
    res.send("Data Saved");
});

app.get('/user',(req,res)=>{
    res.send("test node Here");
});

app.use('/hey',(req,res)=>{
    res.send("test node Here");
});

app.listen(3000);