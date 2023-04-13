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
];

const seedDatabase = async () => {
  await mongoose.connection.dropDatabase();

  const createdUsers = await User.insertMany(userData);

  const thoughtData = [
    {
      thoughtText: 'This is an example thought by exampleUser1',
      createdAt: new Date(),
      username: createdUsers[0].username,
    },
    {
      thoughtText: 'This is an example thought by exampleUser2',
      createdAt: new Date(),
      username: createdUsers[1].username,
    },
  ];

  const createdThoughts = await Thought.insertMany(thoughtData);

  // Associate the created thoughts with the created users
  await Promise.all([
    User.findOneAndUpdate(
      { username: 'exampleUser1' },
      { $push: { thoughts: createdThoughts[0]._id } }
    ),
    User.findOneAndUpdate(
      { username: 'exampleUser2' },
      { $push: { thoughts: createdThoughts[1]._id } }
    )
  ]);

  console.log('Database seeded!');
  process.exit(0);
};

seedDatabase();

module.exports = seedDatabase;
