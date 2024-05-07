import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        price:{
            type: Number,
            required: true
        },
        mark:{
            type: String,
            required: true,
            trim: true
        },
        model:{
            type: String,
            required: true,
            trim: true
        },
        year:{
            type: Number,
            required: true
        },
        fuelType:{
            type: String,
            required: true,
            trim: true
        },
        engineVolume:{
            type: Number,
            required: true
        },
        km:{
            type: Number,
            required: true
        },
        description:{
            type: String,
            required: true,
            trim: true
        },
        imageUrls:{
            type: Array,
            required: false
        },
        userRef:{
            type: String,
            required: true
        },
        location:{
            type: String,
            required: true,
            trim: true
        },
        status:{
            type: String,
            default: 'active'
        }
    }, {timestamps: true}

)

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;