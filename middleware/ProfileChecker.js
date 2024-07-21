const Joi = require('joi');

const updateProfileSchema = Joi.object({
    about_me: Joi.string().max(200).optional().messages({
        'string.max': 'About me section must not exceed 200 characters.',
    }),
    country: Joi.string().min(3).max(50).optional().messages({
        'string.min': 'Country must be at least 3 characters long.',
        'string.max': 'Country need to be lesser than 50 characters long.'
    }),
    position: Joi.string().max(50).optional().messages({
        'string.max': 'Position must not exceed 100 characters.',
    }),
    profile_picture_base64: Joi.string().optional()
});

const validateUpdateProfile = (req, res, next) => {
    const { error } = updateProfileSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

module.exports = validateUpdateProfile;