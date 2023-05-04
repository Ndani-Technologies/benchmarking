const Category = require("../Models/Category");

const categoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await Category.find();
      res
        .status(200)
        .json({
          message: "Categories retrieved",
          success: true,
          data: categories,
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getCategoryById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id);
      if (category) {
        res
          .status(200)
          .json({
            message: "Category retrieved",
            success: true,
            data: category,
          });
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  createCategory: async (req, res, next) => {
    const { title, language } = req.body;
    try {
      let category;
      if (language) {
        category = await Category.create({ title, language });
      } else {
        category = await Category.create({ title });
      }
      res
        .status(201)
        .json({ message: "Category created", success: true, data: category });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateCategoryById: async (req, res, next) => {
    const { id } = req.params;
    // const { title } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (category) {
        res.status(200).json({ message: "Category updated", success: true });
      } else {
        res.status(404).json({ message: "Category not found", success: false });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  deleteCategoryById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (category) {
        res.status(200).json({ message: "Category deleted", success: true });
      } else {
        res.status(404).json({ message: "Category not found", success: false });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getCategoriesByLanguage: async (req, res, next) => {
    try {
      const { language } = req.params;
      const searchLanguage = language || "English";
      const categories = await Category.find({ language: searchLanguage });
      res
        .status(200)
        .json({
          message: "Categories retrieved",
          success: true,
          data: categories,
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = categoryController;
