import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const URI = `redis://${process.env.USERNAME_REDIS}:${process.env.PASSWORD_REDIS}@${process.env.SERVER_REDIS}:${process.env.PORT_REDIS}/2`;

var client = createClient({
  url: URI,
});

client.on("error", (err) => console.log("Redis Client Error ", err));

client.connect().then((db) => console.log("redis connect"));

export default client;
