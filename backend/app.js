require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const statusRoutes = require("./routes/status");
const purposeOfOrderRoutes = require("./routes/purposeOfOrder");
const targetRoutes = require("./routes/target");
const josRoutes = require("./routes/jos").default;
const authRoutes = require("./routes/auth")
const calendarEventRoutes = require("./routes/calendarEvent");
const configAppRoutes = require("./routes/configApp.js").default;
const carRoutes=require("./routes/car.js")
// const eventTypeRoutes = require("./routes/eventType");
// const purposeRoutes = require("./routes/purpose");
// const billTypeRoutes = require("./routes/billType");
// const employeeRoutes = require("./routes/employee");
// const customerTypeRoutes = require("./routes/customerType");
// const customerRoutes = require("./routes/customer");
// const vatRoutes = require("./routes/vat");
// const invoiceRoutes = require("./routes/invoice");
// const logBookRoutes = require("./routes/logBook");
// const carRoutes = require("./routes/car");

//const Purpose =require("./models/Purpose");

// const Group =require("./models/Group");
console.log(process.env.MONGO_URI)
const app = express();
const PORT = process.env.PORT || 3004;
const accessURl='http://localhost:4200'

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.',);
    // Start the server only after a successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// mongoose
//   .connect(
//     // process.env.MONGO_URI,
//      "mongodb://localhost:27017/transport2",
//     {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       useFindAndModify: false
//     }
//   )
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(() => {
//     console.log("Connection failed!");
//   });


   //app.use(bodyParser.urlencoded({ extended: false }));
  //  app.use(bodyParser.text({type:"*/*"}))
   app.use(bodyParser.text());
   app.use(bodyParser.json());
  // app.use(bodyParser.raw());
  // app.use(bodyParser.json({ type: 'application/json' }))
  app.use(bodyParser.urlencoded({ extended: false }));//accept strings, arrays   and any other type as values
  // app.disable('x-powered-by');



  app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${accessURl}`);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE, OPTIONS"
  );

   if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/api4/status", statusRoutes);
app.use("/api4/target", targetRoutes);
app.use("/api4/purposeOfOrder", purposeOfOrderRoutes);
app.use("/api4/jos", josRoutes);
app.use("/api4/auth", authRoutes);
app.use("/api4/calendarEvent", calendarEventRoutes);
app.use("/api4/configApp", configAppRoutes);
app.use("/api4/car", carRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});


// app.use("/paliwo", petrolRoutes);
// app.use("/rodzaj_pojazdu", groupRoutes);
// app.use("/rodzaj_zdarzenia", eventTypeRoutes);
// app.use("/cel_wyjazdu", purposeRoutes);
// app.use("/rodzaj_rachunku", billTypeRoutes);
// app.use("/pracownik", employeeRoutes);
// app.use("/kontrahent", customerRoutes);
// app.use("/typ_kontrahenta", customerTypeRoutes);
// app.use("/vat", vatRoutes);
// app.use("/faktura", invoiceRoutes);
// app.use("/karta_drogowa", logBookRoutes);
// app.use("/pojazd", carRoutes);

module.exports = app;
