// const Logger=require('./logger')
// const logger=new Logger();
// const EventEmitter=require('events')

// logger.on('messageLogged',function(e){
//     console.log('Listener Called',e);
// });
// logger.on('messageLogged',(e)=>{
//     console.log('Listener Called',e);
// });

// logger.log("some message");
var jwt = require("./JWT/JWT");
var payload = {
    data1: "Data 1",
    data2: "Data 2",
    data3: "Data 3",
    data4: "Data 4",
};
console.log(jwt.sign(payload));
//console.log(jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhMSI6IkRhdGEgMSIsImRhdGEyIjoiRGF0YSAyIiwiZGF0YTMiOiJEYXRhIDMiLCJkYXRhNCI6IkRhdGEgNCIsImlhdCI6MTU2NDY5MzEyNiwiZXhwIjoxNTY0Nzc5NTI2fQ.nFCVB5p-jw9Vgxtt-zDGSIat1pQvW4PtjzYOoSGKp5g"));