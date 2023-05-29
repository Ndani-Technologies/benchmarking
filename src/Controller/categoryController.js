const Category = require("../Models/Category");
const { redisClient } = require("../middleware/redisClient");

const cacheKey = "CATEGORIES";

const categoryController = {
  getAllCategories: async (req, res, next) => {
    let cache = await redisClient.get(cacheKey);
    let cacheObj = "";
    let cacheLength = 0;
    if (cache != null) {
      cacheObj = JSON.parse(cache);
      cacheLength = Object.keys(cacheObj).length;
    } else {
      cacheLength = 0;
      cacheObj = "";
    }

    try {
      const categories = await Category.find();
      if (categories === "") {
        res.status(404).json({
          success: false,
          message: "categories not found",
        });
        return;
      }
      if (categories.length > cacheLength) {
        await redisClient.set(cacheKey, JSON.stringify(categories));
        res.status(200).json({
          success: true,
          message: "categories found",
          data: categories,
        });
      }
      if (categories.length <= cacheLength) {
        await redisClient.del(cacheKey);
        await redisClient.set(cacheKey, JSON.stringify(categories));
        cache = await redisClient.get(cacheKey);
        res.status(200).json({
          success: true,
          message: "categories found",
          data: JSON.parse(cache),
        });
      }
    } catch (err) {
      next(err);
    }
  },

  getCategoryById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id);
      if (category) {
        res.status(200).json({
          message: "Category retrieved",
          success: true,
          data: category,
        });
      } else {
        res.status(404).json({ success: false, message: "category not found" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  createCategory: async (req, res, next) => {
    const { titleEng, titleAr, titleFr, titleSp, language } = req.body;
    const cat = new Category();
    try {
      if (language) {
        if (titleEng) {
          cat.titleEng = titleEng;
          cat.titleAr = "";
          cat.titleFr = "";
          cat.titleSp = "";
        }
        if (titleAr) {
          cat.titleAr = titleAr;
          cat.titleFr = "";
          cat.titleSp = "";
          cat.titleEng = "";
        }
        if (titleFr) {
          cat.titleFr = titleFr;
          cat.titleAr = "";
          cat.titleSp = "";
          cat.titleEng = "";
        }
        if (titleSp) {
          cat.titleSp = titleSp;
          cat.titleFr = "";
          cat.titleAr = "";
          cat.titleEng = "";
        }
        cat.language = language;
      } else {
        cat.titleEng = titleEng;
        cat.language = "English";
      }
      console.log("category ", cat);
      const catData = await Category.create(cat);
      res
        .status(201)
        .json({ message: "Category created", success: true, data: catData });
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
        await redisClient.del(cacheKey);
        const allCategories = await Category.find();
        await redisClient.set(cacheKey, JSON.stringify(allCategories));
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
        await redisClient.del(cacheKey);
        const allCategories = await Category.find();
        await redisClient.set(cacheKey, JSON.stringify(allCategories));
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
      res.status(200).json({
        message: "Categories retrieved",
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteAllCategories: async (req, res, next) => {
    try {
      const { id } = req.body;
      const categories = await Category.deleteMany({ _id: { $in: id } });
      if (categories) {
        res.status(200).json({
          success: true,
          message: "all categories deleted",
        });
      } else {
        res.status(200).json({
          success: false,
          message: "internal server error",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
