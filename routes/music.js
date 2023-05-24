const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Song = require('../models/musicModel');

// Gets all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs); // sends the user all the songs
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get one song
router.get('/:id', getSong, (req, res) => {
  res.json(res.song);
});

// Adding a song
router.post('/', async (req, res) => {
  const song = new Song({
    isChecked: req.body.isChecked, // the body is whatever the user sends to us which will be json
    songTitle: req.body.songTitle,
    artist: req.body.artist,
    songLink: req.body.songLink,
    playlists: req.body.playlists
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// Editing a song
router.patch('/:id', getSong, async (req, res) => {
  if (req.body.isChecked !== null) {
    res.song.isChecked = req.body.isChecked;
  }

  if (req.body.songTitle !== null) {
    res.song.songTitle = req.body.songTitle;
  }

  if (req.body.artist !== null) {
    res.song.artist = req.body.artist;
  }

  if (req.body.songLink !== null) {
    res.song.songLink = req.body.songLink;
  }

  if (req.body.playlists !== null) {
    res.song.playlists = req.body.playlists;
  }

  try {
    const updatedSong = await res.song.save();
    res.json(updatedSong);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// Delete a song
router.delete('/:id', getSong, async (req, res) => {
  try {
    await res.song.deleteOne();
    res.json({message: 'Deleted song'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// A function that finds the song based on the id passed in by the user.
// then it puts the song in res.song (an object)
async function getSong (req, res, next) {
  let song;
  try {
    song = await Song.findById(req.params.id);
    if (song === null) {
      return res.status(404).json({message: 'Cannot find song'});
    }
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
  res.song = song;
  next();
}

module.exports = router;
