const validation = require("../middlewares/validation");
const { Prisma } = require("@prisma/client");
const checkUniques = require("../middlewares/checkUnique");
const encrypt = require("../middlewares/encrypt");
const { generateXLSX, readXLSX } = require("../helpers/xlsx");

// abstract class
class BaseController {
  constructor(model) {
    this.model = model;
    this.validation = validation;
    this.encryptPass = encrypt;
  }
  getAll = async (req, res, next) => {
    try {
      let {
        sortBy = "created_dt",
        sort = "desc",
        page = 1,
        limit = 10,
        search = undefined,
      } = req.query;

      if (search) search = this.handleSearch(search);
      if (this.filter) {
        search = {
          ...search,
          AND: this.filter,
        };
      }
      const { resources, count } = await this.model.get({
        q: {
          sortBy,
          sort,
          page,
          limit,
        },
        where: search,
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
      const { id } = req.params;
      const resource = await this.model.getById(id);
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

  export = (title) => {
    return async (req, res, next) => {
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
        select: undefined,
      });

      generateXLSX(title, resources, res);
    };
  };

  import = async (req, res, next) => {
    try {
      const { file } = req;
      const allowedFile = [
        "application/vnd.ms-excel", //xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //xlsx
      ];

      if (allowedFile.includes(file.mimetype) === false) {
        return next(new ValidationError("File not allowed"));
      }

      const data = readXLSX(file.buffer);

      if (!data) {
        return next(new ValidationError("Data is empty or corrupted!"));
      }

      const modifiedData = data.map((item) => ({
        ...item,
        is_driver: item.is_driver.toLowerCase() === "true",
        is_available: item.is_available.toLowerCase() === "true",
      }));

      const importData = await this.model.setMany(modifiedData);

      return res.status(200).json(
        this.apiSend({
          code: 200,
          message: "Imported successfully",
          status: "success",
          data: importData,
        })
      );
    } catch (e) {
      console.log(e);
      next(new ServerError("Something went wrong"));
    }
  };

  //fungsi ini digunakan untuk menghandle pencarian data
  //fungsi ini akan mengembalikan object yang berisi key "OR" dan value berupa array of object
  //setiap object dalam array memiliki key sama dengan field yang ada di model dan value berupa object yang memiliki key "contains" dan "mode"
  //key "contains" berisi nilai yang akan dicari dan key "mode" berisi nilai "insensitive" yang berarti pencarian tidak akan memperhatikan huruf besar/kecil

  handleSearch = (search) => {
    const s = {
      contains: search,
      mode: "insensitive",
    };

    return {
      OR: this.searchField.map((e) => ({ [e]: s })),
    };
  };
}

module.exports = BaseController;
