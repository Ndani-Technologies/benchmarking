const express = require("express");

const router = express.Router();
const benchmarkingController = require("../Controller/benchmarkingController");

router.get("/", benchmarkingController.getAllBenchmarking);
router.get("/:id", benchmarkingController.getBenchmarkingById);
router.post("/", benchmarkingController.createBenchmarking);
router.put("/:id", benchmarkingController.updateBenchmarkingById);
router.delete("/:id", benchmarkingController.deleteBenchmarkingById);

module.exports = router;
