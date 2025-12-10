const ShoppingList = require("../models/shoppingList");

module.exports = {
  cget: async (req, res, next) => {
    try {
      const where = {};
      if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
      }
      const lists = await ShoppingList.findAll({ where });
      res.json(lists);
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const list = await ShoppingList.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(list);
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const list = await ShoppingList.findByPk(req.params.id);
      if (!list) return res.sendStatus(404);
      if (req.user.role !== 'ADMIN' && list.userId !== req.user.id) {
        return res.sendStatus(403);
      }

      await list.update(req.body);
      res.json(list);
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      const list = await ShoppingList.findByPk(req.params.id);
      if (!list) return res.sendStatus(404);
      if (req.user.role !== 'ADMIN' && list.userId !== req.user.id) return res.sendStatus(403);

      await list.destroy();
      res.sendStatus(204);
    } catch (error) { next(error); }
  }
};