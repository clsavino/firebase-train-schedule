  var config = {
    apiKey: "AIzaSyDZYucKR1JVo97BNTdWxg6tM1R7NfGUQyE",
    authDomain: "train-schedule-e411e.firebaseapp.com",
    databaseURL: "https://train-schedule-e411e.firebaseio.com",
    storageBucket: "train-schedule-e411e.appspot.com",
  };
  firebase.initializeApp(config);

var database = firebase.database();


//  Button for adding a Train
$("#addTrainBtn").on("click", function(event){
	event.preventDefault();
	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var trainDestination = $("#destinationInput").val().trim();
	var firstTrainTime = moment($("#timeInput").val().trim(), "HH:mm").format("X");
	var trainFrequency = $("#frequencyInput").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		destination: trainDestination,
		time: firstTrainTime,
		frequency: trainFrequency
	}

	// Uploads employee data to the database
	database.ref().push(newTrain);

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#timeInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	//return false;
});


// Create Firebase event for adding a train to the database and a row in the html table when a user adds an entry
database.ref().on("child_added", function(childSnapshot){

	//console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().time;
	var trainFrequency= childSnapshot.val().frequency;

	// format the train time, subtract 1 year to make sure it comes before current time
	var firstTimeConverted = moment.unix(firstTrainTime, 'hh:mm').subtract(1,'years');

	//current time
	var currentTime = moment();

	// difference between current time and converted time
	var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');

	//calculate time apart ( the frequency - remainder)
	//mins till train
	var remainder = diffTime % trainFrequency;

	var minsAway = trainFrequency - remainder;

	var nextArrival = moment().add(minsAway, 'minutes').format("HH:mm");
	
	// Add each train's data into the table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");

});



