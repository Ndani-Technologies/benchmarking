const express = require("express");

const router = express.Router();
const categoryController = require("../Controller/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategoryById);
router.delete("/:id", categoryController.deleteCategoryById);

router.delete("/delete/deleteall", categoryController.deleteAllCategories);
router.get(
  "/categories/getByLanguage/:language?",
  categoryController.getCategoriesByLanguage
);

module.exports = router;
