const express = require("express");

const router = express.Router();
const benchmarkingController = require("../Controller/benchmarkingController");

router.get("/", benchmarkingController.getAllBenchmarking);
router.get("/:id", benchmarkingController.getBenchmarkingById);
router.post("/", benchmarkingController.createBenchmarking);
router.put("/:id", benchmarkingController.updateBenchmarkingById);
router.delete("/:id", benchmarkingController.deleteBenchmarkingById);
router.get("/title/:title", benchmarkingController.getBenchmarkingByTitle);
router.get(
  "/country/:country",
  benchmarkingController.getBenchmarkingByCountry
);
router.get("/status/:status", benchmarkingController.getBenchmarkingByStatus);
router.get(
  "/startdate/:startdate/enddate/:enddate",
  benchmarkingController.getBenchmarkingBetweenDate
);
router.get(
  "/startrange/:startrange/endrange/:endrange",
  benchmarkingController.getBenchmarkingByCompletionLevel
);

module.exports = router;
