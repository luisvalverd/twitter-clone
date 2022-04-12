/**
 * * handle users to use the socket
 * * add and remove users to the chat socket
 * * when the user start in the chat socket, create a user
 * * if user is deconected remove the user
 * ? this is create to save a users who are connected in chat
 */

const Users = require("../model/Users");

/**
 * * add user in db when this user is conected the chat
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function addUser(req, res) {
  const { nickname, socketID } = req.body;

  let existUser = await _existUser(nickname);

  if (existUser) {
    return res.status(400).json("user already exits in db...");
  }

  try {
    let newUser = new Users({
      nickname,
      socket_id: socketID,
    });

    await newUser.save();
  } catch (error) {
    return res.status(400).json("error in add user...");
  }

  return res.json("add user successfuly.");
}

/**
 * * if user is desconected of chat socket remove of the db
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function removeUser(req, res) {
  const { nickname } = req.body;

  let existUser = await _existUser(nickname);

  if (!existUser) {
    return res.status(400).json("User dont find in db");
  }

  try {
    await Users.deleteOne({ nickname });
  } catch (error) {
    return res.status(400).json("Error to remove user.");
  }

  return res.json("remove user successfuly");
}

/**
 * * verify if the user exist in db
 * ? this is private function
 * @param {*} nickname
 * @returns boolean
 */
async function _existUser(nickname) {
  let user = await Users.findOne({ nickname });
  if (user) {
    return true;
  }
  return false;
}

async function getUserSocket(req, res) {
  let { nickname } = req.body;

  let user = await Users.findOne({ nickname });

  return res.json(user);
}

module.exports = {
  addUser,
  removeUser,
  getUserSocket,
};
