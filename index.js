const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
// console.log(process.env.MY_VERIFY_FB_TOKEN);
console.log(process.env['PORT']);
console.log(process.env['MY_VERIFY_TOKEN']) 
console.log(process.env['PAGE_ACCESS_TOKEN'])
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

let port = process.env.PORT || 8080;

app.listen(port, ()=>{
   console.log(`App is running at the port ${port}`) ;
});


module.exports = app;
