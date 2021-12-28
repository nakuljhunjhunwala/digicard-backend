const db = require("../models");
const User = db.users;

exports.create = async (req, res) => {
  let errors = [];
  let detail = {
    name: req.body.name,
    profession: req.body.profession,
  };
  const linksField = [
    {
      name: "Profile Photo",
      field: "profilePhoto",
    },
    {
      name: "Share Link",
      field: "shareableLink",
    },
    {
      name: "Address",
      field: "address",
    },
    {
      name: "Website",
      field: "website",
    },
  ];

  let additonalFields = [
    "skypeId",
    "messengerId",
    "facebookId",
    "twitterId",
    "instagramId",
    "quoraId",
    "githubId",
  ];

  if (!req.body.username) {
    errors.push({ message: "Username is required" });
    res.status(400).send({ message: "Username can not be empty!" });
    return;
  }

  // Validate Username
  try {
    let user = await User.find({ username: req.body.username });
    if (user.length > 0) {
      errors.push({ message: "Username already exists" });

      res.status(400).send({ message: "Username already taken" });
      return;
    } else {
      detail.username = req.body.username;
    }
  } catch (error) {
    console.log(error);
    errors.push({ message: "Username already exists" });

    res
      .status(500)
      .send({ message: "Error retrieving User with id=" + req.body.username });
    return;
  }

  // Validate links
  linksField.forEach((field) => {
    if (req.body[field.field]) {
      //validate url with regex
      if (
        !req.body[field.field].match(
          /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        )
      ) {
        errors.push({ message: "Invalid " + field.name });
        res
          .status(400)
          .send({ message: "Invalid website url for " + field.name });
        return;
      }

      detail[field.field] = req.body[field.field];
    }
  });

  // Validate mobile number
  if (req.body.phoneNumber) {
    // remove special characters
    req.body.phoneNumber = req.body.phoneNumber.replace(/[^0-9]/g, "");
    if (!req.body.phoneNumber.match(/^[0-9]{10}$/)) {
      errors.push({ message: "Invalid phone number" });
      res
        .status(400)
        .send({
          message:
            "Invalid mobile number if country code is added please remove",
        });
      return;
    }
    detail.phoneNumber = req.body.phoneNumber;
  }

  // Validate email
  if (req.body.email) {
    if (
      !req.body.email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.push({ message: "Invalid email" });
      res.status(400).send({ message: "Invalid email" });
      return;
    }
    detail.email = req.body.email;
  }

  // Validate whatsapp number
  if (req.body.whatsappNumber) {
    // remove special characters
    req.body.whatsappNumber = req.body.whatsappNumber.replace(/[^0-9]/g, "");
    if (!req.body.whatsappNumber.match(/^[0-9]{10}$/)) {
      errors.push({ message: "Invalid whatsapp number" });
      res
        .status(400)
        .send({
          message:
            "Invalid mobile number if country code is added please remove",
        });
      return;
    }
    detail.whatsappNumber = req.body.whatsappNumber;
  }

  additonalFields.forEach((field) => {
    if (req.body[field]) {
      detail[field] = req.body[field];
    }
  });


  if (errors.length === 0) {
    const user = new User(detail);
    try {
      await user.save();
      console.log("User Saved with username= " + detail.username);
      res.send(true);
      return;
    } catch (error) {
      res.status(500).send({
        message:
          error.message || "Some error occurred while creating the User.",
      });
      return;
    }
  }
};

exports.findOne = (req, res) => {
  const username = req.params.id;
  User.find({ username: username })
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send({ message: "Not found User with id " + username });
      } else res.send(data[0]);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + username });
    });
};
