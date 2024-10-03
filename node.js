const http = require("http");
const fs = require("fs");
const url = require("url");

function onRequest(req, res) {
    const data_cars = fs.readFileSync("cars.json", "utf-8")
    const query = url.parse(req.url, true).query;
    const dataParse = JSON.parse(data_cars);

    const search = query.name ? dataParse.cars.find((car) => car.name == query.name) : dataParse;

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    console.log(query)
    res.write(JSON.stringify(search));
    res.end();
}

const server = http.createServer(onRequest);
server.listen(3111)