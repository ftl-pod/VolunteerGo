require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const morgan = require("morgan")
const cors = require("cors");

const corsOptions = {
    origin: `${FRONTEND_URL}`,
};
app.use(cors(corsOptions));
app.use(morgan("dev"))

app.use(express.json());

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
