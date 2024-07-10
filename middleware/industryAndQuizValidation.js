const Joi = require("joi");


// Middleware for Adding a Industry Introductions
const validateSaveIntro = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }
  
  const schema = Joi.object({
    id: Joi.string().required(),
    introduction: Joi.string().min(3).required(),
    user_id: Joi.required(),
    admin_id: Joi.required()
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

// Middleware for Updating a challenge
const validateSaveChallenge = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }
  console.log("validateSaveChallenge IS RUN ")
  const schema = Joi.object({
    challenge_id: Joi.string().required(),
    challenge_name: Joi.string().min(3).required(),
    challenge_description: Joi.string().min(3).required(),
    challenge_content: Joi.string().min(3).required(),
    user_id: Joi.required(),
    admin_id: Joi.required()
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

// Middleware for Adding a challenge
const validateAddChallenge = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }
  const schema = Joi.object({
      id: Joi.string().required(),
      name: Joi.string().min(3).required(),
      description: Joi.string().min(3).required(),
      content: Joi.string().min(3).required(),
      user_id: Joi.required(),
      admin_id: Joi.required()
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

// Middleware for Deleting a challenge
const validateDeleteChallenge = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }
  const schema = Joi.object({
      user_id: Joi.required(),
      admin_id: Joi.required()
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

// Middleware for updating a question
const validateUpdateQuestion = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }

  const schema = Joi.object({
      question_id: Joi.number().integer().required(),
      question_text: Joi.string().min(3).required(),
      options: Joi.array().items(
          Joi.object({
              option_id: Joi.string().required(),
              option_text: Joi.string().min(1).required()
          })
      ).length(4).required(),
      correct_option_id: Joi.string().required(),
      user_id: Joi.required(),
      admin_id: Joi.required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ message: "Validation error", errors });
  }

  next();
};

// Middleware for creating a new question
const validateCreateQuestion = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }
  const schema = Joi.object({
      industry_id: Joi.string().required(),
      question_text: Joi.string().min(3).required(),
      options: Joi.array().items(
          Joi.object({
              option_text: Joi.string().min(1).required()
          })
      ).length(4).required(),
      correct_option_id: Joi.number().integer().valid(1, 2, 3, 4).required(),
      user_id: Joi.required(),
      admin_id: Joi.required()
    });

  const { error } = schema.validate(req.body, { abortEarly: false });
  console.log("Got called")
  if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ message: "Validation error", errors });
  }

  next();
};

// Middleware for deleting a question
const validateDeleteQuestion = (req, res, next) => {
  if (checkForIds(req)){
    res.status(402).json({ message: "Access Error", details: ["You must login to change data."] });
    return;
  }

  const schema = Joi.object({
      question_id: Joi.number().integer().required(),
      user_id: Joi.required(),
      admin_id: Joi.required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ message: "Validation error", errors });
  }

  next();
};


// Check if user_id or admin_id is null
const checkForIds = (req)=>{
  if (!req.body.user_id && !req.body.admin_id) {
    console.log("Goes through if")
    return true; 
  }
}

module.exports = {
    validateSaveIntro,
    validateSaveChallenge,
    validateAddChallenge,
    validateDeleteChallenge,
    validateUpdateQuestion,
    validateCreateQuestion,
    validateDeleteQuestion
};