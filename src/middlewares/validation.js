function validation(schema) {
  return async function (req, res, next) {
    try {
      const valid = await schema
        .options({ abortEarly: false })
        .validateAsync(req.body);

      if (valid.error) {
        throw new Error(valid.error.message);
      }

      next();
    } catch (error) {
      const errMap = error?.details.map((item) => {
        const { type, message } = item;
        const path = item.path.join(".");
        return { path, type, message };
      });
      console.log(errMap);
      // eslint-disable-next-line no-undef
      next(new ValidationError(errMap));
    }
  };
}

module.exports = validation;
