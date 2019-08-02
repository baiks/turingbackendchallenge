var fs = require("fs");
var file = __dirname + "/config.json";

class Config {
    config() {
        return fs.readFileSync(file);
    }
}
module.exports = Config;
