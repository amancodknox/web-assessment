const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let server;

const connect = async () => {
  server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
};

const clear = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map(collection => collection.deleteMany({})));
};

const close = async () => {
  await mongoose.disconnect();
  if (server) await server.stop();
};

module.exports = { connect, clear, close };
