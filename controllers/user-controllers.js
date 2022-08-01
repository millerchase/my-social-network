const { User, Thought } = require('../models');

const userController = {
  getAllUsers: (req, res) => {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUsersData => res.json(dbUsersData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getUserById: ({ params }, res) => {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }

        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createUser: ({ body }, res) => {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  updateUser: ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true
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

  deleteUser: ({ params }, res) => {
    Thought.deleteMany({ userId: params.id }).then(() => {
      User.findByIdAndDelete(params.id, function (err, docs) {
        if (err) {
          res.status(404).json({ message: 'No user found with this id!' });
        } else {
          res.json({ Deleted: docs });
        }
      });
    });
  },

  addFriend: ({ params }, res) => {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }

        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteFriend: ({ params }, res) => {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }

        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = userController;
