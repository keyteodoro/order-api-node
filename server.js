const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/order", orderRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});