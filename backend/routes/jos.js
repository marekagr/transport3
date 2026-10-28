import express from "express";
import { buildMongoFilter } from "../utils/mongo-filter.js";
import Jos from "../models/Jos.js";
const router = express.Router();






router.get("", async(req, res, next) => {
    try {
    const filter = buildMongoFilter(req.query, {
      searchableFields: ["NAZWA"],
      allowedFields: []
    });

    console.log('filter jos',filter)
    const documents = await Jos.find(filter);

    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
});

// module.exports = router;
export default router;