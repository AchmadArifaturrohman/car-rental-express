const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["query", "warn", "error", "info"],
});

// abstract class
class BaseModel {
  // Encapsulation
  // #pass = "123456"; // private variable // Car Model tidak bisa mengakses pass ini
  constructor(model) {
    this.model = prisma[model];
  }

  get = async ({ where, include, query = {}, select = this.select }) => {
    const {
      sortBy = "created_dt",
      sort = "desc",
      page = 1,
      limit = 10,
    } = query;
    const queries = {
      select,
      where,
      include,
      orderBy: {
        [sortBy]: sort,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [resources, count] = await prisma.$transaction([
      this.model.findMany(queries),
      this.model.count(queries),
    ]);

    return {
      resources,
      count,
    };
  };

  getById = async (id, select) => {
    return this.model.findUnique({
      where: { id: Number(id) },
      select,
    });
  };

  getOne = async (query) => {
    return this.model.findFirst(query);
  };

  update = (id, data) => {
    return this.model.update({ where: { id: Number(id) }, data });
  };

  set = (data) => {
    return this.model.create({ data });
  };

  delete = async (id) => {
    return this.model.delete({ where: { id: Number(id) } });
  };

  count = async () => {
    return this.model.count({ where: this.where });
  };

  transaction = async (query) => {
    return prisma.$transaction(query);
  };

  setMany = (data) => {
    return this.model.createMany({ data });
  };
}

module.exports = BaseModel;
