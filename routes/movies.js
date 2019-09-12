const express = require("express");

const { Movie, validate } = require("../models/movie");
const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
  const customers = await Movie.find();
  res.send(customers);
});

// Get single movie
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("Movie with a given ID was not found");

  res.send(movie);
});

// Create new movie
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, numberInStock, dailyRentalRate, genre } = req.body;
  let movie = new Movie({ title, numberInStock, dailyRentalRate, genre });
  movie = await movie.save();
  res.send(movie);
});

// Update existing movie
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, numberInStock, dailyRentalRate, genre } = req.body;
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { title, numberInStock, dailyRentalRate, genre },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("Movie with a given ID was not found");

  res.send(movie);
});

// Delete existing movie
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("Movie with a given ID was not found");

  res.send(movie);
});

module.exports = router;
