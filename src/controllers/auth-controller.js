const { createNotFoundError, sendErrorResponse } = require('../helpers/errors');
const { hashPassword, comparePasswords } = require('../helpers/password-encryption');
const UserModel = require('../models/user-model');

const login = async (req, res) => {
  const { email, password } = req.body;
  const crudentialExists = Boolean(email && password);

  try {
    if (!crudentialExists) throw new Error('Missing crudentials');
    const userDoc = await UserModel.findOne({ email });

    if (userDoc === null) throw createNotFoundError(`User with email '${email}' was not found.`);

    const passwordIsCorrect = await comparePasswords(password, userDoc.password);

    if (!passwordIsCorrect) throw new Error(`Password is incorrect`);

    res.status(200).json({
      user: userDoc,
      token: 'ateityje būsiu token\'as'
    });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

const register = async (req, res) => {
  const requestData = req.body;

  try {
    await UserModel.validateData(requestData);
    const { email, password, img, } = requestData;

    const userDoc = await UserModel.create({
      email,
      password: await hashPassword(password),
      img
    });

    res.status(201).json({
      user: userDoc,
      token: 'ateityje būsiu token\'as'
    })

  } catch (err) { sendErrorResponse(err, res); }
}

module.exports = {
  login,
  register,
};
