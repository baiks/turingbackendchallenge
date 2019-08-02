var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "nodetest"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    //1. Create Database
    // con.query("CREATE DATABASE nodetest", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database created");
    // });

    //2. Create table
    // var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table created");
    // });

    //3. Insert data
    var sql = "INSERT INTO customers (name, address) VALUES ('Njie', 'Test 67')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows);
    })

    //4. Select data
    var address='Highway 37';
    //var sql = "SELECT * FROM customers where address='"+address+"'";
    //var sql = "SELECT * FROM customers order by name";
    // var sql = "UPDATE customers set name='Baiks' where address='"+address+"'";
    // con.query(sql, function (err, result,fields) {
    //     if (err) throw err;
    //     console.log(result.affectedRows);
    // })

});