const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const checkAuth = require('../authentication/auth');
const connection = require("../connection/db");

const s3ls = require("s3-ls");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: 'appstestepico'
});

router.post('/file/upload/:filename', checkAuth, function(req, res, next) {
    var email = req.userData ? req.userData.email : "";
    let queryString = "SELECT * FROM users WHERE email = " + "'" + email + "'";
    connection.createQuery(queryString, function (error, result, fields) {
        if (error || !result[0]) {
            res.send({
                "code":400,
                "msg": "failed"
            })
        } else {
            if (result && result[0]){
                userFolder = result[0].folder;
            }
        }
    });

    var filename = req.params.filename;
    const file = req.files.file;
    var userFolder = "unknown";

    uploadFile(filename, file, userFolder);
});

router.get('/file/list', checkAuth, async function(req, res, next) {
    const lister = s3ls({ bucket: "appstestepico", s3: s3 });
    const { files } = await lister.ls("/JCAP/Classification/");
    res.send({
        "code":200,
        "msg": "failed",
        "content": files
    })
});

const uploadFile = (filename, file) => {
    const params = {
        Bucket: 'appstestepico', // pass your bucket name
        Key: filename, // file will be saved as testBucket/contacts.csv
        Body: JSON.stringify(file, null, 2)
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
};

module.exports = router;