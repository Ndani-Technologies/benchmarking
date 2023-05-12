const axios = require("../../node_modules/axios/dist/node/axios.cjs");
const { redisClient } = require("../middleware/redisClient");
const Questionnaire = require("../Models/questionnaire");

const cacheKey = "QUESTIONNAIRE";

const QuestionnaireController = {
  async getAllquestionnaire(req, res, next) {
    const cache = await redisClient.get(cacheKey);
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
      const questionnaire = await Questionnaire.find()
        .populate("category")
        .populate("answerOptions");
      if (questionnaire === "") {
        res.status(404).json({
          success: false,
          message: "questionnaire not found",
        });
        return;
      }
      if (questionnaire.length > cacheLength) {
        redisClient.set(cacheKey, JSON.stringify(questionnaire));
        res.status(200).json({
          success: true,
          message: "questionnaire found",
          data: questionnaire,
        });
      }
      if (questionnaire.length < cacheLength) {
        redisClient.del(cacheKey);
        redisClient.set(cacheKey, JSON.stringify(questionnaire));
        res.status(200).json({
          success: true,
          message: "questionnaire found",
          data: JSON.parse(cache),
        });
      }
      let questionnaireTitleCheck = true;
      if (questionnaire.length === cacheLength) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-underscore-dangle
        for (const _id in questionnaire) {
          // eslint-disable-next-line no-prototype-builtins
          if (questionnaire.hasOwnProperty(_id)) {
            // Check if the user exists in cache object
            // eslint-disable-next-line no-prototype-builtins
            if (cacheObj.hasOwnProperty(_id)) {
              // eslint-disable-next-line no-underscore-dangle
              const questionnaireTitle = questionnaire[_id].title;
              // eslint-disable-next-line no-underscore-dangle
              const cacheTitle = cacheObj[_id].title;
              // Compare the email values
              if (questionnaireTitle !== cacheTitle) {
                questionnaireTitleCheck = false;
              }
            }
          }
        }
        if (questionnaireTitleCheck === false) {
          redisClient.del(cacheKey);
          redisClient.set(cacheKey, JSON.stringify(questionnaire));
          res.status(200).json({
            success: true,
            message: "questionnaires found",
            data: questionnaire,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "questionnaires found",
            data: JSON.parse(cache),
          });
        }
      }
    } catch (err) {
      console.log("error", err);
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
      res.status(201).json({
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
      redisClient.del(cacheKey);
      const allQuestionnaires = await Questionnaire.find()
        .populate("category")
        .populate("answerOptions");
      redisClient.set(cacheKey, JSON.stringify(allQuestionnaires));
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

      redisClient.del(cacheKey);
      const allQuestionnaires = await Questionnaire.find()
        .populate("category")
        .populate("answerOptions");
      redisClient.set(cacheKey, JSON.stringify(allQuestionnaires));
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
      res.status(200).json({
        message: "Questionnaire retrieved",
        success: true,
        data: questionnaire,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async getUserById(req, res, next) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/${req.params.id}`
      );
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = QuestionnaireController;
