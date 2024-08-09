const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../config/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
       // Populate saved books 
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);
      // Return token and user
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      // Return token and user
      return { token, user };
    },

    saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          {
            $addToSet: { savedBooks: { bookId, authors, description, title, image, link } },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
           // Remove book from saved books
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
