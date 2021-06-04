const express = require('express');
const connection = require("../connection/db");
const request = require('request');
const router = express.Router();
const AWS = require('aws-sdk');
const checkAuth = require('../authentication/auth');

const s3ls = require("s3-ls");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: 'appstestepico',
    signatureVersion: 'v4'
});

router.post('/file/upload/:filename/:title', checkAuth, async function(req, res, next) {
    var email = req.userData ? req.userData.email : "";
    let queryString = "SELECT * FROM users WHERE email = " + "'" + email + "'";
    var userFolder = "unknown";
    var document = "unknown";


    await connection.query(queryString, function (error, result, fields) {
        if (error || !result[0]) {
            res.send({
                "code":400,
                "msg": "failed"
            })
        } else {
            if (result && result[0]){
                userFolder = result[0].folder;
                document = result[0].document;
                var filename = req.params.filename;
                var title = req.params.title;
                const file = req.files.file;
                if (userFolder !== "unknown" && filename && title){
                    uploadFile(filename, file, userFolder, document, title,res);
                }

            }
        }
    });


});

router.get('/file/list', checkAuth, async function(req, res, next) {
    const lister = s3ls({ bucket: "appstestepico", s3: s3 });
    var email = req.userData ? req.userData.email : "";
    let queryString = "SELECT * FROM users WHERE email = " + "'" + email + "'";
    var userFolder = "unknown";

    await connection.query(queryString, async function (error, result, fields) {
        if (error || !result[0]) {
            res.send({
                "code":400,
                "msg": "failed"
            })
        } else {
            if (result && result[0]){
                userFolder = result[0].folder;
                const { files } = await lister.ls(userFolder);
                res.send({
                    "code":200,
                    "msg": "success",
                    "content": files
                })
            }
        }
    });

});

const uploadFile = (filename, file, userFolder, document, title, serverResponse) => {
    let key = userFolder + "/" + filename;
    const myBucket = 'appstestepico'
    const signedUrlExpireSeconds = 60 * 5
    const params = {
        Bucket: myBucket, // pass your bucket name
        Key: key, // file will be saved as testBucket/contacts.csv
        Body: JSON.stringify(file, null, 2)
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) serverResponse.send({ "code":400, "msg": "Error subiendo y autenticando el archivo. intente de nuevo" })

        const url = s3.getSignedUrl('getObject', {
            Bucket: myBucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        })

        let encodedURl= url.toString().replace(/\//g, '%2F').replace(/\?/g, '%3F').replace(/\:/g, '%3B').replace(/\=/g, '%3D').replace(/\&/g, '%26');

        let uriRegister = 'https://govcarpetaapp.mybluemix.net/apis/authenticateDocument/' + document + '/' + encodedURl +'/'+ title;
        request.get(uriRegister, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (res.statusCode === 200){
                serverResponse.send({ "code":200, "msg": "Archivo correctamente subido y autenticado: "  + filename })
            }else{
                serverResponse.send({ "code":400, "msg": "El archivo se subio correctamente a su carpeta pero no ha podido ser atuenticado" })
            }
        });
    });
};

module.exports = router;