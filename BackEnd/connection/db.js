const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'govcarpeta.c0lmy47n0wae.us-east-1.rds.amazonaws.com',
    user: 'root',
    password: 'pruebaeafit',
    database: 'govCarpeta',
    port: '3306'
});


connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = connection;