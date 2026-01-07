const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const ObjectId = require('mongodb').ObjectId;

router.get('/', async (_, res) => {
  const exercises = await Exercise.find();
  res.json(exercises);
});

router.post('/', async (req, res) => {
  const exercise = new Exercise(req.body);
  await exercise.save();
  res.json(exercise);
});

router.put('/:id', async (req, res) => {
  const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(exercise);
});

router.delete('/:id', async (req, res) => {
  await Exercise.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ejercicio eliminado' });
});

module.exports = router;
