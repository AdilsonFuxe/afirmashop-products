import mongoose, {Types} from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Products', productSchema);
