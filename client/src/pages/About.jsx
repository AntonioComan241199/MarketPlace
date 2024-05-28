/* eslint-disable no-unused-vars */
import React from 'react';

export default function About() {
  return (
    <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
      <h1 className="text-slate-900 font-bold text-3xl lg:text-6xl">
        About <span className='text-slate-500'>Auto</span><span className='text-slate-700'>Connect</span>
      </h1>
      <div className="text-gray-400 text-xs sm:text-sm">
        AutoConnect is your premier destination for buying and selling cars. With a wide range of vehicles and a dedicated team, we strive to connect you with the perfect car that meets your needs and budget.
      </div>
      <div className="text-gray-400 text-xs sm:text-sm">
        Our mission is to make car buying and selling a seamless and enjoyable experience. Whether you&apos;re looking for a new ride or trying to find a new owner for your current car, AutoConnect offers a user-friendly platform with all the tools you need.
      </div>
      <div className="text-gray-400 text-xs sm:text-sm">
        We pride ourselves on our extensive network of trusted dealers and private sellers. Our comprehensive search and filter options allow you to easily find the exact car you&apos;re looking for, while our secure platform ensures a safe transaction process.
      </div>
      <div className="text-gray-400 text-xs sm:text-sm">
        At AutoConnect, we&apos;re more than just a marketplace – we&apos;re a community of car enthusiasts dedicated to helping you make informed decisions. Thank you for choosing AutoConnect for all your car buying and selling needs.
      </div>
      <div className="text-gray-400 text-xs sm:text-sm">
        If you have any questions or need assistance, please don&apos;t hesitate to <a href="/contact" className="text-blue-800 hover:underline">contact us</a>. Our team is always here to help!
      </div>
    </div>
  );
}
