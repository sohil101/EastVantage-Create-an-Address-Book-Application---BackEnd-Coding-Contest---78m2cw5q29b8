const Address = require('../models/Address.js');

// Create a new address
const createAddress = async (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'Please provide all required information' });
  }

  const newAddress = new Address({
    name,
    address,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  });

  try {
    const savedAddress = await newAddress.save();
    res.status(201).json({ message: 'Address created successfully', address: savedAddress });
  } catch (error) {
    next(error);
  }
};

// Update an existing address
const updateAddress = async (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;
  const { id } = req.params;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'Please provide all required information' });
  }

  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        name,
        address,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    next(error);
  }
};

// Delete an existing address
const deleteAddress = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get addresses within a given distance and location
const getAddressesWithinDistance = async (req, res, next) => {
  const { latitude, longitude, distance } = req.query;

  if (!latitude || !longitude || !distance) {
    return res.status(400).json({ message: 'Please provide all required information' });
  }

  try {
    const addresses = await Address.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(distance),
        },
      },
    });

    res.status(200).json({ addresses });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAddress, updateAddress, deleteAddress, getAddressesWithinDistance };
