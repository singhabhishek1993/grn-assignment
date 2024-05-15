const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Joi schema for form data validation
const formDataSchema = Joi.object({
  company: Joi.string().required(),
  date: Joi.date().iso().required(),
  store: Joi.string().required(),
  remarks: Joi.string(),
  inventories: Joi.array().items(Joi.object({
    itemCategory: Joi.string().required(),
    item: Joi.string().required(),
    strain: Joi.string().required(),
    quantity: Joi.string().pattern(/^\d+$/).required(),
    uom: Joi.string().required(),
    totalCost: Joi.number().required(),
    costPerUnit: Joi.number(),
    supplier: Joi.string().required()
  })).required()
});

// Route for submitting form data
app.post('/submit-form', (req, res) => {
  // Validate request data
  const { error } = formDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // If validation passes, continue processing
  const formData = req.body;
  console.log(formData);
  res.status(200).json({ message: 'Form submitted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
