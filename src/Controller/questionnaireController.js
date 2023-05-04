const Questionnaire = require("../Models/questionnaire");

const QuestionnaireController = {
  async getAllquestionnaire(req, res, next) {
    try {
      const questionnaire = await Questionnaire.find()
        .populate("category")
        .populate("answerOptions");
      res.json({
        success: true,
        message: "Successfully retrieved questionnaire",
        data: questionnaire,
      });
    } catch (err) {
      next(err);
    }
  },

  async getQuestionnaire(req, res, next) {
    try {
      const questionnaire = await Questionnaire.findById(req.params.id)
        .populate("category")
        .populate("answerOptions");
      if (questionnaire == null) {
        return res
          .status(404)
          .json({ success: false, message: "Cannot retrieved Questionnaire" });
      }
      res.json({
        success: true,
        message: "Successfully retrieved Questionnaire",
        data: questionnaire,
      });
    } catch (err) {
      next(err);
    }
  },

  async createQuestionnaire(req, res, next) {
    const questionnaire = new Questionnaire(req.body);
    try {
      const newQuestionnaire = await questionnaire.save();
      res
        .status(201)
        .json({
          success: true,
          message: "Successfully created Questionnaire",
          data: newQuestionnaire,
        });
    } catch (err) {
      next(err);
    }
  },

  async updateQuestionnaire(req, res, next) {
    try {
      const questionnaire = await Questionnaire.findById(req.params.id);
      if (questionnaire == null) {
        return res
          .status(404)
          .json({ success: false, message: "Cannot retrieved questionnaire" });
      }
      if (req.body.title != null) {
        questionnaire.title = req.body.title;
      }
      if (req.body.description != null) {
        questionnaire.description = req.body.description;
      }
      if (req.body.category != null) {
        questionnaire.category = req.body.category;
      }
      if (req.body.languageSelector != null) {
        questionnaire.languageSelector = req.body.languageSelector;
      }
      if (req.body.status != null) {
        questionnaire.status = req.body.status;
      }
      if (req.body.visibility != null) {
        questionnaire.visibility = req.body.visibility;
      }
      if (req.body.answerOptions != null) {
        questionnaire.answerOptions = req.body.answerOptions;
      }
      await questionnaire.save();
      res.json({
        success: true,
        message: "Successfully updated questionnaire",
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteQuestionnaire(req, res, next) {
    try {
      const questionnaire = await Questionnaire.findByIdAndDelete(
        req.params.id
      );
      if (questionnaire == null) {
        return res
          .status(404)
          .json({ success: false, message: "Cannot find Questionnaire" });
      }

      res.json({
        success: true,
        message: "Successfully deleted Questionnaire",
      });
    } catch (err) {
      next(err);
    }
  },
  async getQuestionnaireByLanguage(req, res, next) {
    try {
      const { language } = req.params;
      const searchLanguage = language || "English";
      const questionnaire = await Questionnaire.find({
        languageSelector: searchLanguage,
      });
      res
        .status(200)
        .json({
          message: "Questionnaire retrieved",
          success: true,
          data: questionnaire,
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
module.exports = QuestionnaireController;
