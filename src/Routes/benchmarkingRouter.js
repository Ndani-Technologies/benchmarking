const express = require("express");

const router = express.Router();
const benchmarkingController = require("../Controller/benchmarkingController");

router.get("/", benchmarkingController.getAllBenchmarking);
router.get(
  "/getBenchmarksById/:id",
  benchmarkingController.getAllBenchmarkingByUser
);
router.get("/:id", benchmarkingController.getBenchmarkingById);
router.post("/", benchmarkingController.createBenchmarking);
router.put("/:id", benchmarkingController.updateBenchmarkingById);
router.delete("/:id", benchmarkingController.deleteBenchmarkingById);
router.get("/title/:title", benchmarkingController.getBenchmarkingByTitle);
router.delete("/delete/deleteall", benchmarkingController.deleteAllBenchmarks);
router.patch(
  "/user_resp_submit/:id",
  benchmarkingController.submitUserResponse
);
router.patch("/user_resp_save/:id", benchmarkingController.saveUserResponse);

router.get("/summaryByUser/:id", benchmarkingController.getBenchmarkingSummary);

router.get(
  "/summaryByAdmin/:id",
  benchmarkingController.getBenchmarkingAdminSummary
);

router.get(
  "/summaryByUsers/:id",
  benchmarkingController.getBenchmarkingSummaryByUser
);
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
  "/percentage/percentageOfBenchmarks/:id",
  benchmarkingController.getPercentage
);
router.get(
  "/categories/:userId/:benchId",
  benchmarkingController.getCategories
);
router.get(
  "/startrange/:startrange/endrange/:endrange",
  benchmarkingController.getBenchmarkingByCompletionLevel
);

router.get(
  "/compare/benchmarkcomparison",
  benchmarkingController.compareBenchmarkings
);
module.exports = router;
