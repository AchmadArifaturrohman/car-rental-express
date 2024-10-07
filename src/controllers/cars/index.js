const Joi = require("joi");

const BaseController = require("../base");
const CarModel = require("../../models/cars");

const express = require("express");
const router = express.Router();

const cars = new CarModel();

const carSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string(),
  manufacture: Joi.string().required(),
  is_driver: Joi.boolean().required(),
  image: Joi.string().uri().allow(null),
  description: Joi.string().allow(null),
  is_available: Joi.boolean(),
  license_no: Joi.string(),
  seat: Joi.number().min(2),
  baggage: Joi.number(),
  transmission: Joi.string(),
  year: Joi.string(),
});

class CarsController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post("/", this.validation(carSchema), this.create);
    router.get("/:id", this.get);
    router.put("/:id", this.validation(carSchema), this.update);
    router.delete("/:id", this.delete);
  }
}

new CarsController(cars);

module.exports = router;

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// class Cars{
//     async getCars(req, res){
//         try {
//             const cars = await prisma.cars.findMany( {
//                 select: {
//                     id: true,
//                     name: true,
//                     year: true,
//                     type: true,
//                     manufacture: true,
//                     price: true,
//                     image: true
//                 }
//             }
//             );
//             res.status(200).json(cars);
//         } catch (error) {
//             res.status(500).json("Internal Server Error");
//             console.log({ message: error.message });
//         }
//     }

//     async getCarById(req, res){
//         const { id } = req.params;
//         console.log(id);
//         try {
//             const car = await prisma.cars.findUnique({
//                 where: {
//                     id: parseInt(id)
//                 }
//             });
//             res.status(200).json(car);
//         } catch (error) {
//             res.status(500).json("Internal Server Error");
//             console.log({ message: error.message });
//         }
//     }

//     async createCar(req, res){
//         const { name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available } = req.body;
//         try {
//             const newCar = await prisma.cars.create({
//                 data: {
//                     name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available
//                 }
//             });
//             res.status(201).json({ message: "Car created successfully", car: newCar });
//         } catch (error) {
//             res.status(500).json("Internal Server Error");
//             console.log({ message: error.message });
//         }
//     }

//     async updateCar(req, res){
//         const { id } = req.params;
//         const { name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available } = req.body;
//         try {
//             const updatedCar = await prisma.cars.update({
//                 where: {
//                     id: parseInt(id)
//                 },
//                 data: {
//                     name, year, type, manufacture, price, image, license_no, seat, baggage, transmission, description, is_driver, is_available
//                 }
//             });
//             res.status(200).json({ message: "Car updated successfully", car: updatedCar });
//         } catch (error) {
//             res.status(500).json("Internal Server Error");
//             console.log({ message: error.message });
//         }
//     }

//     async deleteCar(req, res){
//         const { id } = req.params;
//         try {
//             const deletedCar = await prisma.cars.delete({
//                 where: {
//                     id: parseInt(id)
//                 }
//             });
//             if (deletedCar.rowCount === 0) {
//                 return res.status(404).json({ message: "Car not found" });
//             }
//             res.status(200).json({ message: "Car deleted successfully"});
//         } catch (error) {
//             res.status(500).json("Internal Server Error");
//             console.log({ message: error.message });
//         }
//     }

//     // this query can be SQL Injection
//     // async getCarById(req, res){
//     //     const { id } = req.params;
//     //     console.log(id);
//     //     try {
//     //         const car = await pool.query(`SELECT * FROM cars WHERE id = ${id}`);
//     //         res.status(200).json(car);
//     //     } catch (error) {
//     //         res.status(500).json("Internal Server Error");
//     //         console.log({ message: error.message });
//     //     }
//     // }

// }

// module.exports = new Cars();
