const User = require("../models/users");

module.exports = {
  cget: async (req, res) => {
    res.json(await User.findAll());
  },
  create: async (req, res, next) => {
    try {
      res.status(201).json(await User.create(req.body));
    } catch (e) {
      next(e);
    }
  },
  get: async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const user = await User.findByPk(id);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  },
  patch: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [nbUpdated, [user]] = await User.update(req.body, {
        where: { id },
        returning: true,
        individualHooks: true,
      });
      if (nbUpdated === 0) {
        return res.sendStatus(404);
      }

      return res.json(user);
    } catch (e) {
      next(e);
    }
  },
  delete: async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const nbDeleted = await User.destroy({ where: { id } });
    if (nbDeleted === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  },
  update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        return res.sendStatus(403); 
      }
      if (req.user.role !== 'ADMIN' && req.body.role) {
        delete req.body.role;
      }
      const user = await User.findByPk(id);
      if (!user) return res.sendStatus(404);
      await user.update(req.body);
      res.json(user);
    } catch (error) { next(error); }
  },
};
