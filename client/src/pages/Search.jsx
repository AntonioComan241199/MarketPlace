/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carData } from '../../../shared/carData.js'; // Adjust the import path as necessary
import { fuelTypes } from '../../../shared/constants.js'; // Adjust the import path as necessary
import ListingItem from '../components/ListingItem.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    yearStart: '',
    yearEnd: '',
    selectedMark: '',
    models: [],
    selectedFuelTypes: [],
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const yearStartFromUrl = urlParams.get('yearStart');
    const yearEndFromUrl = urlParams.get('yearEnd');
    const selectedMarkFromUrl = urlParams.get('selectedMark');
    const modelsFromUrl = urlParams.get('models') ? urlParams.get('models').split(',') : [];
    const selectedFuelTypesFromUrl = urlParams.get('selectedFuelTypes') ? urlParams.get('selectedFuelTypes').split(',') : [];
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      yearStartFromUrl ||
      yearEndFromUrl ||
      selectedMarkFromUrl ||
      modelsFromUrl.length > 0 ||
      selectedFuelTypesFromUrl.length > 0 ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        yearStart: yearStartFromUrl || '',
        yearEnd: yearEndFromUrl || '',
        selectedMark: selectedMarkFromUrl || '',
        models: modelsFromUrl,
        selectedFuelTypes: selectedFuelTypesFromUrl,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/getListing?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }else{
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  useEffect(() => {
    if (sidebardata.selectedMark && carData[sidebardata.selectedMark]) {
      setAvailableModels(carData[sidebardata.selectedMark]);
    } else {
      setAvailableModels([]);
    }
  }, [sidebardata.selectedMark]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: value });
    }
    if (id === 'yearStart') {
      setSidebardata({ ...sidebardata, yearStart: value });
    }
    if (id === 'yearEnd') {
      setSidebardata({ ...sidebardata, yearEnd: value });
    }
    if (id === 'mark') {
      setSidebardata({ ...sidebardata, selectedMark: value });
    }
    if (id === 'models') {
      setSidebardata((prev) => ({
        ...prev,
        models: prev.models.includes(value)
          ? prev.models.filter((model) => model !== value)
          : [...prev.models, value],
      }));
    }
    if (fuelTypes.includes(id)) {
      setSidebardata((prev) => ({
        ...prev,
        selectedFuelTypes: prev.selectedFuelTypes.includes(id)
          ? prev.selectedFuelTypes.filter((fuelType) => fuelType !== id)
          : [...prev.selectedFuelTypes, id],
      }));
    }
    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('yearStart', sidebardata.yearStart);
    urlParams.set('yearEnd', sidebardata.yearEnd);
    urlParams.set('selectedMark', sidebardata.selectedMark);
    urlParams.set('models', sidebardata.models.join(','));
    urlParams.set('selectedFuelTypes', sidebardata.selectedFuelTypes.join(','));
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMore = async () => {
    const numberOfListings = listings.length;
    const startIdx = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('start', startIdx);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getListing?${searchQuery}`);
    const date = await res.json();
    if (date.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...date]);

  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Cuvinte cheie:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>An de fabricație (de la):</label>
            <input
              type='number'
              id='yearStart'
              placeholder='Year Start'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.yearStart}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>An de fabricație (până la):</label>
            <input
              type='number'
              id='yearEnd'
              placeholder='Year End'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.yearEnd}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Marcă:</label>
            <select
              id='mark'
              value={sidebardata.selectedMark}
              onChange={handleChange}
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
              id='models'
              multiple
              value={sidebardata.models}
              onChange={handleChange}
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
                    id={fuelType}
                    checked={sidebardata.selectedFuelTypes.includes(fuelType)}
                    onChange={handleChange}
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
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='price_desc'>Price high to low</option>
              <option value='price_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && <p className='text-xl text-slate-700'>No listings found</p>}
          {loading && <p className='text-xl text-slate-700 text-center'>Loading...</p>}

          {
            !loading && listings && listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))
          }

          {showMore && (
          <button className='text-green-700 hover:underline p-7 text-center w-full' onClick={onShowMore()}>
            Show More
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
