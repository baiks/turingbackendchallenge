const http = require('http')
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (req.url === '/test') {
        console.log('Request ' + req);
        res.write('Hello Paul');
        res.end();
    }
    if (req.url === '/login') {
        console.log('Request ' + req);
        var response={
            username:'test',
            password:'1234',
            code:'00',
            message:'Success'
        }
        res.write(JSON.stringify(response));
        res.end();
    }
});
server.on('connection', (socket) => {
    console.log('New connection');
})
server.listen(9009);
console.log('Listening on port 9009')