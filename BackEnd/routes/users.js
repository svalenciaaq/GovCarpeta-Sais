const express = require('express');
const router = express.Router();
const request = require('request');
const bcrypt = require("bcrypt");
const connection = require("../connection/db");
const jwt = require("jsonwebtoken");


router.post('/user/register', function(req, res, next) {
    let email = req.body.email;
    let document = req.body.document;
    let password = req.body.password;
    let name = req.body.name;
    let address = req.body.address;
    let canCreate = false;
    let uri = 'https://govcarpetaapp.mybluemix.net/apis/validateCitizen/' + document;
    let uriRegister = 'https://govcarpetaapp.mybluemix.net/apis/registerCitizen';

    request(uri, { json: true }, async (err, res2, body) => {
        if (err) { return console.log(err); }
        if (res2.statusCode === 200){
            res.send({
                "code":400,
                "msg": "ERROR_USER_ON_ANOTHER_OPERATOR"
            });
        }
        if (res2.statusCode === 204){
            const encryptedPassword = await bcrypt.hash(password, 10)
            var user ={
                "email":email,
                "password": encryptedPassword,
                "name": name,
                "address": address,
                "document": document,
                "folder": document + "_govCarpeta"
            }
            connection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
                if (error) {
                    res.send({
                        "code":401,
                        "msg": error.sqlMessage
                    })
                } else {
                    var bodyRegister = {
                        ...user,
                        "operatorId": 40,
                        "id": document,
                        "operatorName": "Sanisaval"
                    }
                    request.post(uriRegister, { json: true, body: bodyRegister }, (err, res2, body) => {
                        if (err) { return console.log(err); }
                        if (res2.statusCode === 201){
                            res.send({
                                "code":200,
                                "msg":"user registered sucessfully"
                            });
                        }
                        if (res2.statusCode === 500){
                            res.send({
                                "code":200,
                                "msg":"Could not register user on govCarpeta"
                            });
                        }
                    });
                }
            });
        }
    });
});


/* GET users listing. */
router.post('/user/login',function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let queryString = "SELECT * FROM users WHERE email = " + "'" + email + "'";
    connection.query(queryString, function (error, result, fields) {
        if (error || !result[0]) {
            res.send({
                "code":400,
                "msg": "failed"
            })
        } else {
            bcrypt.compare(password, result[0].password, (err, resultCompare) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (resultCompare) {
                    const token = jwt.sign(
                        {
                            email: result[0].email,
                            folder: result[0].folder,
                            userId: result[0].id
                        },
                        process.env.JWT_KEY
                    );
                    return res.status(200).json({
                        msg: "successful",
                        token: token
                    });
                }else{
                    return res.status(401).json({
                        "code":400,
                        "msg": "failed"
                    });
                }
            });
        }
    });
});

module.exports = router;
