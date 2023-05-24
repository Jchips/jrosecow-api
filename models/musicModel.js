const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  isChecked: {
    type: Boolean,
  },
  songTitle: {
    type: String,
    required: true
  },
  artist: {
    type: String
  },
  songLink: {
    type: String
  },
  playlists: {
    type: String
  },
  addedDate: {
    type: Date,
    // required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Song', subscriberSchema);
