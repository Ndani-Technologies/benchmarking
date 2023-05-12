const Answer = require("../Models/answers");
const { redisClient } = require("../middleware/redisClient");

const cacheKey = "ANSWERS";

const answerController = {
  getAllAnswers: async (req, res, next) => {
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
      const answers = await Answer.find();
      if (answers === "") {
        res.status(404).json({
          success: false,
          message: "answers not found",
        });
        return;
      }
      if (answers.length > cacheLength) {
        redisClient.set(cacheKey, JSON.stringify(answers));
        res.status(200).json({
          success: true,
          message: "answers found",
          data: answers,
        });
      }
      if (answers.length < cacheLength) {
        redisClient.del(cacheKey);
        redisClient.set(cacheKey, JSON.stringify(answers));
        res.status(200).json({
          success: true,
          message: "answers found",
          data: JSON.parse(cache),
        });
      }
      let answerOptionCheck = true;
      if (answers.length === cacheLength) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-underscore-dangle
        for (const _id in answers) {
          // eslint-disable-next-line no-prototype-builtins
          if (answers.hasOwnProperty(_id)) {
            // Check if the user exists in cache object
            // eslint-disable-next-line no-prototype-builtins
            if (cacheObj.hasOwnProperty(_id)) {
              // eslint-disable-next-line no-underscore-dangle
              const answerOptionValue = answers[_id].answerOption;
              // eslint-disable-next-line no-underscore-dangle
              const cacheanswerOptionValue = cacheObj[_id].answerOption;
              // Compare the email values
              if (answerOptionValue !== cacheanswerOptionValue) {
                answerOptionCheck = false;
              }
            }
          }
        }
        if (answerOptionCheck === false) {
          redisClient.del(cacheKey);
          redisClient.set(cacheKey, JSON.stringify(answers));
          res.status(200).json({
            success: true,
            message: "answers found",
            data: answers,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "answers found",
            data: JSON.parse(cache),
          });
        }
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
        redisClient.del(cacheKey);
        const allAnswers = await Answer.find();
        redisClient.set(cacheKey, JSON.stringify(allAnswers));
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
        redisClient.del(cacheKey);
        const allAnswers = await Answer.find();
        redisClient.set(cacheKey, JSON.stringify(allAnswers));
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
