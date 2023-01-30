const express = require("express");
const app = express();
const cors = require("cors");

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

//routes
app.use("/api/ministry", require("./routes/api/ministry")); // (http://localhost:5000/api/ministry)
app.use("/api/department", require("./routes/api/department")); // (http://localhost:5000/api/department)
app.use("/api/unit", require("./routes/api/unit")); // (http://localhost:5000/api/unit)
app.use("/api/budget", require("./routes/api/budget")); // (http://localhost:5000/api/budget)
app.use("/api/user", require("./routes/api/user")); // (http://localhost:5000/api/user)
app.use("/api/term", require("./routes/api/term")); // (http://localhost:5000/api/term)
app.use("/api/budget_request", require("./routes/api/budget_request")); // (http://localhost:5000/api/budget)
app.use("/api/expenditure", require("./routes/api/expenditure")); // (http://localhost:5000/api/expenditure)
app.use("/api/report", require("./routes/api/report")); // (http://localhost:5000/api/expenditure)

//PORT
const PORT = process.env.PORT || process.env.LocalPort;

const server = app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server started at Port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
