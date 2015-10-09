# InfluxDB data generator
##### TODO: Proper readme and a refactor. Be patient, I will do it.

## What is it

It's a simple data generator to fill InfluxDB so you can play with either Influx or Grafana. It generates random points in two measurements (cpu_idle and customer_events) for every second, for the last 24 hours. After the generation is done, application starts to generate random points every second continuously. It adds tags to the data sent to Influx so you have more toys to play with.

## Prerequisites

Install node.js and npm:

`sudo apt-get install nodejs npm`

Install influx package using npm:

`npm install influx`

## Run

Hit:

`nodejs app.js`

Application will inform you when it's done generating points from the past. That's all.

## Credits
Credit goes to [stackflow](http://stackoverflow.com/users/4132820/stackflow) from [this thread](http://stackoverflow.com/questions/26317397/influxdb-error-no-host-available). I took his code and fixed it, also added a few tweaks.
