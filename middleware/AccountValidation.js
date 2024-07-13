const Joi = require('joi');

const validateAccountUser = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        user_email: Joi.string().max(50).required(),
        user_phonenumber: Joi.string().min(8).required(),
        user_password: Joi.string().min(3).required(),
        user_role: Joi.string().default('user')
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => {
            // Customize error messages for display
            switch (error.context.key) {
                case 'username':
                    return 'Username must be at least 5 characters long';
                case 'user_email':
                    return 'Invalid email format';
                case 'user_phonenumber':
                    return 'Phone number must be at least 8 characters long';
                case 'user_password':
                    return 'Password must be at least 3 characters long';
                default:
                    return error.message.replace(/["]/g, '');
            }
        });
        return res.status(400).json({ message: 'Validation error', errors });
    }

    next();
};

const validateAccountAdmin = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        user_email: Joi.string().max(50).required(),
        user_phonenumber: Joi.string().min(8).required(),
        user_password: Joi.string().min(3).required(),
        user_role: Joi.string().default('admin'),
        security_code: Joi.string().required()
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => {
            // Customize error messages for display
            switch (error.context.key) {
                case 'username':
                    return 'Username must be at least 5 characters long';
                case 'user_email':
                    return 'Invalid email format';
                case 'user_phonenumber':
                    return 'Phone number must be at least 8 characters long';
                case 'user_password':
                    return 'Password must be at least 3 characters long';
                case 'security_code':
                    return 'Security code is required';
                default:
                    return error.message.replace(/["]/g, '');
            }
        });
        return res.status(400).json({ message: 'Validation error', errors });
    }

    next();
};


module.exports = { validateAccountUser, validateAccountAdmin };
