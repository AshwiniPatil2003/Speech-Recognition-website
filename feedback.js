
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDNSMfzsqTrIWICsDSu5HccLmJKUixM7yI",
authDomain: "feedback-8eeeb.firebaseapp.com",
projectId: "feedback-8eeeb",
storageBucket: "feedback-8eeeb.appspot.com",
messagingSenderId: "572836417621",
appId: "1:572836417621:web:661bd7ba9663cc328a84dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//get ref to database 
const db = getDatabase(app);

document.getElementById("submit").addEventListener('click', function(e){

    set(ref(db, 'user/' +document.getElementById("name").value),
{
    username: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("feedback").value
});
alert("Your feedback is submitted successfully!");
})