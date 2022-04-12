const Chat = require("../model/Chat");
const Messages = require("../model/Messages");

// TODO: create a new method to add another user in chat group
/**
 * * get messages of chat finding for their users
 * @param {*} req
 * @param {*} res
 * @returns json
 */
async function getChat(req, res) {
  const { users_chat } = req.body;

  let chat = await Chat.findOne({ users: { $all: users_chat } }).populate(
    "messages"
  );

  if (!chat) {
    //return res.redirect("/api/chat/v1/create-chat");
    return res.status(204).json("donnot find the chat");
  }

  return res.json(chat);
}

/**
 * * create chat in mongo
 * @param {*} req
 * @param {*} res
 * @returns
 */

async function createChat(req, res) {
  const { users_chat } = req.body;
  let group = false;

  // verify if exits chat
  let chatExist = await Chat.findOne({ users: { $all: users_chat } });

  if (chatExist) {
    return res.json("Chat already exist...");
  }

  // verify if is a group chat
  if (users_chat.length > 2) {
    group = true;
  }

  // save chat
  try {
    let newChat = await new Chat({
      users: users_chat,
      group,
    });

    await newChat.save();
  } catch (e) {
    console.log(e);
    return res.staus(400).json("error in save Chat");
  }

  return res.json("chat created successfuly...");
}

/**
 * * save a message and update chat adding messages of user
 * * and add date to send message
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function addMessage(req, res) {
  const { users_chat, text, emitter, reciver } = req.body;

  console.log(users_chat);

  let chatExist = await Chat.findOne({ users: { $all: users_chat } });

  if (!chatExist) {
    return res.json("chat donnot find...");
  }

  // verify if emitter and reciver belong in chat
  if (!users_chat.includes(emitter)) {
    return res.json("emitter donnot find in chat...");
  }

  // verify if reciver is a array
  if (Array.isArray(reciver)) {
    if (!_isUserBelongGroup(reciver, group)) {
      return res.json("recivers donnot find in chat");
    }
  } else {
    if (!users_chat.includes(reciver)) {
      return res.json("reciver donnot find in chat");
    }
  }

  // varify if message is not empty
  if (text === "" || text === undefined || text === null) {
    return res.json("message is empty");
  }

  let date = new Date();

  try {
    let newMessage = new Messages({
      emitter,
      reciver,
      text,
      date_message: {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
      },
    });

    await Chat.findOneAndUpdate(
      { users: { $all: users_chat } },
      { $push: { messages: newMessage._id } }
    );

    await newMessage.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json("message dont save...");
  }

  return res.json("message saved successfully...");
}

/**
 * * verify if the reciver belong a chat
 * ? this function is private
 * @param {*} reciver
 * @returns bolean
 */
function _isUserBelongGroup(reciver, group) {
  for (let i = 0; i < reciver.length; i++) {
    if (!group.includes(reciver[i])) {
      return false;
    }
  }
  return true;
}

module.exports = {
  getChat,
  createChat,
  addMessage,
};
