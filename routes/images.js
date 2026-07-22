const express = require("express");
const { image } = require("googlethis");

const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({
      status: false,
      message: "Masukkan query."
    });
  }

  try {
    const result = await image(q, {
      safe: false
    });

    res.json({
      status: true,
      author: "ZeyanBot",
      query: q,
      result: result
        .map(v => ({
          image: (v.url || "").trim()
        }))
        .filter(v => v.image.startsWith("http"))
        .slice(0, 10)
    });

  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message
    });
  }
});

module.exports = router;
