var influx = require('influx');
var client = influx({
    host: 'localhost',
    port: 8086,
    username: 'root',
    password: 'root',
    database: 'data'
});

var data = {};
// start time of 24 hours ago
var backMilliseconds = 8600 * 10000;

var startTime = new Date() - backMilliseconds;

var timeInterval = 1000;

var eventTypes = ["click", "view", "post", "comment"];

var cpuSeries = [];

var eventSeries = [];

client.createDatabase('data', function() {
  console.log('creating database data', arguments);
});

for (i = 0; i < backMilliseconds; i += timeInterval) {
  generatePointInAllSeries(startTime + i);
}

client.writePoints("cpu_idle", cpuSeries, {}, function(err){
    if(err) {
        console.log("Cannot write data",err);
    }
});
client.writePoints("customer_events", eventSeries, {}, function(err){
    if(err) {
        console.log("Cannot write data",err);
    }
});

console.log("Generated points for the last 24 hours. Starting continuous generation.");

setInterval(function() {
    generatePointInAllSeries(new Date());

    var lastCpuPoint = cpuSeries[cpuSeries.length-1];
    client.writePoint("cpu_idle", lastCpuPoint[0], lastCpuPoint[1], {}, function(err){
        if(err) {
            console.log("Cannot write data",err);
        }
    });

    var lastEventPoint = eventSeries[eventSeries.length-1];
    client.writePoint("customer_events", lastEventPoint[0], lastEventPoint[1], {}, function(err){
        if(err) {
            console.log("Cannot write data",err);
        }
    });
}, 1000);

function generatePointInAllSeries(time) {
  // generate fake cpu idle host values
  var hostName = "server" + Math.floor(Math.random() * 1000 % 4);
  var xvalue = Math.random() * 100;
  cpuSeries.push([{value: xvalue, time: time}, {host: hostName}]);

  // generate some fake customer events
  for (j = 0; j < Math.random() * 10; j += 1) {
    var customerId = Math.floor(Math.random() * 1000);
    var eventTypeIndex = Math.floor(Math.random() * 1000 % 4);
    eventSeries.push([{value: customerId, time: time},{type: eventTypes[eventTypeIndex]}]);
  }
}