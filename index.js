const express = require("express");
const http = require("http");
const PORT = 3111;
const pg = require("pg");
const { Client } = pg;

const app = express();
const server = http.createServer(app);

app.use(express.json()); // Sebagai middleware untuk mengubah req.body menjadi JSON

const client = new Client({
    host: "localhost",
    port: 5431,
    user: "postgres",
    password: "1234",
    database: "car_rental"
});

client.connect((err) => {
    console.log(err)
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World");
});

app.post("/register", (req, res) => {
    console.log(req.body);
    res.status(200).send(`Register email: ${req.body.email} Success`);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Using Async/Await
app.get("/cars", async (req, res) => {
    const data = await client.query("SELECT * FROM cars");
    res.status(200).send(data.rows);
});

// Using Callback
app.get("/cars2", (req, res) => {
    client.query("SELECT * FROM cars").then((data) => {
        res.status(200).send(data.rows);
    }).catch((err) => {
        console.log(err);
    });
});

// POST
app.post("/cars", async (req, res) => {
    const { manufacture, type, license_no, seat, baggage, transmission, year, name, description, is_driver, image, price, updated_dt, created_by, updated_by } = req.body;
    console.log(req.body);
    try {
        const data = await client.query(
            `INSERT INTO cars (manufacture, type, license_no, seat, baggage, transmission, year, name, description, is_driver, image, price, updated_dt, created_by, updated_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`, 
            [manufacture, type, license_no, seat, baggage, transmission, year, name, description, is_driver, image, price, updated_dt, created_by, updated_by]
        );
        res.status(200).send(`Insert data success : ${JSON.stringify(req.body)}`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error inserting data: ${err}`);
    }
});

// PUT
app.put("/cars/:id", async (req, res) => {
    const { id } = req.params;
    const { manufacture, type, license_no, seat, baggage, transmission, year, name, description, is_driver, image, price, updated_dt, created_by, updated_by } = req.body;
    console.log(req.body);
    try {
        const data = await client.query(
            `UPDATE cars SET 
                manufacture = $1, 
                type = $2, 
                license_no = $3, 
                seat = $4, 
                baggage = $5, 
                transmission = $6, 
                year = $7, 
                name = $8, 
                description = $9, 
                is_driver = $10, 
                image = $11, 
                price = $12, 
                updated_dt = $13, 
                created_by = $14, 
                updated_by = $15 
            WHERE id = $16 RETURNING *;`, 
            [manufacture, type, license_no, seat, baggage, transmission, year, name, description, is_driver, image, price, updated_dt, created_by, updated_by, id]
        );
        res.status(200).send(`Update data success : ${JSON.stringify(req.body)}`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error updating data: ${err}`);
    }
});

// DELETE
app.delete("/cars/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await client.query("DELETE FROM cars WHERE id = $1 RETURNING *;", [id]);
        res.status(200).send(`Delete data success : ${JSON.stringify(data.rows)}`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error deleting data: ${err}`);
    }
});
