const { Schema, model } = require("mongoose");

const activitySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    description: String,
    location: String,
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true
    }
  },
  {
    timestamps: true,
  });

const Activity = model("Activity", activitySchema);

module.exports = Activity;