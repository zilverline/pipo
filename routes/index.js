var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res) {
  res.json({
    hello: "world"
  });
});

module.exports = router;
