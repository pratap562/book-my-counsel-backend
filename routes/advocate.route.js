const express = require('express');
const advrouter = express.Router();
const AdvocateModel = require('../Models/Advocate.Model');
const authenticate = require('../middleware/Authentication/auth')
const UserModel = require('../Models/User.Model')

// CREATE

// fluent_language: { type: Array, required: true },
// conversational_language: { type: Array, required: true },
// skills: { type: Array, required: true },

advrouter.post('/post', authenticate, (req, res) => {
  let data = req.body
  let body = { ...data, stage: 2, fluent_language: data.fluent_language.split(' '), conversational_language: data.conversational_language.split(' '), skills: data.skills.split(" ") }
  const token = req.cookies?.token
  console.log(body)
  const advocate = new AdvocateModel(body);
  advocate.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).status(500).send({ err: 'Error saving advocate' });
    } else {
      res.status(201).send({ "msg": "sucessfull saved your detail" });

      async function updateDocument() {
        try {
          const result = await UserModel.updateOne({ _id: body.user_id }, { stage: 2 });
          console.log(`Updated ${result.nModified} document(s)`);
        } catch (error) {
          console.error(error);
        }
      }
      updateDocument();
    }
  });
});

// READ (ALL)
// advrouter.get('/', (req, res) => {
//   AdvocateModel.find({}, (err, docs) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving advocates');
//     } else {
//       res.json(docs);
//     }
//   });
// });
advrouter.get('/', (req, res) => {
  const { job_title, location, sort } = req.query;
  let sortObj = {};

  if (sort === 'asc') {
    sortObj = { price: 1 };
  } else if (sort === 'desc') {
    sortObj = { price: -1 };
  }

  let filterObj = {};

  if (role_title) {
    filterObj.role_title = role_title;
  }

  if (location) {
    filterObj.location = location;
  }

  AdvocateModel.find(filterObj)
    .sort(sortObj)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving advocates');
    });
});
//  /lawyer?sort=asc
//  /lawyer?sort=desc
//  /lawyer?job_title=<job_title>
//  /lawyer?location=<location>



// READ (ONE)
advrouter.get('/:id', (req, res) => {
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
advrouter.put('/:id', (req, res) => {
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
advrouter.delete('/:id', (req, res) => {
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

module.exports = advrouter;