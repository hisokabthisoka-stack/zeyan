console.log("✅ play.js berhasil dimuat");

const express = require("express");
const yts = require("yt-search");

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("🔥 Request masuk ke /api/play");

  const q = req.query.q;

  if (!q) {
    return res.status(400).json({
      status: false,
      message: "Masukkan query."
    });
  }

  try {
    const search = await yts(q);

    if (!search.videos.length) {
      return res.json({
        status: false,
        message: "Lagu tidak ditemukan."
      });
    }

    const video = search.videos[0];

    res.json({
      status: true,
      author: "ZeyanBot",
      result: {
        title: video.title,
        channel: video.author.name,
        duration: video.timestamp,
        thumbnail: video.thumbnail,
        url: video.url
      }
    });

  } catch (e) {
    console.log(e);

    res.status(500).json({
      status: false,
      message: e.message
    });
  }
});

module.exports = router;
