import React, { useState } from 'react';

const carData = {
  BMW: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'M2', 'M3', 'M4', 'M5', 'M8', 'i3', 'i8', 'Other' ],
  Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'S3', 'S4', 'S5', 'S6', 'S7'],
  Mercedes: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'AMG GT', 'SLC', 'SL', 'SLS', 'V-Class', 'X-Class'],
  Volkswagen: ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'T-Cross', 'Arteon', 'Touran', 'Sharan', 'Caddy', 'Transporter', 'Caravelle', 'California', 'Amarok', 'ID.3', 'ID.4'],
  Skoda: ['Citigo', 'Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq', 'Other'],
  Toyota: ['Aygo', 'Yaris', 'Corolla', 'Camry', 'Prius', 'RAV4', 'C-HR', 'Highlander', 'Land Cruiser', 'Supra', 'GT86', 'Mirai', 'Other'],
  Honda: ['Jazz', 'Civic', 'HR-V', 'CR-V', 'e', 'NSX', 'Other'],
  Nissan: ['Micra', 'Leaf', 'Qashqai', 'X-Trail', 'Juke', 'GT-R', 'Other'],
  Ford: ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Kuga', 'Puma', 'Edge', 'Ranger', 'Transit', 'Tourneo', 'Other'],
  Fiat: ['500', '500X', '500L', 'Panda', 'Tipo', 'Punto', 'Doblo', 'Qubo', '500e', 'Other'],
  Renault: ['Clio', 'Captur', 'Megane', 'Scenic', 'Kadjar', 'Talisman', 'Koleos', 'Zoe', 'Twizy', 'Other'],
  Peugeot: ['108', '208', '308', '508', '2008', '3008', '5008', 'Rifter', 'Traveller', 'iOn', 'Other'],
  Citroen: ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C4 Cactus', 'Berlingo', 'SpaceTourer', 'e-Mehari', 'Other'],
  Opel: ['Adam', 'Corsa', 'Astra', 'Insignia', 'Crossland X', 'Grandland X', 'Mokka', 'Zafira', 'Combo', 'Vivaro', 'Movano', 'Other'],
  Hyundai: ['i10', 'i20', 'i30', 'i40', 'Ioniq', 'Kona', 'Tucson', 'Santa Fe', 'Nexo', 'Other'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'Soul', 'Optima', 'Stinger', 'EV6', 'Other'],
  Volvo: ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40', 'C70', 'Polestar', 'Other'],
  Mazda: ['2', '3', '6', 'CX-3', 'CX-30', 'CX-5', 'MX-5', 'MX-30', 'Other'],
  Mitsubishi: ['Space Star', 'ASX', 'Eclipse Cross', 'Outlander', 'L200', 'Other'],
  Suzuki: ['Swift', 'Ignis', 'Vitara', 'S-Cross', 'Jimny', 'Other'],
  Subaru: ['Impreza', 'Legacy', 'Outback', 'XV', 'BRZ', 'Forester', 'Levorg', 'Other'],
  Lexus: ['CT', 'IS', 'ES', 'LS', 'NX', 'RX', 'UX', 'LC', 'RC', 'Other'],
  AlfaRomeo: ['Giulietta', 'Giulia', 'Stelvio', '4C', 'Other'],
  Jaguar: ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace', 'Other'],
  LandRover: ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Other'],
  Porsche: ['911', '718', 'Panamera', 'Macan', 'Cayenne', 'Taycan', 'Cayman', 'Boxster', 'Other'],
  Mini: ['Hatch', 'Convertible', 'Countryman', 'Clubman', 'Electric', 'Other'],
  Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster', 'Other'],
  Dacia: ['Sandero', 'Logan', 'Duster', 'Dokker', 'Lodgy', 'Spring', 'Other'],
  Seat: ['Mii', 'Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Cupra', 'Other'],
  Other: ['Other']
};

const sortedCarData = Object.keys(carData).sort().reduce((obj, key) => {
  obj[key] = carData[key].sort();
  return obj;
}, {});

const fuelTypes = ['Benzina', 'Diesel', 'Hybrid', 'Electric'];

const currentYear = new Date().getFullYear();
const years = Array.from({length: 30}, (_, i) => currentYear - i);

function CreateListing() {
  const [selectedMark, setSelectedMark] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [engineVolume, setEngineVolume] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [mileage, setMileage] = useState('');
  const [address, setAddress] = useState('');

  const handleMarkChange = (e) => {
    setSelectedMark(e.target.value);
    setSelectedModel('');
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const models = selectedMark ? sortedCarData[selectedMark] : [];

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className="flex flex-col flex-1 gap-4">
          
          <input className='border p-3 rounded-lg' type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="flex gap-4">

            <select name='mark' id='mark' value={selectedMark} onChange={handleMarkChange} className='p-3 border border-gray-300 rounded-lg w-1/2'>
              <option value=''>Select a Mark</option>
              {Object.keys(sortedCarData).map((mark) => (
                <option key={mark} value={mark}>
                  {mark}
                </option>
              ))}
            </select>

            <select name='model' id='model' value={selectedModel} onChange={handleModelChange} className='p-3 border border-gray-300 rounded-lg w-1/2'>
              <option value=''>Select a Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            </div>
          <textarea className='border p-3 rounded-lg' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className='border p-3 rounded-lg mb-4' type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <select className='border p-3 rounded-lg' value={year} onChange={(e) => setYear(e.target.value)}>
            <option value=''>Select a Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input className='border p-3 rounded-lg' type="number" placeholder="Engine Volume" value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} />
          <select className='border p-3 rounded-lg' value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
            <option value=''>Select a Fuel Type</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input className='border p-3 rounded-lg' type="number" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} />
          <input className='border p-3 rounded-lg' type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
          </div>
        <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;