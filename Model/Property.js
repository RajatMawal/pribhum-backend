import mongoose, { Model } from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    pgId: {
      type: String,
      unique: true,
      required: true,
    },
    createdBy:{
        type:String
    },
    Title: {
      type: String,
      required: true,
    },
    Locality: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      enum: ["Boys", "Girls", "Co-Living"],
      required: true,
    },
    LockInPeriod: {
      type: String,
      required: true,
    },
    Images: {
      type: [String],
      required: true,
    },
    Sharing: {
      Single: {
        type: String,
      },
      Double: {
        type: String,
      },
      Triple: {
        type: String,
      },
    },
    CommonFacilities: {
      type: Map,
      of: Boolean,
      default: {},
    },
    Safety: {
      type: Map,
      of: Boolean,
      default: {},
    },
    BillsIncluded: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
