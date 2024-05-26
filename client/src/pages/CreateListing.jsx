/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useSelector } from 'react-redux';
import { app } from '../firebase';
import {carData} from '../../../shared/carData.js';
import { fuelTypes, years } from '../../../shared/constants.js';
import { useNavigate } from 'react-router-dom';

const sortedCarData = Object.keys(carData)
  .sort()
  .reduce((obj, key) => {
    obj[key] = carData[key].sort();
    return obj;
  }, {});

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: '',
    description: '',
    location: '',
    price: '',
    mark: '',
    model: '',
    year: '',
    engineVolume: '',
    fuelType: '',
    km: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed. (2mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload up to 6 images');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');

      setLoading(true);
      setError(false);

      const token = localStorage.getItem('authToken');

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      console.log('Server response:', data); // Adăugat pentru debugging
      if (!data || data.success === false) {
        setError(data?.message || 'Something went wrong');
        console.log(data?.message || 'Something went wrong');
      } else {
        console.log('Listing created:', data);
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Creaza un anunt nou
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Titlul anuntului'
            className='border p-3 rounded-lg'
            id='title'
            required
            onChange={handleChange}
            value={formData.title}
          />
          <div className="flex gap-4">
            <select
              className='border p-3 rounded-lg w-1/2'
              id='mark'
              required
              onChange={handleChange}
              value={formData.mark}
            >
              <option value=''>Selecteaza marca</option>
              {Object.keys(sortedCarData).map((mark) => (
                <option key={mark} value={mark}>
                  {mark}
                </option>
              ))}
            </select>
            <select
              className='border p-3 rounded-lg w-1/2'
              id='model'
              required
              onChange={handleChange}
              value={formData.model}
            >
              <option value=''>Selecteaza modelul</option>
              {formData.mark &&
                sortedCarData[formData.mark].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            type='text'
            placeholder='Descriere'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='number'
            placeholder='Pret'
            className='border p-3 rounded-lg'
            id='price'
            required
            onChange={handleChange}
            value={formData.price}
          />
          <select
            className='border p-3 rounded-lg'
            id='year'
            required
            onChange={handleChange}
            value={formData.year}
          >
            <option value=''>Anul fabricatiei</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input
            type='number'
            placeholder='Volum motor'
            className='border p-3 rounded-lg'
            id='engineVolume'
            required
            onChange={handleChange}
            value={formData.engineVolume}
          />
          <select
            className='border p-3 rounded-lg'
            id='fuelType'
            required
            onChange={handleChange}
            value={formData.fuelType}
          >
            <option value=''>Selecteaza tipul combustibilului</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type='number'
            placeholder='Kilometraj'
            className='border p-3 rounded-lg'
            id='km'
            required
            onChange={handleChange}
            value={formData.km}
          />
          <input
            type='text'
            placeholder='Locație'
            className='border p-3 rounded-lg'
            id='location'
            required
            onChange={handleChange}
            value={formData.location}
          />
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              Prima imagine va fi imaginea principala a anuntului tau (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='car'
                  className='w-40 h-40 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Se creeaza' : 'Creaza un anunt nou!'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
