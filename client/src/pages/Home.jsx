/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem'; // Adjust the import path as necessary

SwiperCore.use([Navigation]);

export default function Home() {
  const [listings, setListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [popularListings, setPopularListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/getListing?limit=4&sort=createdAt&order=desc');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRecentListings = async () => {
      try {
        const res = await fetch('/api/listing/getListing?limit=4&sort=createdAt&order=desc');
        const data = await res.json();
        setRecentListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPopularListings = async () => {
      try {
        const res = await fetch('/api/listing/getListing?limit=4&sort=views&order=desc');
        const data = await res.json();
        setPopularListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
    fetchRecentListings();
    fetchPopularListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find the best <br />
          <span className='text-slate-500'>deals</span> for you
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          AutoConnect is the best place to find the best deals for you. <br />
          We have a wide range of offers for you to choose from.
        </div>
        <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to="/search">
          Let&apos;s get started
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {listings && listings.length > 0 && listings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <Link to={`/listing/${listing._id}`}>
              <div className="relative h-96">
                <img className="object-cover w-full h-full" src={listing.imageUrls[0]} alt={listing.title} />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
                  <h1 className="text-lg font-bold">{listing.title}</h1>
                  <div className="text-sm">{listing.price} EURO</div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* listing results for recent and popular */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {recentListings && recentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Listings</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?sort=createdAt&order=desc'}>Show more recent listings</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {recentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {popularListings && popularListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Popular Listings</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?sort=views&order=desc'}>Show more popular listings</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {popularListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
