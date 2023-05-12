const { default: axios } = require("axios");
const Benchmarking = require("../Models/bench");
const Questionnaire = require("../Models/questionnaire");
const { redisClient } = require("../middleware/redisClient");
const devenv = require("../configs/dev");

const benchmarkingController = {
  getAllBenchmarking: async (req, res, next) => {
    const cache = await redisClient.get("BENCHMARKINGS");
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
        redisClient.set("BENCHMARKINGS", JSON.stringify(benchmarkings));
        res.status(200).json({
          success: true,
          message: "benchmarkings found",
          data: benchmarkings,
        });
      }
      if (benchmarkings.length < cacheLength) {
        res.status(200).json({
          success: true,
          message: "benchmarkings found",
          data: JSON.parse(cache),
        });
      }
      if (benchmarkings.length === cacheLength) {
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
      const benchmarking = await Benchmarking.findById(id).populate(
        "questionnaire"
      );
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
        console.log(benchTitle);
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
      console.log("error:", error);
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
      console.log(req.param.title);
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
      console.error(error);
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
          message: "Benchmarking not found by country",
          success: false,
        });
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      console.error(error);
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
};

module.exports = benchmarkingController;
