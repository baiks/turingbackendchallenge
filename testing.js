var express = require('express');
var router = express.Router();

router.get('/testing', function (req, res) {
   res.send('API is accessible.');
});
router.post('/testing', function (req, res) {
   res.send('API is accessible.');
});

//export this router to use in our index.js
module.exports = router;