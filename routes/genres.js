const Joi = require("@hapi/joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  })
);

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50)
  };

  return Joi.validate(genre, schema);
}

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("Genre with a given ID was not found");
    res.send(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

// Create new genre

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });

  try {
    genre = await genre.save();
    res.send(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
    return res.status(500).send("Server encountered an error.");
  }
});

// Update existing genre

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("Genre with a given ID was not found");

  res.send(genre);
});

// Delete existing genre

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("Genre with a given ID was not found");

  res.send(genre);
});

module.exports = router;
