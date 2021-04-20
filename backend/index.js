const express = require("express");

const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//import routes
const authRouter = require("./routes/auth");

mongoose
	.connect(process.env.DATABASE, {
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("connected to the database successfully."))
	.catch((err) => console.log("Error connecting to the database ", err));

// middleware
app.use(morgan("dev"));
// app.use(cors()); // allows all origins
if (process.env.NODE_ENV == "development") {
	// app.use(cors({ origin: `http://localhost:3000` }));
	app.use(cors());
}
app.use(express.json());

app.use("/api", authRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
