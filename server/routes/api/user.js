const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { auth } = require("../../middleware/auth");

//endpoint to create user account
router.post("/add_user", async (req, res) => {
  const { firstname, lastname, email, password, type } = req.body;
  //Simple Validation
  if (!firstname || !lastname || !email || !password || !type) {
    return res
      .status(400)
      .send({ msg: "Please enter all fields", status: false });
  }
  try {
    //checking if a user with email already exist
    let found = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (found) {
      return res
        .status(400)
        .send({ msg: "User with email already exist", status: false });
    }

    //Create salt and hash
    const salt = await bcrypt.genSalt(10);

    let pass = await bcrypt.hash(password, salt);

    //creating a new user
    const user = await prisma.user.create({
      data: { firstname, lastname, email, password: pass, type },
    });

    return res.status(200).send({ status: true, data: user });
  } catch (err) {
    console.log(err);
  }
});

router.patch("/update_user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, password, type } = req.body;

    // find the user by ID
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ msg: "User with the specified ID does not exist" });
    }

    // if the user is changing their password, hash the new password
    let pass = password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      pass = await bcrypt.hash(password, salt);
    }

    // update the user's information
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: { firstname, lastname, email, password: pass, type },
    });

    res.status(200).send({ status: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, msg: "Server error" });
  }
});

//endpoint for login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .send({ msg: "User does not exist. Create an Account", status: false });
    }
    console.log(user);

    if (!user.status === "active") {
      return res
        .status(400)
        .send({ msg: "User account not active", status: false });
    }

    //check if password is correct
    //Validating Password
    await bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res
          .status(401)
          .send({ msg: "Invalid Credentails", auth: false, status: false });
      }
      //isMatch is true
      jwt.sign(
        { id: user.id, type: user.type },
        process.env.jwtSecret,
        { expiresIn: 86400 },
        (err, token) => {
          if (err) throw err;
          res.status(200).send({ auth: true, status: true, token });
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//@routes GET api/user/loggedIn
//@desc Check if a user is loggedIn
router.get("/loggedIn", async (req, res) => {
  try {
    const token = req.headers.authorization;
    //check for token
    if (!token) {
      res.status(200).send(false);
    } else {
      jwt.verify(token, process.env.jwtSecret, function (err) {
        if (err) {
          res.status(200).send({ status: false });
        } else {
          res.status(200).send(true);
        }
      });
    }
    //verify token
  } catch (e) {
    res.status(501).send(e);
  }
});

router.get("/user", auth, async (req, res) => {
  let user = await prisma.user.findFirst({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      type: true,
      ministryId: true,
      Ministry: true,
    },
  });
  res.json(user);
});

module.exports = router;
