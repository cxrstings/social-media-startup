const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thought');

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentsDB';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userData = [
  {
    username: 'exampleUser1',
    email: 'exampleUser1@test.com',
  },
  {
    username: 'exampleUser2',
    email: 'exampleUser2@test.com',
  },
  {
    username: 'exampleUser3',
    email: 'exampleUser3@test.com',
    friends: ['exampleUser1', 'exampleUser4']
  },
  {
    username: 'exampleUser4',
    email: 'exampleUser4@test.com',
    friends: ['exampleUser2', 'exampleUser3']
  }
];

const thoughtData = [
  {
    thoughtText: 'This is an example thought by exampleUser1',
    createdAt: new Date(),
    username: 'exampleUser1',
  },
  {
    thoughtText: 'This is an example thought by exampleUser2',
    createdAt: new Date(),
    username: 'exampleUser2',
  },
];

const createThoughts = async () => {
  const createdThoughts = await Thought.insertMany(thoughtData);
  console.log('Thoughts seeded!');
  return createdThoughts;
}

const seedDatabase = async () => {
  await mongoose.connection.dropDatabase();

  const createdUsers = await User.insertMany(userData);
  const createdThoughts = await createThoughts();

  await Promise.all([
    User.findOneAndUpdate(
      { username: 'exampleUser1' },
      { $push: { thoughts: createdThoughts[0]._id } }
    ),
    User.findOneAndUpdate(
      { username: 'exampleUser2' },
      { $push: { thoughts: createdThoughts[1]._id } }
    ),
    User.findOneAndUpdate(
      { username: 'exampleUser1' },
      { $push: { friends: [createdUsers[1]._id, createdUsers[2]._id] } }
    ),
    User.findOneAndUpdate(
      { username: 'exampleUser2' },
      { $push: { friends: [createdUsers[0]._id, createdUsers[3]._id] } }
    ),
    User.findOneAndUpdate(
      { username: 'exampleUser3' },
      { $push: { friends: [createdUsers[0]._id, createdUsers[3]._id] } }
    ),
    User.findOneAndUpdate(
      { username: 'exampleUser4' },
      { $push: { friends: [createdUsers[1]._id, createdUsers[2]._id] } }
    )
  ]);

  console.log('Database seeded!');
  process.exit(0);
};

// seedDatabase();

module.exports = seedDatabase;