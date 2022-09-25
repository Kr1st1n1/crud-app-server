const { Schema, Types, model } = require('mongoose');
const yup = require('yup');

const productShema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

const productValidationSchema = yup.object().shape({
  title: yup
    .string().typeError('Product.title must be a string')
    .required('Product.title is required'),
  description: yup
    .string().typeError('Product.description must be a string')
    .required('Product.description is required'),
  categoryId: yup
  .string().typeError('Product.categoryId must be a string')
  .test(
    'is-mongo-object-id',
    'Product.categoryId must be valid MongoDB object Id',
    Types.ObjectId.isValid
  )
  .required('Product.categoryId is required'),
  img: yup
    .string().typeError('Product.img must be a string')
    .required('Product.img is required'),
  price: yup
    .number().typeError('Product.price must be a number')
    .required('Product.price is required')
    .positive('Product.price must be positive')
});

const productUpdateValidationSchema = yup.object().shape({
  title: yup.string().typeError('Product.title must be a string'),
  description: yup.string().typeError('Product.description must be a string'),
  categoryId: yup.string().typeError('Product.categoryId must be a string'),
  img: yup.string().typeError('Product.img must be a string'),
  price: yup.number()
    .typeError('Product.price must be a number')
    .positive('Product.price must be positive'),
});

productShema.statics.validateData = (productData) => productValidationSchema.validate(productData)
productShema.statics.validateUpdateData = (productData) => productUpdateValidationSchema.validate(productData)

const ProductModel = model('Product', productShema);

module.exports = ProductModel;
