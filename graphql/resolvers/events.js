const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      console.error('Could not retrieve events from MongoDB', err);
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) throw new Error('Unauthenticated!');
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5c5236e8a1a8342c96e23dbf'
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById('5c5236e8a1a8342c96e23dbf');

      if (!creator) {
        throw new Error('User not found');
      }

      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.error('There was some error saving the document to MongoDB', err);
    }
  }
};