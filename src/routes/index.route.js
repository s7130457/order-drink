const express = require('express')
const router = express.Router();


router.get('/', function(req, res) {
  console.log('hi');
  
  return res.send('Test website api')
})




module.exports = router
