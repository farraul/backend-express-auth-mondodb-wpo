import { mongoose, model } from 'mongoose';

const userSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const Seo = mongoose.model('urlSeo', userSchema);

export default Seo;
