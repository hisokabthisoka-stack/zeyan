require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ======================
// ROOT
// ======================
app.get("/", (req, res) => {
  res.json({
    status: true,
    author: "ZeyanBot",
    message: "Zeyan API is running 🚀"
  });
});


// ======================
// ROUTES
// ======================
app.use("/api/pinterest", require("./routes/pinterest"));
app.use("/api/images", require("./routes/images"));
app.use("/api/play", require("./routes/play"));
app.use("/api/kbbi", require("./routes/kbbi"));

console.log("✅ Semua route berhasil didaftarkan");


// ======================
// ERROR 404
// ======================
app.use((req, res) => {
  console.log("❌ Route tidak ditemukan:", req.method, req.url);

  res.status(404).json({
    status: false,
    message: "Endpoint tidak ditemukan",
    path: req.url
  });
});


// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
