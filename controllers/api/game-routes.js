const router = require("express").Router();
const { Game, List, User } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Game.findAll({
    include: [
      {
        model: List,
        attributes: ['id', 'title', 'user_id'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then((dbGameData) => res.json(dbGameData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Game.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: List,
        attributes: ['id', 'title', 'user_id'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(dbGameData => {
      if (!dbGameData) {
        res.status(404).json({ message: 'No game found with this id' });
        return;
      }
      res.json(dbGameData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  Game.create({
    title: req.bidy.title,
    list_id: req.body.list_id
  })
    .then(dbGameData => res.json(dbGameData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
  Game.update(
    {
      title: req.body.title,
      // theoretically this will let you change the associated list. not sure if it will work
      list_id: req.body.list_id
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbGameData => {
      if (!dbGameData) {
        res.status(404).json({ message: 'No game found with this id' });
        return;
      }
      res.json(dbGameData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  Game.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbGameData => {
      if (!dbGameData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;