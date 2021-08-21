var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');


//Firebase Real Time
var firebase = require("firebase-admin");
var serviceAccount = require("./firebase_key.json");
const { auth } = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
	databaseURL: "https://book-shop-eaf74-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var db = firebase.database();

var port = process.env.PORT || 3002;
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/books',  function (req, res)  {  

	res.setHeader('Content-Type', 'application/json');

	var booksReference = db.ref("books");

	//Attach an asynchronous callback to read the data
	booksReference.on("value", 
				function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
				function (errorObject) {
					res.send("The read failed: " + errorObject.code);
				});
  
});

//circle (post)
app.post('/circle',  function (req, res){
	res.setHeader('Content-Type', 'application/json');

	var radius = req.body.radius1;

res.send('{ "result ": ' + (3.14*radius*radius) +'}');

});


//rectandgle (post)
app.post('/rectandgle',  function (req, res){
	res.setHeader('Content-Type', 'application/json');

	var round1 = req.body.round1;
	var round2 = req.body.round2;

	res.send('{ "result ": ' + (round1*round2) +'}');

});




app.post('/book',  function (req, res)  {

	var author = req.body.author;
	var bookid = Number(req.body.bookid);
	var category = req.body.category;
	var isbn = req.body.isbn;
	var pageCount = Number(req.body.pageCount);
	var price = Number(req.body.price);
	var publishedDate = req.body.publishedDate;
	var shortDescription = req.body.shortDescription;
	var thumbnailUrl = req.body.thumbnailUrl;
	var title = req.body.title;

	//console.log(author);
	//console.log(title);
	
	var referencePath ='/books/' + bookid + '/';

	var booksReference = db.ref(referencePath);

	if (booksReference != null){

		booksReference.update( {author:author,bookid:bookid,category:category,
			isbn:isbn,pageCount:pageCount,price:price,publishedDate:publishedDate,
			shortDescription:shortDescription,thumbnailUrl:thumbnailUrl,title:title} , 
			function(error){
				if (error){
					res.send("Data could not be saved." + error)
				}
				else {
					res.send("Success!!");
				}
			}
		);

	}
	 

	
});


app.post('/student', function (req, res) {
	var students = Number(req.body.students);
	var studentid = req.body.studentid;
	var studentName = req.body.studentName;

	var referencePath = '/students/' + students + '/';
	var studentsReference = db.ref(referencePath);


	if (studentsReference != null) {

		studentsReference.update({ studentid:studentid, studentName:studentName },
			function (error) {
				if (error) {
					res.send("Data could not be saved." + error)
				}
				else {
					res.send("Success!!");
				}

			}

		);
	}

});










//student
app.get('/student/:studentid',  function (req, res)  {  
  	
	//Code Here
	res.setHeader('Content-Type', 'application/json');
	var studentid = req.params.studentid;
	
	var booksReference = db.ref("students");

	//Attach an asynchronous callback to read the data
	booksReference.orderByChild("studentid").equalTo(studentid).on("child_added", 
				function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
				function (errorObject) {
					res.send("The read failed: " + errorObject.code);
				});
});



app.post('/plus',  function (req, res)  { 	
	res.setHeader('Content-Type', 'application/json');

	var num01 = req.body.num1;
	var num02 = req.body.num2;

	res.send('{"result": ' + (num01+num02)+'}');

});


app.get('/students',  function (req, res)  {  

	res.setHeader('Content-Type', 'application/json');

	var booksReference = db.ref("students");

	//Attach an asynchronous callback to read the data
	booksReference.on("value", 
				function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
				function (errorObject) {
					res.send("The read failed: " + errorObject.code);
				});
  
});

app.get('/topsellers',  function (req, res)  {  

		res.setHeader('Content-Type', 'application/json');

		var booksReference = db.ref("topsellers");
	
		//Attach an asynchronous callback to read the data
		booksReference.on("value", 
					function(snapshot) {					
						res.json(snapshot.val());
						booksReference.off("value");
						}, 
					function (errorObject) {
						res.send("The read failed: " + errorObject.code);
					});
  
});


app.get('/book/:bookid',  function (req, res)  {  
  	
		//Code Here
		res.setHeader('Content-Type', 'application/json');
		var bookid = Number (req.params.bookid);

		var booksReference = db.ref("books");

		//Attach an asynchronous callback to read the data
		booksReference.orderByChild("bookid").equalTo(bookid).on("child_added" , 
				function(snapshot) {					
					res.json(snapshot.val());
					booksReference.off("value");
					}, 
				function (errorObject) {
					res.send("The read failed: " + errorObject.code);
				});
  
});


app.delete('/book/:bookid',  function (req, res)  {  
  	
	//Code Here
	//res.setHeader('Content-Type', 'application/json');
	var bookid = Number(req.params.bookid);
	
	var referencePath ='/books/' + bookid + '/';
	var booksReference = db.ref(referencePath);

	if (booksReference!=null){
		booksReference.remove()
		return res.send("Success!!")
	}
	if (error) throw error;

});


app.delete('/student/:students', function (req, res){
	
	var students = req.params.students;

	var referencePath = '/students/' + students + '/';
	var studentsReference = db.ref(referencePath);
	if (studentsReference != null){
		studentsReference.remove()
		res.send("Succrss!!")
	}
	if (error) throw error;

});


app.get('/lastorderid',  function (req, res)  {  
  	
	res.setHeader('Content-Type', 'application/json');

	var ordersReference = db.ref("lastOrderId");

	ordersReference.on("value", 
				function(snapshot) {					
					res.json(snapshot.val());
					ordersReference.off("value");
					}, 
				function (errorObject) {
					res.send("The read failed: " + errorObject.code);
			});

});


app.put('/lastorderid',  function (req, res)  {  
	
	//Code Here


});




app.post('/order',  function (req, res)  {  

	//Code Here

});


app.listen(port, function () {
    console.log("Server is up and running...");
});


