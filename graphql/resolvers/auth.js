const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const alreadyUser = await User.findOne({ email: args.userInput.email });
      if (alreadyUser) {
        throw new Error(
          'There is already an user registered with this email...'
        );
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.error('There was some error saving the user to MongoDB', err);
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found!');
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new Error('Password is incorrect!');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '1h'
      }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  }
};
