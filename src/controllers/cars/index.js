const pool = require("../../config/db");

class Cars{
    async getCars(req, res){
        try {
            const cars = await pool.query("SELECT name, year, type, manufacture, price, image FROM cars");
            res.status(200).json(cars.rows);
        } catch (error) {
            res.status(500).json("Internal Server Error");
            console.log({ message: error.message });
        }
    }

    async getCarById(req, res){
        const { id } = req.params;
        console.log(id);
        try {
            const car = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);
            res.status(200).json(car.rows[0]);
        } catch (error) {
            res.status(500).json("Internal Server Error");
            console.log({ message: error.message });
        }
    }

    async createCar(req, res){
        const { name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available } = req.body;
        try {
            const newCar = await pool.query("INSERT INTO cars (name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available]);
            res.status(201).json({ message: "Car created successfully", car: newCar.rows[0] });
        } catch (error) {
            res.status(500).json("Internal Server Error");
            console.log({ message: error.message });
        }
    }

    async updateCar(req, res){
        const { id } = req.params;
        const { name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available } = req.body;
        try {
            const updatedCar = await pool.query("UPDATE cars SET name = $1, year = $2, type = $3, manufacture = $4, price = $5, image = $6, license_no = $7, seat = $8, baggage = $9, transmission = $10, description = $11, is_driver = $12, is_available = $13 WHERE id = $14 RETURNING *", [name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available, id]);
            res.status(200).json({ message: "Car updated successfully", car: updatedCar.rows[0] });
        } catch (error) {
            res.status(500).json("Internal Server Error");
            console.log({ message: error.message });
        }
    }

    async deleteCar(req, res){
        const { id } = req.params;
        try {
            const deletedCar = await pool.query("DELETE FROM cars WHERE id = $1 RETURNING *", [id]);
            if (deletedCar.rowCount === 0) {
                return res.status(404).json({ message: "Car not found" });
            }
            res.status(200).json({ message: "Car deleted successfully", car: deletedCar.rows[0] });
        } catch (error) {
            res.status(500).json("Internal Server Error");
            console.log({ message: error.message });
        }
    }

    // this query can be SQL Injection
    // async getCarById(req, res){
    //     const { id } = req.params;
    //     console.log(id);
    //     try {
    //         const car = await pool.query(`SELECT * FROM cars WHERE id = ${id}`);
    //         res.status(200).json(car);
    //     } catch (error) {
    //         res.status(500).json("Internal Server Error");
    //         console.log({ message: error.message });
    //     }
    // }
    
    
}

module.exports = new Cars();