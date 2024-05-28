/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { carData } from '../../../shared/carData.js'; // Adjust the import path as necessary
import { fuelTypes } from '../../../shared/constants.js'; // Adjust the import path as necessary

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [selectedMark, setSelectedMark] = useState('');
  const [models, setModels] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState('createdAt');
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (selectedMark && carData[selectedMark]) {
      setAvailableModels(carData[selectedMark]);
    } else {
      setAvailableModels([]);
    }
  }, [selectedMark]);

  const handleModelChange = (event) => {
    const value = event.target.value;
    setModels((prevModels) =>
      prevModels.includes(value)
        ? prevModels.filter((model) => model !== value)
        : [...prevModels, value]
    );
  };

  const handleFuelTypeChange = (event) => {
    const value = event.target.value;
    setSelectedFuelTypes((prevFuelTypes) =>
      prevFuelTypes.includes(value)
        ? prevFuelTypes.filter((fuelType) => fuelType !== value)
        : [...prevFuelTypes, value]
    );
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams({
      searchTerm,
      yearStart,
      yearEnd,
      model: models.join(','),
      fuelType: selectedFuelTypes.join(','),
      sort: sortOrder,
    });

    const response = await fetch(`http://localhost:3000/api/listing/getListings?${queryParams.toString()}`);
    const data = await response.json();
    setListings(data);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8' onSubmit={handleSearch}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Cuvinte cheie:</label>
            <input
              type='text'
              id='searchTerm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>An de fabricație (de la):</label>
            <input
              type='number'
              id='yearStart'
              value={yearStart}
              onChange={(e) => setYearStart(e.target.value)}
              placeholder='Year Start'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>An de fabricație (până la):</label>
            <input
              type='number'
              id='yearEnd'
              value={yearEnd}
              onChange={(e) => setYearEnd(e.target.value)}
              placeholder='Year End'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Marcă:</label>
            <select
              id='mark'
              value={selectedMark}
              onChange={(e) => setSelectedMark(e.target.value)}
              className='border rounded-lg p-3 w-full'
            >
              <option value=''>Selectează o marcă</option>
              {Object.keys(carData).map((mark) => (
                <option key={mark} value={mark}>
                  {mark}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Model:</label>
            <select
              id='model'
              multiple
              value={models}
              onChange={handleModelChange}
              className='border rounded-lg p-3 w-full'
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Tip combustibil:</label>
            <div className='flex gap-2 flex-wrap'>
              {fuelTypes.map((fuelType) => (
                <div key={fuelType} className='flex gap-2'>
                  <input
                    type='checkbox'
                    value={fuelType}
                    onChange={handleFuelTypeChange}
                    className='w-5'
                  />
                  <span>{fuelType}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              id='sortOrder'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className='border rounded-lg p-3'
            >
              <option value='createdAt'>Latest</option>
              <option value='-createdAt'>Oldest</option>
              <option value='price'>Price low to high</option>
              <option value='-price'>Price high to low</option>
            </select>
          </div>
          <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='p-7'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div>
          {listings.map((listing) => (
            <div key={listing._id} className='p-3 border-b'>
              <h2 className='text-xl'>{listing.title}</h2>
              <p>{listing.description}</p>
              <p>{listing.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
