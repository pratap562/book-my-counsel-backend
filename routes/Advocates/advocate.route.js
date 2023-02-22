const express = require('express');
const router = express.Router();
const AdvocateModel = require('../models/advocate');

// CREATE
router.post('/', (req, res) => {
  const advocate = new AdvocateModel(req.body);
  advocate.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving advocate');
    } else {
      res.status(201).json(doc);
    }
  });
});

// READ (ALL)
router.get('/', (req, res) => {
  AdvocateModel.find({}, (err, docs) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving advocates');
    } else {
      res.json(docs);
    }
  });
});

// READ (ONE)
router.get('/:id', (req, res) => {
  AdvocateModel.findById(req.params.id, (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving advocate');
    } else if (!doc) {
      res.status(404).send('Advocate not found');
    } else {
      res.json(doc);
    }
  });
});

// UPDATE
router.put('/:id', (req, res) => {
  AdvocateModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating advocate');
    } else if (!doc) {
      res.status(404).send('Advocate not found');
    } else {
      res.json(doc);
    }
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  AdvocateModel.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting advocate');
    } else if (!doc) {
      res.status(404).send('Advocate not found');
    } else {
      res.json(doc);
    }
  });
});

module.exports = router;
