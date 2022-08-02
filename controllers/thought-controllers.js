const { User, Thought } = require('../models');

const thoughtController = {
  getAllThoughts: (req, res) => {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtsData => res.json(dbThoughtsData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getThoughtById: ({ params }, res) => {
    Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .then(dbThoughtData => {
        // If no user is found, send 404
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }

        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createThought: ({ body }, res) => {
    Thought.create(body)
      .then(dbThoughtData => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  updateThought: ({ params, body }, res) => {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true
    })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }

        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteThought: ({ params }, res) => {
    Thought.findByIdAndDelete(params.id, function (err, docs) {
      if (err) {
        res.status(404).json({ message: 'No thought found with this id!' });
      } else {
        res.json({ Deleted: docs });
        return User.findOneAndUpdate(
          { _id: docs.userId },
          { $pull: { thoughts: docs._id } }
        );
      }
    });
  },

  createReaction: ({ params, body }, res) => {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $push: { reactions: body } },
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }

        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteReaction: ({ params }, res) => {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }

        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;
