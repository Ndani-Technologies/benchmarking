const Category = require('../Models/Category');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting categories' });
    }
  },

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting category' });
    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    try {
      const category = await Category.create({ name });
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating category' });
    }
  },

  updateCategoryById: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating category' });
    }
  },

  deleteCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting category' });
    }
  },
};

module.exports = categoryController;
