const EventEmitter=require('events')
url="http://test.com/test";

class Logger extends EventEmitter {
 log(message){
    console.log(message);
    this.emit("messageLogged",{id:1,test:'test'});
}
}
module.exports=Logger;
module.exports.endpoint=url;