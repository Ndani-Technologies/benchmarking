const Answer = require("../Models/answers");
const { redisClient } = require("../middleware/redisClient");

const cacheKey = "ANSWERS";

const answerController = {
  getAllAnswers: async (req, res, next) => {
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
      const answers = await Answer.find();
      if (answers === "") {
        res.status(404).json({
          success: false,
          message: "answers not found",
        });
        return;
      }
      if (answers.length > cacheLength) {
        await redisClient.set(cacheKey, JSON.stringify(answers));
        res.status(200).json({
          success: true,
          message: "answers found",
          data: answers,
        });
      }
      if (answers.length <= cacheLength) {
        await redisClient.del(cacheKey);
        await redisClient.set(cacheKey, JSON.stringify(answers));
        cache = await redisClient.get(cacheKey);
        res.status(200).json({
          success: true,
          message: "answers found",
          data: JSON.parse(cache),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getAnswerById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const answer = await Answer.findById(id);
      if (answer) {
        res
          .status(200)
          .json({ message: "Answer retrieved", success: true, data: answer });
      } else {
        res.status(404).json({ message: "Answer not found" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  createAnswer: async (req, res, next) => {
    const { answerOption, includeExplanation, language } = req.body;
    try {
      let answer;
      if (language) {
        answer = await Answer.create({
          answerOption,
          includeExplanation,
          language,
        });
      } else {
        answer = await Answer.create({ answerOption, includeExplanation });
      }
      res
        .status(201)
        .json({ message: "Answer created", success: true, data: answer });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateAnswerById: async (req, res, next) => {
    const { id } = req.params;
    // const { title } = req.body;
    try {
      const answer = await Answer.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (answer) {
        await redisClient.del(cacheKey);
        const allAnswers = await Answer.find();
        await redisClient.set(cacheKey, JSON.stringify(allAnswers));
        res.status(200).json({ message: "Answer updated", success: true });
      } else {
        res.status(404).json({ message: "Answer not found", success: false });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  deleteAnswerById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const answer = await Answer.findByIdAndDelete(id);
      if (answer) {
        await redisClient.del(cacheKey);
        const allAnswers = await Answer.find();
        await redisClient.set(cacheKey, JSON.stringify(allAnswers));
        res.status(200).json({ message: "Answer deleted", success: true });
      } else {
        res.status(404).json({ message: "Answer not found", success: false });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getAnswersByLanguage: async (req, res, next) => {
    try {
      const { language } = req.params;
      const searchLanguage = language || "English";
      const answers = await Answer.find({ language: searchLanguage });
      res
        .status(200)
        .json({ message: "Answers retrieved", success: true, data: answers });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = answerController;
