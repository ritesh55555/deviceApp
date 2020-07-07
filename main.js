  
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// some variables
let deviceSelected ; 
let deviceData ;
let newDeviceData ;

app.set('view engine', 'ejs');

//starting device page handling get and post equest
router.get('/', (req, res)=> {
    res.render('device/device.ejs');
});

router.get('/device', (req, res)=> {
    res.render('device/device.ejs');
});


//add new device page
router.get('/addDevice' , (req,res)=>{
    res.render('device/addDevice.ejs');
});


//to resource page if new device is selected
router.post('/newDeviceResource',urlencodedParser , (req,res)=>{
    deviceSelected = req.body.device ;
    res.render('resource/newDeviceResource.ejs', { deviceName : deviceSelected }  ) ;
});

// handling resource page request
router.post('/resource',urlencodedParser ,  (req,res)=>{
    deviceSelected = req.body.device ;
    deviceData =  require( `./devices/${deviceSelected}.json` ) ;
    res.render('resource/resource.ejs', { data : deviceData , deviceName : deviceSelected }  ) ; 
});

router.get('/resource' , (req,res)=>{
    res.render('resource/resource.ejs', { data : deviceData , deviceName : deviceSelected }  ) ;
});

// handling customize page request 
router.post('/customize' , urlencodedParser , (req,res)=>{
    newDeviceData = modifyData(req.body) ; 
    res.render('customize/customize.ejs' , { deviceName : deviceSelected , newDeviceData : newDeviceData , deviceData : deviceData});
});


//add the router
app.use('/', router);
app.listen( 3000);

console.log('Running at Port 3000');


function modifyData( info ){
    let newData = {}  ;
}