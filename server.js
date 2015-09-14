var geoip = require('geoip-lite');

var lookupLatLng = function (ip) {
    var geoData = geoip.lookup(ip);
	return geoData && (geoData.ll || {  });
}

var lookupIPs = function (ipArr) {
    return ipArr.map(function (ip) {
        console.log('getting lat/lng for IP:', ip); 
        return lookupLatLng(ip);
    });
}



var express = require('express');
var path = require('path');
var app = express();
app.set('port', process.env.PORT || 3000);

// parsing req/res
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '500mb', parameterLimit: 10000000})); // parse application/json
app.use(bodyParser.urlencoded({ limit: '500mb', parameterLimit: 10000000, extended: true })); // to support URL-encoded bodies

// set static directory
app.use(express.static(path.join(__dirname, 'public')));
// routes
var router = express.Router();

router.get('/api/geoIp/:ip', function (req, res) {
    res.send(lookupLatLng(req.params.ip));
});

router.post('/api/geoIp/', function (req, res) {
    res.send(lookupIPs(req.body.ips));
});

app.use('/', router);

// run app
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});