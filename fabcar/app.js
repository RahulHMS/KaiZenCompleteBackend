/**
 * Health Managment System
 * Created and Developed by Rahul M. Desai on 2018/10/20
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/


'use strict';

const express    = require('express');        
const app        = express();                
const bodyParser = require('body-parser');
const router 	   = express.Router();

const port 	   = process.env.PORT || 8080;

app.use(bodyParser.json());

require('./routes')(router);
app.use('/', router);

app.listen(port);

console.log(`App Runs on ${port}`);