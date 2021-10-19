const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.use(express.static('public'))
var cons = require('consolidate');
app.use(express.urlencoded())
const database = require('./database')
const Comment = require('./models/comment')
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views')) // Set the views directory
app.set('view engine','html') 
app.use(express.json())

// Routes 
app.get("/", (req, res)=>{ 
    const params = {}
    res.status(200).render('home.html',params);
});
app.get('/home', (req, res)=>{ 
    const params = {}
    res.status(200).render('home.html',params);
});
app.get('/feedback', (req, res)=>{ 
    const params = {}
    res.status(200).render('feedback.html',params);
});
app.get('/feedb', (req, res)=>{ 
    const params = {}
    res.status(200).render('feedb.html',params);
});
app.post('/api/comments', (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        Course: req.body.Course,
        PhoneNo: req.body.PhoneNo,
        comment: req.body.comment,
    })
    comment.save().then(response => {
        res.send(response)
    })

})

app.get('/api/viewfd', (req, res) => {
    Comment.find().then(function(comments) {
        res.send(comments)
    })
})


const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

let io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)
    // Recieve event
    socket.on('comment', (data) => {
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data) 
    })
})