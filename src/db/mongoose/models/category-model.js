import mongoose, {Types} from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Categories', categorySchema);
