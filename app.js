var express = require("express"), 
app = express(), 
bodyParser = require("body-parser"), 
mongoose = require("mongoose"), 
methodOverride = require("method-override"), 
expressSanitizer = require("express-sanitizer"); 

mongoose.connect("mongodb://localhost:27017/article_app", {useNewUrlParser: true}); 
app.set("view engine", "ejs"); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride("_method")); 
app.use(expressSanitizer()); 

var articleSchema = new mongoose.Schema({
	title: String, 
	image: String, 
	body: String
}); 

var Article = mongoose.model("Article", articleSchema); 

//ROOT ROUTE
app.get("/", function(req, res) {
	res.redirect("/articles"); 
}); 

//INDEX ROUTE 
app.get("/articles", function(req, res) {
	Article.find({}, function(err, articles) {
		if (err) {
			console.log("Error!"); 
		} else {
			res.render("index", {articles: articles}); 
		}
	}); 
}); 


//NEW ROUTE 
app.get("/articles/new", function(req, res) {
	res.render("new"); 
}); 	

//CREATE ROUTE 
app.post("/articles", function(req, res) {
	req.body.article.body = req.sanitize(req.body.article.body); 
	Article.create(req.body.article, function(err, article) {
		if (err) {
			res.render("new"); 
		} else {
			res.redirect("/articles"); 
		}
	}); 
}); 

//SHOW ROUTE 
app.get("/articles/:id", function(req, res) {
	Article.findById(req.params.id, function(err, article) {
		if (err) {
			res.redirect("/articles"); 
		} else {
			res.render("show", {article: article}); 
		}
	}); 
}); 

//EDIT ROUTE 
app.get("/articles/:id/edit", function(req, res) {
	Article.findById(req.params.id, function(err, article) {
		if (err) {
			res.redirect("articles"); 
		} else {
			res.render("edit", {article: article}); 
		}
	}); 
}); 

//UPDATE ROUTE 
app.put("/articles/:id", function(req, res) {
	req.body.article.body = req.sanitize(req.body.article.body); 
	Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, article) {
		if (err) {
			res.redirect("/articles"); 
		} else {
			res.redirect("/articles/" + req.params.id); 
		}
	}); 
}); 

//DELETE ROUTE 
app.delete("/articles/:id", function(req, res) {
	Article.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/articles"); 
		} else {
			res.redirect("/articles"); 
		}
	}); 
}); 



//SERVER LISTENING
app.listen(3000, function() {
	console.log("Article App server is listening..."); 
}); 