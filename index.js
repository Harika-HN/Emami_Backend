
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

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

function authenticateUser(req, res, next) {
  const token = req.headers.authorization || req.query.token || req.body.token;

      
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, 'your-secret-key');
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

app.get('/dashboard',authenticateUser, (req, res) => {
   
  res.json({ message: 'You have access to the protected route.', user: req.user });
    
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
