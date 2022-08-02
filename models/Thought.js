const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => {
        createdAtVal = createdAtVal.toISOString();
        return DateTime.fromISO(createdAtVal).toFormat('ff');
      }
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => {
        createdAtVal = createdAtVal.toISOString();
        return DateTime.fromISO(createdAtVal).toFormat('ff');
      }
    },
    username: {
      type: String,
      required: true
    },
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
