const express = require("express");
const router = express.Router();
const AdvocateModel = require("../../Models/Advocate.Model");
const authenticate = require("../../middleware/Authentication/auth")
const UserModel = require('../../Models/User.Model')
// const UserModel = require("../../models/User.Model")

router.post('/post', authenticate, (req, res) => {
  let data = req.body
  console.log(data, 'dataaaaa')
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
      console.log(doc, 'doc')

      async function updateDocument() {
        console.log('ys')
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

// CREATE
router.post("/", (req, res) => {
  const advocate = new AdvocateModel(req.body);
  advocate.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving advocate");
    } else {
      res.status(201).json(doc);
    }
  });
});

// READ (ALL)
// router.get('/', (req, res) => {
//   AdvocateModel.find({}, (err, docs) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving advocates');
//     } else {
//       res.json(docs);
//     }
//   });
// });
router.get("/", (req, res) => {
  const { role_title, location, sort } = req.query;
  let sortObj = {};

  if (sort === "asc") {
    sortObj = { pricing: 1 };
  } else if (sort === "desc") {
    sortObj = { pricing: -1 };
  }

  let filterObj = { stage: 3 };

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
      res.status(500).send("Error retrieving advocates");
    });
});
// READ (ONE)
router.get("/:id", (req, res) => {
  AdvocateModel.findById(req.params.id, (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving advocate");
    } else if (!doc) {
      res.status(404).send("Advocate not found");
    } else {
      res.json(doc);
    }
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  AdvocateModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, doc) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating advocate");
      } else if (!doc) {
        res.status(404).send("Advocate not found");
      } else {
        res.json(doc);
      }
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  AdvocateModel.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting advocate");
    } else if (!doc) {
      res.status(404).send("Advocate not found");
    } else {
      res.json(doc);
    }
  });
});

module.exports = router;
