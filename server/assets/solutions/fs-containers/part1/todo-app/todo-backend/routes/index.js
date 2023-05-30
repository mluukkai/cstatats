const express = require("express");
const router = express.Router();

const configs = require("../util/config");
const redis = require("../redis");

let visits = 0;

/* GET index data. */
router.get("/", async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits,
    ingone: "works",
  });
});

router.get("/stats", async (req, res) => {
  const added_todos = Number(await redis.getAsync("ADDED_TODOS")) || 0;
  res.send({ added_todos });
});

module.exports = router;
