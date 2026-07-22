const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const kbbi = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../database/kbbi.json"),
    "utf8"
  )
);

router.get("/", (req, res) => {
  const q = (req.query.q || "")
    .trim()
    .toLowerCase();

  if (!q) {
    return res.status(400).json({
      status: false,
      message: "Masukkan kata."
    });
  }

  const ada = kbbi.includes(q);

  res.json({
    status: ada,
    result: {
      kata: q
    }
  });
});

module.exports = router;
