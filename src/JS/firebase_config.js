// JS SECTION: Firebase project configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlsLs7ZJJGVYrHMVVupCfzIwzf6Chw5Hc",
  authDomain: "animehay-c7e19.firebaseapp.com",
  projectId: "animehay-c7e19",
  storageBucket: "animehay-c7e19.firebasestorage.app",
  messagingSenderId: "683570394738",
  appId: "1:683570394738:web:146429ac9bc0f1e39434eb",
  measurementId: "G-0RVVF8E6KL"
};


// JS SECTION: Firebase app initialization
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase.app().name);
// Đăng Ký đăng nhập
// JS SECTION: Shared Firebase services
const auth = firebase.auth()
//  Database
const db = firebase.firestore();

console.log(firebase.app().name);
