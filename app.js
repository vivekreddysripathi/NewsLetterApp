// 71dcd5ab11168431b0c4bd590d7c4153-us13  This is mailchimp api key
// 1abbc588a5 This is Audience List ID

import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

import bodyParser from 'body-parser';

 
const app = express();

app.use(express.static("public"));   // responsible for redering local static css and images into the server

app.use(bodyParser.urlencoded({extended:true}));
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", function(req,res){    // Here we define what happens when a user goes to this page

    res.sendFile(path.join(__dirname, "signUp.html"));
});

app.post("/", function(req,res){
    const firstName= req.body.fName;
    const secondName= req.body.LName;
    const email= req.body.email;

    const data={
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: secondName
            }
        }]
    };

    const jsonData= JSON.stringify(data);

    const url= "https://us13.api.mailchimp.com/3.0/lists/1abbc588a5";

    const options={
        method: "post",
        auth: "vivek:71dcd5ab11168431b0c4bd590d7c4153-us13"
    }

    const request= https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(path.join(__dirname, "success.html"));
        }else{
            res.sendFile(path.join(__dirname, "failure.html"));
        }
        response.on('data', function(d){
            console.log(JSON.parse(d));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){    // this ia a dynamic port that heroku will deploy our app to
    console.log("Server has started on port 3000");
})