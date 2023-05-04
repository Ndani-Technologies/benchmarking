const express = require("express");

const router = express.Router();
const QuestionnaireController = require("../Controller/questionnaireController");

router.get("/", QuestionnaireController.getAllquestionnaire);
router.get("/:id", QuestionnaireController.getQuestionnaire);
router.post("/", QuestionnaireController.createQuestionnaire);
router.put("/:id", QuestionnaireController.updateQuestionnaire);
router.delete("/:id", QuestionnaireController.deleteQuestionnaire);
router.get(
  "/questionnaires/getByLanguage/:language?",
  QuestionnaireController.getQuestionnaireByLanguage
);

module.exports = router;
