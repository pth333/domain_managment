const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
require("dotenv").config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password are required!",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid password!",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    const { password: userPassword, ...userInfo } = user.toJSON();

    res.status(200).send({
      message: "Login successful!",
      user: userInfo,
      token,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error occurred during login",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const userInfo = await User.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, password, role, name, phone_number } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { name: name },
          { phone_number: phone_number },
        ],
      },
    });

    let errors = [];

    if (existingUser) {
      if (existingUser.email === email) errors.push("Email is already in use");
      if (existingUser.name === name) errors.push("Name is already in use");
      if (existingUser.phone_number === phone_number)
        errors.push("Phone number is already in use");

      return res.status(400).send({ errors: errors });
    }

    const plainPassword = req.body.password;

    const passwordHash = await bcrypt.hash(plainPassword, 5);

    const user = {
      email: req.body.email,
      password: passwordHash,
      role: req.body.role,
      name: req.body.name,
      phone_number: req.body.phone_number,
    };

    // console.log(user)
    const dataUser = await User.create(user);

    console.log("data user: ",dataUser)

    res.status(200).send(dataUser);
  } catch (error) {
    res.status(500).send({ error: "Error creating user" });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = await User.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).send({
      message: "Updated user successful!",
      updateData: updateData,
    });
  } catch (error) {
    res.status(500).send("Could not update user");
  }
};

exports.delete = async (req, res) => {
  try {
    // console.log("Info: ", req.body)
    await User.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({
      message: "User deleted successful!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Could not delete User",
      error: error.message,
    });
  }
};
