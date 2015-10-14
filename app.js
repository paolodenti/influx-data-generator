/*
 * Author: Łukasz Kamiński
 * github.com/lukasz-kaminski
 * 
 * This application simulates some metrics (hardware and business) 
 * and writes them to InfluxDB so the user can play with either Influx or Grafana.
 * I am aware that it's not the cleanest code ever, but complicating this 
 * application would be an overkill.
 */
var influx = require('influx');
var DBNAME = 'data';

var client = influx({
    host: 'localhost',
    port: 8086,
    username: 'root',
    password: 'root',
    database: DBNAME
});

// start time of 24 hours ago
var backMilliseconds = 8600 * 10000;
var timeInterval = 1000; //1s
var eventTypes = ["click", "view", "post", "comment"];
var cpuSeriesCount = 3;
var startTime = new Date() - backMilliseconds;

var data = {};
var cpuSeries = [];
var eventSeries = [];

for(var i = 0; i < cpuSeriesCount; ++i) {
	cpuSeries.push([]);
}

client.createDatabase(DBNAME, function() {
  console.log('creating database ' + DBNAME, arguments);
});

generateData();

// functions

function generateData() {
	fillDBWithPastData();
	console.log("Generated points for the last 24 hours. Starting continuous generation.");
	setInterval(generatePointForAllSeries, timeInterval);
}

function fillDBWithPastData() {
	for (i = 0; i < backMilliseconds; i += timeInterval) {
		for(series = 0; series < cpuSeries.length; ++series) {
			cpuSeries[series].push(createCpuPoint(startTime + i, series));
		}
		eventSeries.push(createEventPoint(startTime + i));
	}

	for(i = 0; i < cpuSeries.length; ++i) {
		client.writePoints("cpu_idle", cpuSeries[i], {}, function(err) {
			if(err) {
        		console.log("Cannot write data",err);
    		}
    	});
	}
	client.writePoints("customer_events", eventSeries, {}, function(err) {
			if(err) {
        		console.log("Cannot write data",err);
    		}
    	});
}

function generatePointForAllSeries() {
	for(series = 0; series < cpuSeries.length; ++series) {
		var cpuPoint = createCpuPoint(new Date(), series);
		client.writePoint("cpu_idle", cpuPoint[0], cpuPoint[1], {}, function(err) {
			if(err) {
        		console.log("Cannot write data",err);
    		}
    	});
	}
	var eventPoint = createEventPoint(new Date());
	client.writePoint("customer_events", eventPoint[0], eventPoint[1], function(err) {
			if(err) {
        		console.log("Cannot write data",err);
    		}
    	});
}

function createCpuPoint(time, server_number) {
	return [{value: Math.random() * 100, time: time}, {host: "server" + server_number}];
}

function createEventPoint(time) {
    var customerId = Math.floor(Math.random() * 1000);
    var eventTypeIndex = Math.floor(Math.random() * 1000 % 4);
    return [{value: customerId, time: time},{type: eventTypes[eventTypeIndex]}];
}
