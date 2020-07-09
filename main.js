  
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs') ;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// some variables
let deviceSelected ; 
let deviceData ;
let newDeviceData ;
let updatedData ;

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
    res.render('customize/customize.ejs' , { deviceName : deviceSelected , newDeviceData : newDeviceData });
});

router.get('/customize' , (req,res)=>{
    res.render('customize/customize.ejs' , { deviceName : deviceSelected , newDeviceData : newDeviceData });
});

//handling generate button request
router.post('/generate' , urlencodedParser , (req,res)=>{
    modifValueMap(req.body) ; 
    const data = JSON.stringify(newDeviceData , null ,2);
    fs.writeFile('data.json' , data  , (e)=>{
        if (e) throw e ;  
    }) ; 
    res.render('generate/generate.ejs' , { deviceName : deviceSelected});
});

//add the router
app.use('/', router);
app.listen( 3000);

console.log('Running at Port 3000');


function modifyData( info ){
    let newData = {'mapType' : {"capability":[] ,"resourceType":[] , "resourceHref":[] } , 'mapData' : {}}  ;
    const capability =   deviceData.mapType.capability;
    const resourceType = deviceData.mapType.resourceType ;
    const resourceHref = deviceData.mapType.resourceHref ;
    for (i=0 ; i<capability.length ; i++){
        if (typeof(info[capability[i][0]]) != typeof('hey')) {
            newData['mapType']['capability'].push(capability[i]);
            newData['mapType']['resourceType'].push(resourceType[i]);
            newData['mapType']['resourceHref'].push(info[capability[i][0]][1]);
            newData['mapData'][capability[i][0]] = deviceData['mapData'][capability[i][0]]
        }
    }
    return newData ; 
}

function modifValueMap( info ){
    const capability =   newDeviceData.mapType.capability;
    for (i=0 ; i<capability.length ; i++){

        if ( "valueMap" in newDeviceData["mapData"][capability[i][0]] ){
            let valueMap = newDeviceData["mapData"][capability[i][0]]['valueMap'][0] ;

            for(j=0 ; j<valueMap["STValue"].length ; j++){
                if (typeof(info[capability[i][0]+valueMap["STValue"][j]]) != typeof('hey')){
                    newDeviceData['mapData'][capability[i][0]]['valueMap'][0]['OCFValue'][j] = info[capability[i][0]+valueMap["STValue"][j]][1] ; 
                }
            }
        }
    }
}