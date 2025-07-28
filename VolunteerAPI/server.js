require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const badgeRoutes = require("./routes/badgeRoutes");

const morgan = require("morgan")
const cors = require("cors");
const { organization } = require("./db/db");

const corsOptions = {
    origin: `${FRONTEND_URL}`,
};
app.use(cors(corsOptions));
app.use(morgan("dev"))

app.use(express.json());
app.use("/users", userRoutes);
app.use("/opportunities", opportunityRoutes);
app.use("/organizations", organizationRoutes);
app.use("/badges", badgeRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
