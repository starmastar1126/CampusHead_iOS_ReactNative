import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/app';




// import firebase from 'firebase';
import '@firebase/messaging';
  // Initialize Firebase
        const firebaseConfig = {
        apiKey: "AIzaSyBzMqWQRu_il1M7dNzzJ_66-ml5zYeuHmI",
        authDomain: "campushead-app.firebaseapp.com",
        databaseURL: "https://campushead-app.firebaseio.com",
        projectId: "campushead-app",
        storageBucket: "campushead-app.appspot.com",
        messagingSenderId: "410955858616",
        appId: "1:410955858616:web:eb71f562a7c1b8e5fdea4d"
      };
      // Initialize Firebase
     let app =  firebase.initializeApp(firebaseConfig);

export const FireBaseApp = app