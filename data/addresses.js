const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Add a 2dsphere index for the location field
addressSchema.index({ location: '2dsphere' });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
