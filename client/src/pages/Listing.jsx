import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaShare,
  FaGasPump 
} from 'react-icons/fa';
import { TbEngine } from "react-icons/tb";
import { MdOutlinePriceChange } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(loading);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Ceva nu a mers bine!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'contain',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4 border-double border-4 rounded-lg'>
            <p className='text-2xl font-semibold'>
              {listing.title} - {' '} {Number(listing.price).toLocaleString('RO')}{" EUR"}
            </p>
            <ul>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaLocationDot className='text-lg' />
                {listing.location}
              </li>
            </ul>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[350px] text-white text-center p-1 rounded-md'>
                {'Marca: '}{listing.mark}
              </p>
              <p className='bg-red-900 w-full max-w-[350px] text-white text-center p-1 rounded-md'>
                {'Model: '}{listing.model}
              </p>
              <p className='bg-red-900 w-full max-w-[350px] text-white text-center p-1 rounded-md'>
                {'Anul fabricatiei: '}{listing.year}
              </p>
            </div>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaGasPump className='text-lg' />
                {listing.fuelType}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <TbEngine className='text-lg' />
                {listing.engineVolume} {'cm3'}
              </li>
              
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <AiFillDashboard className='text-lg' />
                {Number(listing.km).toLocaleString('RO')}{ ' KM'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <MdOutlinePriceChange  className='text-lg' />
                {Number(listing.price).toLocaleString('RO')}{" EUR"}
              </li>
              
            </ul>
            <p className='text-slate-800'>
                <span className='font-semibold text-black'>Description: <hr /> </span>
                {listing.description.split('\n').map((line, index) =>  (
                    <React.Fragment key={index} >
                    {line}
                    <br />
                    </React.Fragment>
                ))}
            </p>
            
          </div>
        </div>
      )}
    </main>
  );
}