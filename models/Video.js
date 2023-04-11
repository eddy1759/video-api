const mongoose = require('mongoose');
const { Schema } = mongoose;


const VideoSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    tags: { 
        type: [String], 
        default: [] 
    },
    cloudinaryUrl: { 
        type: String, 
        required: true 
    },
    cloudinaryPublicId: { 
        type: String, 
        required: true 
    },
    views: { 
        type: Number,
        min: 0,
        default: 0
    },
    likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    formats: [
        {
            resolution: { 
                type: String, 
                required: true 
            },
            bitrate: { 
                type: String, 
                required: true },
            cloudinaryUrl: { 
                type: String, 
                required: true 
            }, // CDN URL for the transcoded video on Cloudinary
        },
    ],
    defaultFormat: { // default format for the video
        resolution: { 
            type: String, 
            required: true 
        },
        bitrate: { 
            type: String, 
            required: true 
        },
        cloudinaryUrl: { 
            type: String, 
            required: true 
        }, // CDN URL for the default format transcoded video on Cloudinary
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Add validation to the formats array
VideoSchema.path('formats').validate(function (formats) {
    // Create an array of unique format combinations (resolution + bitrate)
    const uniqueFormats = [...new Set(formats.map((format) => format.resolution + format.bitrate))];
    // Check that the number of unique formats is the same as the length of the original array
    return uniqueFormats.length === formats.length;
}, 'Duplicate format combinations are not allowed');
  
// Add validation for the default format
VideoSchema.path('defaultFormat').validate(function (defaultFormat) {
    // Check that the default format matches one of the formats in the formats array
    return this.formats.some((format) => format.resolution === defaultFormat.resolution && format.bitrate === defaultFormat.bitrate);
    }, 'The default format must match one of the formats in the formats array'
);

module.exports = mongoose.model('Video', VideoSchema);
