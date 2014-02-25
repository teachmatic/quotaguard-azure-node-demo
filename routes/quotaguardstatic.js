var http, options, proxy, url;
var _ = require('lodash');
/*
 * GET home page.
 */

exports.index = function(req, res){
var finished = _.after(2, doRender);

http = require("http");

url = require("url");

proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);
target  = url.parse("http://ip.jsontest.com/");

var azure_options = {
    host: target.hostname,
    path: target.href
};
options = {
  hostname: proxy.hostname,
  port: proxy.port || 80,
  path: target.href,
  headers: {
    "Proxy-Authorization": "Basic " + (new Buffer(proxy.auth).toString("base64")),
    "Host" : target.hostname
  }
};

// Get the IP of current Windows Azure machine
var azure_data = "";
http.get(azure_options, function(http_res) { 
    http_res.on("data", function (chunk) {
        azure_data += chunk;
    });

    http_res.on("end", function () {
        finished();
    });
});

// Get the Static IP of requests made through QuotaGuard Static proxy
var data = "";
http.get(options, function(http_res) { 
	    // this event fires many times, each time collecting another piece of the response
    http_res.on("data", function (chunk) {
        data += chunk;
    });

    // this event fires *one* time, after all the `data` events/chunks have been gathered
    http_res.on("end", function () {
        // you can use res.send instead of console.log to output via express        
        finished();
    });
});

function doRender(){
  console.log(data);
  console.log(azure_data);
  res.render('quotaguardstatic', { title: 'QuotaGuard Static Demo', data: data, azure_data: azure_data });
} 
  
};