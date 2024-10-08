const validation = require("../middlewares/validation");
const { Prisma } = require("@prisma/client");
const checkUniques = require("../middlewares/checkUnique");
const encrypt = require("../middlewares/encrypt");

// abstract class
class BaseController {
  constructor(model) {
    this.model = model;
    this.validation = validation;
    this.encryptPass = encrypt;
  }
  getAll = async (req, res, next) => {
    try {
      const {
        sortBy = "created_dt",
        sort = "desc",
        page = 1,
        limit = 10,
      } = req.query;
      const { resources, count } = await this.model.get({
        q: {
          sortBy,
          sort,
          page,
          limit,
        },
      });
      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Data fetched successfully",
          data: resources,
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
          },
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };

  get = async (req, res, next) => {
    try {
      const resource = await this.model.getById(req.params.id);
      if (!resource) {
        next(new NotFoundError());
      }
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data fetched successfully",
          data: resource,
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };

  create = async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        created_by: req.user.full_name,
      };
      const resource = await this.model.set(data);
      return res.status(201).json(
        this.apiSend({
          status: "success",
          message: "Data created successfully",
          data: resource,
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };

  update = async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        updated_by: req.user.full_name,
      };
      const resource = await this.model.update(req.params.id, data);
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data updated successfully",
          data: resource,
        })
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          next(
            new NotFoundError(error, `Data with id ${req.params.id} not found!`)
          );
        }
      }
      next(new ServerError(error));
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.model.delete(req.params.id);
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: `Data with id ${req.params.id} deleted successfully`,
        })
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          next(
            new NotFoundError(error, `Data with id ${req.params.id} not found!`)
          );
        }
      }
      next(new ServerError(error));
    }
  };

  apiSend = ({ code, status, message, data, pagination }) => {
    return {
      code,
      status,
      message,
      data,
      ...(pagination && pagination),
    };
  };

  checkUnique = (req, res, next) => {
    checkUniques(this.model, req, res, next);
  };
}

module.exports = BaseController;
