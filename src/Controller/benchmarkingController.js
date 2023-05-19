const { default: axios } = require("axios");
const Benchmarking = require("../Models/bench");
const Questionnaire = require("../Models/questionnaire");
const Answer = require("../Models/answers");
const { redisClient } = require("../middleware/redisClient");
const devenv = require("../configs/dev");

const cacheKey = "BENCHMARKINGS";

const benchmarkingController = {
  getAllBenchmarking: async (req, res, next) => {
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
      const benchmarkings = await Benchmarking.find()
        .populate("questionnaire")
        .populate({
          path: "questionnaire",
          populate: [
            {
              path: "category",
              model: "Category",
              // select: 'language titleEng titleAr titleSp titleFr'
            },
            {
              path: "answerOptions",
              model: "answers",
              // select: 'language includeExplanation answerAttempt'
            },
          ],
        });
      if (benchmarkings === "") {
        res.status(404).json({
          success: false,
          message: "benchmarkings not found",
        });
        return;
      }
      if (benchmarkings.length > cacheLength) {
        await redisClient.set(cacheKey, JSON.stringify(benchmarkings));
        res.status(200).json({
          success: true,
          message: "benchmarkings found",
          data: benchmarkings,
        });
      }
      if (benchmarkings.length <= cacheLength) {
        await redisClient.del(cacheKey);
        await redisClient.set(cacheKey, JSON.stringify(benchmarkings));
        cache = await redisClient.get(cacheKey);
        res.status(200).json({
          success: true,
          message: "benchmarkings found",
          data: JSON.parse(cache),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getBenchmarkingById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const benchmarking = await Benchmarking.findById(id)
        .populate("questionnaire")
        .populate({
          path: "questionnaire",
          populate: [
            {
              path: "category",
              model: "Category",
              // select: 'language titleEng titleAr titleSp titleFr'
            },
            {
              path: "answerOptions",
              model: "answers",
              // select: 'language includeExplanation answerAttempt'
            },
          ],
        });
      if (benchmarking) {
        res.status(200).json({
          message: "Benchmarking retrieved",
          success: true,
          data: benchmarking,
        });
      } else {
        res
          .status(404)
          .json({ message: "Benchmarking not found", success: false });
      }
    } catch (error) {
      next(error);
    }
  },

  createBenchmarking: async (req, res) => {
    const { userId, title, country } = req.body;
    try {
      const user = await axios.get(`${devenv.userUrl}user/${userId}`);
      if (user.data.success) {
        const questionnaire = await Questionnaire.find({});
        const benchTitle = await Benchmarking.find({ title });
        if (benchTitle && benchTitle.length > 0) {
          res
            .status(500)
            .json({ message: "duplication of title", success: false });
          return;
        }
        const benchmarking = await Benchmarking.create({
          title,
          country,
          questionnaire,
          user: user.data.data,
        });

        res.status(201).json({
          message: "Benchmarking created",
          success: true,
          data: benchmarking,
        });
      } else {
        res.status(404).json({ message: "User not found", success: false });
      }
    } catch (error) {
      res.status(404).json({ message: "error occured ", success: false });
    }
  },

  updateBenchmarkingById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const benchmarking = await Benchmarking.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (benchmarking) {
        await redisClient.del(cacheKey);
        const allBenchmarkings = await Benchmarking.find()
          .populate("questionnaire")
          .populate({
            path: "questionnaire",
            populate: [
              {
                path: "category",
                model: "Category",
              },
              {
                path: "answerOptions",
                model: "answers",
              },
            ],
          });
        await redisClient.set(cacheKey, JSON.stringify(allBenchmarkings));
        res
          .status(200)
          .json({ message: "Benchmarking updated", success: true });
      } else {
        res
          .status(404)
          .json({ message: "Benchmarking not found", success: false });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteBenchmarkingById: async (req, res, next) => {
    const { id } = req.params;
    try {
      const benchmarking = await Benchmarking.findByIdAndDelete(id);
      if (benchmarking) {
        await redisClient.del(cacheKey);
        const allBenchmarkings = await Benchmarking.find()
          .populate("questionnaire")
          .populate({
            path: "questionnaire",
            populate: [
              {
                path: "category",
                model: "Category",
              },
              {
                path: "answerOptions",
                model: "answers",
              },
            ],
          });
        await redisClient.set(cacheKey, JSON.stringify(allBenchmarkings));
        res
          .status(200)
          .json({ message: "Benchmarking deleted", success: true });
      } else {
        res
          .status(404)
          .json({ message: "Benchmarking not found", success: false });
      }
    } catch (error) {
      next(error);
    }
  },
  getBenchmarkingByTitle: async (req, res, next) => {
    try {
      const query = new RegExp(req.params.title, "i");
      const benchmarking = await Benchmarking.find({
        title: { $regex: query },
      }).populate("questionnaire");
      if (benchmarking) {
        res.status(200).json({
          message: "Benchmarking retrieved with Title",
          success: true,
          data: benchmarking,
        });
      } else {
        res.status(404).json({
          message: "Benchmarking not found with title",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getBenchmarkingByCountry: async (req, res, next) => {
    try {
      const query = new RegExp(req.params.country, "i");
      const benchmarking = await Benchmarking.find({
        country: { $regex: query },
      }).populate("questionnaire");
      if (benchmarking) {
        res.status(200).json({
          message: "Benchmarking retrieved by country",
          success: true,
          data: benchmarking,
        });
      } else {
        res.status(404).json({
          message: "Benchmarking not found by country",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getBenchmarkingByStatus: async (req, res, next) => {
    try {
      const statusValue = req.params.status;
      const benchmarking = await Benchmarking.find({
        status: statusValue,
      }).populate("questionnaire");
      if (benchmarking) {
        res.status(200).json({
          message: "Benchmarking retrieved by status",
          success: true,
          data: benchmarking,
        });
      } else {
        res.status(404).json({
          message: "Benchmarking not found by status",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getBenchmarkingBetweenDate: async (req, res, next) => {
    try {
      const startDate = new Date(req.params.startdate);
      const endDate = new Date(req.params.enddate);
      const benchmarks = await Benchmarking.find({
        startdate: {
          $gte: startDate,
          $lte: endDate,
        },
        enddate: {
          $gte: startDate,
          $lte: endDate,
        },
      });
      if (benchmarks) {
        res.status(500).json({
          message: "Benchmarking retrieved",
          success: true,
          data: benchmarks,
        });
      } else {
        res.status(200).json({
          message: "Benchmarking not retrieved",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getBenchmarkingByCompletionLevel: async (req, res, next) => {
    try {
      const startRange = req.params.startrange;
      const endRange = req.params.endrange;
      const benchmarks = await Benchmarking.find({
        completionLevel: {
          $gte: startRange,
          $lte: endRange,
        },
      });
      if (!benchmarks) {
        res.status(500).json({
          message: "Benchmarking not found between range",
          success: false,
        });
      } else {
        res.status(200).json({
          message: "Benchmarking retrieved between range",
          success: true,
          data: benchmarks,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  compareTwoBenchmarking: async (req, res, next) => {
    try {
      const benchId1 = req.params.id1;
      const benchId2 = req.params.id2;
      const benchmarks = await Benchmarking.find({
        _id: { $in: [benchId1, benchId2] },
      });
      res.status(200).json({
        success: true,
        message: "Comparison successful",
        data: benchmarks,
      });
    } catch (error) {
      next(error);
    }
  },
  compareThreeBenchmarking: async (req, res, next) => {
    try {
      const benchId1 = req.params.id1;
      const benchId2 = req.params.id2;
      const benchId3 = req.params.id3;
      const benchmarks = await Benchmarking.find({
        _id: { $in: [benchId1, benchId2, benchId3] },
      });
      res.status(200).json({
        success: true,
        message: "Comparison successful",
        data: benchmarks,
      });
    } catch (error) {
      next(error);
    }
  },
  compareFourBenchmarking: async (req, res, next) => {
    try {
      const benchId1 = req.params.id1;
      const benchId2 = req.params.id2;
      const benchId3 = req.params.id3;
      const benchId4 = req.params.id4;
      const benchmarks = await Benchmarking.find({
        _id: { $in: [benchId1, benchId2, benchId3, benchId4] },
      });
      res.status(200).json({
        success: true,
        message: "Comparison successful",
        data: benchmarks,
      });
    } catch (error) {
      next(error);
    }
  },
  // eslint-disable-next-line no-unused-vars
  getCategories: async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: "get categories called",
    });
  },
  updateUserResponse: async (req, res, next) => {
    const { id } = req.params;
    // const loggedUser = session.userLogin;
    // console.log(session);
    // console.log("userid  = ",loggedUser);
    // const user = await axios.get(`${devenv.userUrl}user/${loggedUser._id}`);
    // eslint-disable-next-line
    const { user_resp } = req.body;
    let totalAnswers = 0;
    const benchmarking = await Benchmarking.findById(id)
      .populate("questionnaire")
      .populate({
        path: "questionnaire",
        populate: [
          {
            path: "category",
            model: "Category",
            // select: 'language titleEng titleAr titleSp titleFr'
          },
          {
            path: "answerOptions",
            model: "answers",
            // select: 'language includeExplanation answerAttempt'
          },
        ],
      });
    if (!benchmarking) {
      return res
        .status(404)
        .send({ success: false, message: "Benchmarking not found" });
    }
    const { questionnaire } = benchmarking;

    // eslint-disable-next-line no-console
    console.log("user_resp", user_resp, req.body);

    req.body.user_resp.forEach((answer) => {
      if (answer.selectedOption) {
        totalAnswers += 1;
      }
    });
    const completionLevel = (totalAnswers / questionnaire.length) * 10000;
    try {
      const updatedBenchmarking = await Benchmarking.findByIdAndUpdate(
        id,
        // eslint-disable-next-line
        { user_resp, completionLevel },
        { new: true }
      );
      res.send({
        success: true,
        message: "User Response updated",
        data: updatedBenchmarking,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      next(error);
    }
  },
  // eslint-disable-next-line no-unused-vars
  getBenchmarkingSummary: async (req, res, next) => {
    const { id } = req.params;
    const benchmarking = await Benchmarking.findById(id)
      .populate("questionnaire")
      .populate({
        path: "questionnaire",
        populate: [
          {
            path: "category",
            model: "Category",
            // select: 'language titleEng titleAr titleSp titleFr'
          },
          {
            path: "answerOptions",
            model: "answers",
            // select: 'language includeExplanation answerAttempt'
          },
        ],
      });
    if (!benchmarking) {
      return res
        .status(404)
        .send({ success: false, message: "Benchmarking not found" });
    }

    // eslint-disable-next-line camelcase
    const { questionnaire, user_resp } = benchmarking;
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let answerComment = 0;
    const answerOpt = [];
    // eslint-disable-next-line camelcase
    const totalNumberOfQusetionAttempted = user_resp.length;
    const totalNumberOfQuestions = questionnaire.length;

    // eslint-disable-next-line camelcase
    const completionLevel = (user_resp.length / questionnaire.length) * 100;
    const ans = await Answer.find().select("answerOption");
    let count = 0;
    ans.forEach((answers) => {
      answerOpt[count] = answers.answerOption;
      count += 1;
    });

    count = 0;
    // eslint-disable-next-line camelcase
    await Promise.all(
      user_resp.map(async (answerOptions) => {
        const answ = await Answer.find(answerOptions.selectedOption).select(
          "answerOption includeExplanation"
        );

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < answerOpt.length; i++) {
          if (answ[0].answerOption === answerOpt[i]) {
            if (answ[0].includeExplanation === true) {
              // eslint-disable-next-line no-plusplus
              answerComment++;
            }
            if (answerOpt[i].toLowerCase() === "yes") {
              // eslint-disable-next-line no-plusplus
              count1++;
            }
            if (answerOpt[i].toLowerCase() === "no") {
              // eslint-disable-next-line no-plusplus
              count2++;
            }
            if (answerOpt[i].toLowerCase() === "we don't have a policy") {
              // eslint-disable-next-line no-plusplus
              count3++;
            }
            if (answerOpt[i].toLowerCase() === "don't know") {
              // eslint-disable-next-line no-plusplus
              count4++;
            }
          }
        }
      })
    );

    const dataReturn = {
      noOfQuestions: totalNumberOfQuestions,
      attemptQuestions: totalNumberOfQusetionAttempted,
      answerYes: count1,
      answerNo: count2,
      answerWeDontHavePolicy: count3,
      answerDontKnow: count4,
      answersComments: answerComment,
      completionLevel,
    };
    res.status(200).json({
      success: true,
      message: "record retrieved",
      data: dataReturn,
    });
  },
  // eslint-disable-next-line no-unused-vars
  getBenchmarkingSummaryByUser: async (req, res, next) => {
    const { id } = req.params;
    const benchmarking = await Benchmarking.findOne({ "user._id": id })
      .populate("questionnaire")
      .populate({
        path: "questionnaire",
        populate: [
          {
            path: "category",
            model: "Category",
            // select: 'language titleEng titleAr titleSp titleFr'
          },
          {
            path: "answerOptions",
            model: "answers",
            // select: 'language includeExplanation answerAttempt'
          },
        ],
      })
      .exec();
    if (!benchmarking) {
      return res
        .status(404)
        .send({ success: false, message: "Benchmarking not found" });
    }
    // eslint-disable-next-line camelcase
    const {
      questionnaire,
      user_resp,
      title,
      country,
      status,
      createdAt,
      user,
    } = benchmarking;
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let answerComment = 0;
    const answerOpt = [];
    // eslint-disable-next-line camelcase
    const totalNumberOfQusetionAttempted = user_resp.length;
    const totalNumberOfQuestions = questionnaire.length;

    // eslint-disable-next-line camelcase
    const completionLevel = (user_resp.length / questionnaire.length) * 100;
    const ans = await Answer.find().select("answerOption");
    let count = 0;
    ans.forEach((answers) => {
      answerOpt[count] = answers.answerOption;
      count += 1;
    });

    count = 0;
    // eslint-disable-next-line camelcase
    await Promise.all(
      user_resp.map(async (answerOptions) => {
        const answ = await Answer.find(answerOptions.selectedOption).select(
          "answerOption includeExplanation"
        );

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < answerOpt.length; i++) {
          if (answ[0].answerOption === answerOpt[i]) {
            if (answ[0].includeExplanation === true) {
              // eslint-disable-next-line no-plusplus
              answerComment++;
            }
            if (answerOpt[i].toLowerCase() === "yes") {
              // eslint-disable-next-line no-plusplus
              count1++;
            }
            if (answerOpt[i].toLowerCase() === "no") {
              // eslint-disable-next-line no-plusplus
              count2++;
            }
            if (answerOpt[i].toLowerCase() === "we don't have a policy") {
              // eslint-disable-next-line no-plusplus
              count3++;
            }
            if (answerOpt[i].toLowerCase() === "don't know") {
              // eslint-disable-next-line no-plusplus
              count4++;
            }
          }
        }
      })
    );

    const dataReturn = {
      title,
      country,
      status,
      startDate: createdAt,
      Username: user.email,
      Organization: user.organization,
      noOfQuestions: totalNumberOfQuestions,
      attemptQuestions: totalNumberOfQusetionAttempted,
      answerYes: count1,
      answerNo: count2,
      answerWeDontHavePolicy: count3,
      answerDontKnow: count4,
      answersComments: answerComment,
      completionLevel,
    };
    res.status(200).json({
      success: true,
      message: "record retrieved",
      data: dataReturn,
    });
  },
};

module.exports = benchmarkingController;
