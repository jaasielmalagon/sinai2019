import Firebase from "firebase";
var conf = {
    apiKey: "AIzaSyCuyEPDRJ1wZgHKM-vNSDa9etD0O8BAYGU",
    authDomain: "sinai-28c9b.firebaseapp.com",
    databaseURL: "https://sinai-28c9b.firebaseio.com/",
    projectId: "sinai-28c9b",
    storageBucket: "sinai-28c9b.appspot.com",
    messagingSenderId: "892358533325",
    appId: "1:892358533325:web:4e769667d934852e"
}
Firebase.initializeApp(conf);
let db = Firebase.database();
let auth = Firebase.auth();
let googleAuth = new Firebase.auth.GoogleAuthProvider();
export default {
    db: db,
    auth: auth,
    googleAuth
}