// Initialize Firebase
var config = {
    apiKey: "AIzaSyA1gANdsl4y8WJtJntMaxDwxWSWA0493OI",
    authDomain: "space-shuttle-schedule-app.firebaseapp.com",
    databaseURL: "https://space-shuttle-schedule-app.firebaseio.com",
    projectId: "space-shuttle-schedule-app",
    storageBucket: "space-shuttle-schedule-app.appspot.com",
    messagingSenderId: "912575739836"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

var vesselName = "";
var destination = "";
var commDate = "";
var frequency = 0;

$("#addVessel").on("click", function (event) {
    event.preventDefault();

    vesselName = $("#vesselName-input").val().trim();
    destination = $("#destination-input").val().trim();
    commDate = moment($("#commDate-input").val().trim(), "MM/DD/YYYY").format("X");
    frequency = $("#frequency-input").val().trim();
    // console.log(vesselName, destination, commDate, RTCTrackEvent);

    dataRef.ref().push({
        vesselName: vesselName,
        destination: destination,
        commDate: commDate,
        frequency: frequency,
    });

    

    var firstTime = "12:00";

    // var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // var currentTime = moment();
    // console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("Time to Next Arrival: " + diffTime);

    // var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    // var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));
});


dataRef.ref().on("value", function (snapshot) {

    var sv = snapshot.val();
    // console.log(sv);

    $("#vesselName-input").val("");
    $("#destination-input").val("");
    $("#commDate-input").val("");
    $("#frequency-input").val("");
});

dataRef.ref().on("child_added", function (childSnapshot) {
   // console.log(childSnapshot.val());

    var vesselNameEntry = childSnapshot.val().vesselName;
    var vesselDestination = childSnapshot.val().destination;
    var vesselcommDate = childSnapshot.val().commDate;
    var vesselFrequency = childSnapshot.val().frequency;



    // console.log(vesselNameEntry);
    // console.log(vesselDestination);
    // console.log(vesselcommDate);
    // console.log(vesselFrequency);

    var commDatePretty = moment.unix(vesselcommDate).format("MM/DD/YYYY");
    var vesselCommission = moment().diff(moment(vesselcommDate, "X"), "months");
    // console.log(vesselCommission);


    var tblRow = $("<tr>").append(
        $("<td>").text(vesselNameEntry),
        $("<td>").text(vesselDestination),
        $("<td>").text(commDatePretty),
        $("<td>").text("Every " + vesselFrequency + " months"),
    );
    $("#vesselInfo > tbody").append(tblRow);
}, 

function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

    dataRef.ref().orderByChild("database").limitToLast(1).on("click_added", function (snapshot) {
        $("#vesselName-input").text(snapshot.val().name);
        $("#destination-input").text(snapshot.val().name);
        $("#commDate-input").text(snapshot.val().name);
        $("#frequency-input").text(snapshot.val().name);
    })
});