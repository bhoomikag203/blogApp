const bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express();

//app config
mongoose.connect("mongodb://localhost/blogApp", {
    useMongoClient: true,
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "My First Blog",
//     image: "https://source.unsplash.com/qO-PIF84Vxg",
//     body: "Hello, this is my first blog!!"
// })

//routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

//index route
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("ERROR!!");
        } else {
            res.render("index", {
                blogs: blogs
            });
        }
    })
});

//new route
app.get('/blogs/new', (req, res) => {
    res.render("new");
});

//create route
app.post('/blogs', (req, res) => {
    //create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            //redirect to index
            res.redirect('/blogs');
        }
    });
});

//show route
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err);
            res.redirect('/blogs');
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});