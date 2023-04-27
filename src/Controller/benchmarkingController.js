
const Benchmarking = require('../Models/Benchmarking');

const benchmarkingController = {

    async getAllBenchmarkings(req, res, next) {
        try {
            const benchmarkings = await Benchmarking.find();
            res.json({ success: true, message: 'Successfully retrieved benchmarkings', data: benchmarkings });
        } catch (err) {
           next(err) 
        }
    },

    async getBenchmarking(req, res, next) {
        try {
            const benchmarking = await Benchmarking.findById(req.params.id);
            if (benchmarking == null) {
                return res.status(404).json({ success: false, message: 'Cannot retrieved benchmarking' });
            }
            res.json({ success: true, message: 'Successfully retrieved benchmarking', data: benchmarking });
        } catch (err) {
           next(err)
        }
    },

    async createBenchmarking(req, res, next) {
        const benchmarking = new Benchmarking(req.body);
        try {
            const newBenchmarking = await benchmarking.save();
            res.status(201).json({ success: true, message: 'Successfully created benchmarking', data: newBenchmarking });
        } catch (err) {
            next(err)
        }
    },

    async updateBenchmarking(req, res, next) {
        try {
            const benchmarking = await Benchmarking.findById(req.params.id);
            if (benchmarking == null) {
                return res.status(404).json({ success: false, message: 'Cannot find benchmarking' });
            }
            if (req.body.title != null) {
                benchmarking.title = req.body.title;
            }
            if (req.body.description != null) {
                benchmarking.description = req.body.description;
            }
            if (req.body.category != null) {
                benchmarking.category = req.body.category;
            }
            if (req.body.languageSelector != null) {
                benchmarking.languageSelector = req.body.languageSelector;
            }
            if (req.body.status != null) {
                benchmarking.status = req.body.status;
            }
            if (req.body.visibility != null) {
                benchmarking.visibility = req.body.visibility;
            }
            if (req.body.answerOptions != null) {
                benchmarking.answerOptions = req.body.answerOptions;
            }
            const updatedBenchmarking = await benchmarking.save();
            res.json({ success: true, message: 'Successfully updated benchmarking', data: updatedBenchmarking });
        } catch (err) {
            next(err)
        }
    },

    async deleteBenchmarking(req, res, next) {
        try {
            const benchmarking = await Benchmarking.findById(req.params.id);
            if (benchmarking == null) {
                return res.status(404).json({ success: false, message: 'Csannot find benchmarking' });
            }
            await benchmarking.remove();
            res.json({ success: true, message: 'Successfully deleted benchmarking' });
        } catch (err) {
            next(err)
        }
    }
}
module.exports = benchmarkingController;

