var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:33270";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

    //Insert One record
    // var myobj = { Fname: "Paul", Lname: "Kimani",Age: "16","CustID": "13" };
    // dbo.collection("customers").insertOne(myobj, function (err, res) {
    //     if (err) throw err;
    //     console.log("1 document inserted: "+res);
    //     db.close();
    // });
    // var myobj = { AccountNo: "0100000023456","CustID": "13" };
    // dbo.collection("accounts").insertOne(myobj, function (err, res) {
    //     if (err) throw err;
    //     console.log("1 account inserted: "+res);
    //     db.close();
    // });

    //Insert Many records
    var myobj =
        [
            { Fname: "Paul", Lname: "Kimani", Age: "16" },
            { Fname: "Germaine", Lname: "Kabaiku", Age: "1" }
        ];
    // dbo.collection("customers").insertMany(myobj, function (err, res) {
    //     if (err) throw err;
    //     console.log("Number of documents inserted: " + res.insertedCount);
    //     db.close();
    // });

    //Find only One
    // dbo.collection("customers").findOne({}, function (err, res) {
    //     if (err) throw err;
    //     console.log(res.name);
    //     db.close();
    // });

    //Find many
    //Include 1 & Exclude 0
    //1 ascending order
    //-1 descending order
    // var filter = {};
    // var sort = { Fname: -1 } //
    // dbo.collection("customers").find(filter, { projection: { _id: 0 } }).sort(sort).limit(10).toArray(function (err, res) {
    //     if (err) throw err;
    //     console.log(res);
    //     db.close();
    // });


    //Delete
    // var delfilter = { Fname: 'Germaine' };
    // dbo.collection("customers").deleteMany(delfilter, function (err, res) {
    //     if (err) throw err;
    //     console.log('Data deleted successfully');
    //     db.close();
    // });

    //Drop data
    // dbo.collection("customers").drop(function(err, delOK) {
    //     if (err) throw err;
    //     if (delOK) console.log("Collection deleted");
    //     db.close();
    //   });

    //Update one
    // var updatefilter = { Fname: 'Paul' };
    // var updatevalues = { $set: { Fname: 'Jakon', Age: 98 } };
    // dbo.collection("customers").updateMany(updatefilter, updatevalues, function (err, delOK) {
    //     if (err) throw err;
    //     if (delOK) console.log("1 document updated");
    //     db.close();
    // });

    //Join
    dbo.collection('customers').aggregate([
        { $lookup:
           {
             from: 'accounts',
             localField: 'CustID',
             foreignField: 'CustID',
             as: 'custdetails'
           }
         }
        ]).toArray(function(err, res) {
        if (err) throw err;
        console.log(JSON.stringify(res));
        db.close();
      });
});