var fetch = require('node-fetch');
const Config = require('./../config')
const config = new Config();
var initconfig = JSON.parse(config.config());

module.exports.getUser = (useraccesstoken) => {

    let appToken;
    console.log("Config:: " + initconfig.FacebookApp.client_id);
    let url = 'https://graph.facebook.com/oauth/access_token?client_id=' + initconfig.FacebookApp.client_id + '&client_secret=' + initconfig.FacebookApp.client_secret + '&grant_type=client_credentials';
    //login as a facebook app to get an "app token"
    return fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(response => {
            appToken = response.access_token;
            //validate "social token", must pass the "app token"
            console.log("Access Token is:: " + appToken);
            return fetch('https://graph.facebook.com/debug_token?input_token=' + useraccesstoken + '&access_token=' + appToken, {
                method: 'GET',
            })
        })
        .then(response => response.json())
        .then(response => {
            //check the audience of the token
            console.log("User ID found:: " + response.data.user_id);
            const { app_id, is_valid, user_id } = response.data
            if (app_id !== client_id) {
                throw new Error('invalid app id: expected [' + client_id + '] but was [' + app_id + ']');
            }
            //check if the token is valid
            if (!is_valid) {
                throw new Error('token is not valid');
            }
            //get user profile using the app token
            return fetch('https://graph.facebook.com/v2.11/' + user_id + '?fields=id,name,picture,email&access_token=' + appToken, {
                method: 'GET',
            })

        })
        .then(response => response.json())
        .then(response => {
            // return the user profile
            const { id, picture, email, name } = response;
            let user = {
                name: name,
                pic: picture.data.url,
                id: id,
                email_verified: true,
                email: email
            }
            console.log("Email found:: " + user.email);
            return user;
        })
        //throw an error if something goes wrong
        .catch(err => {
            throw new Error("error while authenticating facebook user: " + JSON.stringify(err));
        });


}