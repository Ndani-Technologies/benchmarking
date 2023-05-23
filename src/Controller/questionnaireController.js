const axios = require("../../node_modules/axios/dist/node/axios.cjs");
const { redisClient } = require("../middleware/redisClient");
const Questionnaire = require("../Models/questionnaire");

const cacheKey = "QUESTIONNAIRE";

const QuestionnaireController = {
  async getAllquestionnaire(req, res, next) {
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
        await redisClient.set(cacheKey, JSON.stringify(questionnaire));
        res.status(200).json({
          success: true,
          message: "questionnaire found",
          data: questionnaire,
        });
      }
      if (questionnaire.length <= cacheLength) {
        await redisClient.del(cacheKey);
        await redisClient.set(cacheKey, JSON.stringify(questionnaire));
        cache = await redisClient.get(cacheKey);
        res.status(200).json({
          success: true,
          message: "questionnaire found",
          data: JSON.parse(cache),
        });
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
  async whohasAnswer(req, res, next) {
    try {
      const totalUsers = req.body.whoHasAnswer.userId.length;
      const { id } = req.params;
      req.body.whoHasAnswer.totalUsers = totalUsers;
      const { userId } = req.body.whoHasAnswer;
      Questionnaire.findByIdAndUpdate(
        id,
        {
          $addToSet: { "whoHasAnswer.userId": { $each: userId } },
          $set: { "whoHasAnswer.totalUsers": totalUsers },
        },
        { new: true }
      ).then((questionnaire) => {
        if (questionnaire) {
          res.status(200).json({
            success: true,
            message: "successfully updated ",
            data: questionnaire,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "no questionnaire found ",
          });
        }
      });
    } catch (error) {
      next(error);
    }
  },
  async createQuestionnaire(req, res, next) {
    // const userId = req.params.id;
    // req.body.whoHasAnswer = userId;
    // const lastquestion = await Questionnaire.findOne().sort({ _id: -1 });
    // if (lastquestion.response) {
    //   req.body.response = lastquestion.response + 1;
    // } else {
    //   req.body.response = 1;
    // }

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
      if (req.body.whoHasAnswer != null) {
        questionnaire.whoHasAnswer = req.body.whoHasAnswer;
      }
      await questionnaire.save();
      await redisClient.del(cacheKey);
      const allQuestionnaires = await Questionnaire.find()
        .populate("category")
        .populate("answerOptions");
      await redisClient.set(cacheKey, JSON.stringify(allQuestionnaires));
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

      await redisClient.del(cacheKey);
      const allQuestionnaires = await Questionnaire.find()
        .populate("category")
        .populate("answerOptions");
      await redisClient.set(cacheKey, JSON.stringify(allQuestionnaires));
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
