import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  propertyName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
