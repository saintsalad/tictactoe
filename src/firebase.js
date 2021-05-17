import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB0caStIJg83z1JTrMnOkBl8YDXNDv1Nvw",
    authDomain: "tictactoe-c5e33.firebaseapp.com",
    databaseURL: "https://tictactoe-c5e33-default-rtdb.firebaseio.com",
    projectId: "tictactoe-c5e33",
    storageBucket: "tictactoe-c5e33.appspot.com",
    messagingSenderId: "525117078945",
    appId: "1:525117078945:web:bacdac236a40b9ad755fe0",
    measurementId: "G-2MZ7KFKRKW"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;