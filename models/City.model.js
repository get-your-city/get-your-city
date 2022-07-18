const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const citySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    description: String,
    imageUrl: {
      type: String,
      required: true
    },
  },
  {timestamps: true,
});

const City = model("City", citySchema);

module.exports = City;