const express = require("express");

const router = express.Router();
const benchmarkingController = require("../Controller/benchmarkingController");

router.get("/", benchmarkingController.getAllBenchmarking);
router.get("/:id", benchmarkingController.getBenchmarkingById);
router.post("/", benchmarkingController.createBenchmarking);
router.put("/:id", benchmarkingController.updateBenchmarkingById);
router.delete("/:id", benchmarkingController.deleteBenchmarkingById);
router.get("/title/:title", benchmarkingController.getBenchmarkingByTitle);
router.patch(
  "/user_resp_submit/:id",
  benchmarkingController.submitUserResponse
);
router.patch("/user_resp_save/:id", benchmarkingController.saveUserResponse);


router.get("/summary/:id", benchmarkingController.getBenchmarkingSummary);
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
  "/percentage/percentageOfBenchmarks",
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
  "/compare/id1/:id1/id2/:id2",
  benchmarkingController.compareTwoBenchmarking
);
router.get(
  "/compare/id1/:id1/id2/:id2/id3/:id3",
  benchmarkingController.compareThreeBenchmarking
);
router.get(
  "/compare/id1/:id1/id2/:id2/id3/:id3/id4/:id4",
  benchmarkingController.compareFourBenchmarking
);
module.exports = router;
