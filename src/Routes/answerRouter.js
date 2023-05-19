const express = require("express");

const router = express.Router();
const answerController = require("../Controller/answerController");

router.get("/", answerController.getAllAnswers);
router.get("/:id", answerController.getAnswerById);
router.post("/", answerController.createAnswer);
router.put("/:id", answerController.updateAnswerById);
router.delete("/:id", answerController.deleteAnswerById);
router.get(
  "/answers/getByLanguage/:language?",
  answerController.getAnswersByLanguage
);

module.exports = router;
