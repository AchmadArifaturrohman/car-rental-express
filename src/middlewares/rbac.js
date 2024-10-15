// req.user -> role
// role -> data access
const { equal } = require("joi");
const AccessModel = require("../models/access");
const ValidationError = require("../helpers/errors/validation");
const access = new AccessModel();

function rbac(menuParam, accessParam) {
  return async (req, res, next) => {
    const roleId = req.user.role_id;
    if (roleId === 1) return next();
    const accessByRole = await access.getOne({
      where: {
        role_id: roleId,
        grant: { path: [accessParam], equals: true },
        menu: { is: { name: menuParam } },
      },
    });
    // select * from access a
    // join menu m on a.menu_id = m.id
    // where a.role_id = roleId and grant = { [$access] = true} and m.name = $menu

    if (!accessByRole) return next(new ValidationError("Forbidden"));
    return next();
  };
}

module.exports = rbac;
