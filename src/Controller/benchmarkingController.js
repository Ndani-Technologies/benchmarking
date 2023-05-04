const Benchmarking = require("../Models/bench");
const Questionnaire = require("../Models/questionnaire");

const benchmarkingController = {
  getAllBenchmarking: async (req, res, next) => {
    try {
      const benchmarkings = await Benchmarking.find().populate("questionnaire");
      res
        .status(200)
        .json({
          message: "Categories retrieved",
          success: true,
          data: benchmarkings,
        });
    } catch (error) {
      console.error(error);
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
        res
          .status(200)
          .json({
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
      console.error(error);
      next(error);
    }
  },

  createBenchmarking: async (req, res, next) => {
    const { title, country } = req.body;
    const questionnaire = await Questionnaire.find({});
    try {
      const benchmarking = await Benchmarking.create({
        title,
        country,
        questionnaire,
      });
      res
        .status(201)
        .json({
          message: "Benchmarking created",
          success: true,
          data: benchmarking,
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateBenchmarkingById: async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const benchmarking = await Benchmarking.findByIdAndUpdate(
        id,
        { title },
        { new: true }
      );
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
      console.error(error);
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
      console.error(error);
      next(error);
    }
  },
};

module.exports = benchmarkingController;
