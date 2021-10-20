// include library
const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL;


// Establish Database Connection
mongoose.connect( 
  'mongodb+srv://adityaatul:1234567Ak@@cluster0.wmvga.mongodb.net/feedback_form?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  },
  (error, link) => {
    // check database connect error
     //assert.strictEqual(error, null, "DB Connect Fail...");
  console.log(error);
    // database connect success
    //console.log(link);
    console.log("Database connection established...");
  }
);
