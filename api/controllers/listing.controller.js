import e from "express";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import {carData} from '../../shared/carData.js';
import { years, fuelTypes } from '../../shared/constants.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let mark = req.query.mark;
    if (!mark || mark === 'undefined' || mark === 'null') {
      mark = { $in: Object.keys(carData) };
    } else {
      mark = { $in: mark.split(',') };
    }

    let model = req.query.model;
    if (!model || model === 'undefined' || model === 'null') {
      model = { $in: [].concat(...Object.values(carData)) };
    } else {
      model = { $in: model.split(',') };
    }

    let yearStart = parseInt(req.query.yearStart) || years[years.length - 1];
    let yearEnd = parseInt(req.query.yearEnd) || years[0];
    
    let year = {
      $gte: yearStart,
      $lte: yearEnd
    };

    let fuelType = req.query.fuelType;
    if (!fuelType || fuelType === 'undefined' || fuelType === 'null') {
      fuelType = { $in: fuelTypes };
    } else {
      fuelType = { $in: fuelType.split(',') };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    // Construirea obiectului de filtrare pentru interogarea bazei de date
    const filter = {
      mark,
      model,
      year,
      fuelType,
    };

    // Executarea interogării cu filtrele specificate, limitare și paginare
    const listings = await Listing.find({
      title: { $regex: searchTerm, $options: 'i' },
      ...filter
    }).sort({ [sort]: order }).limit(limit).skip(startIndex);

    // Trimiterea răspunsului cu listările obținute
    res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
}