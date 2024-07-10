const Joi = require("joi");

const validatePost = (req, res, next) => {
  const schema = Joi.object({
    header: Joi.string().max(50).required(),
    message: Joi.string().max(300).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

const validateComments = (req, res, next) => {
  const schema = Joi.object({
    comment: Joi.string().max(100).required(),
    post_id: Joi.any().strip(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = {
    validatePost,
    validateComments
};