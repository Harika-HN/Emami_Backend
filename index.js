
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const dashboard = require('./routes/dashboard')

const app = express();
const PORT = 8006;

mongoose.connect('mongodb+srv://WorldVisaTravel_Repo:MB8OVectkcgduxeC@cluster0.u6xinii.mongodb.net/worldvisa?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/', dashboard);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
