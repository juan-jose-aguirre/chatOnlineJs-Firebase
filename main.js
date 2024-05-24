import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { app } from "./firebase.js";
const db = getFirestore(app);
const auth = getAuth();
let answerFirebase;

let email = "";
let inputEmail = document.querySelector("input[type=email]");
inputEmail.addEventListener("input", (e) => {
  email = e.target.value;
});
let password = "";
let inputPassword = document.querySelector("input[type=password]");
inputPassword.addEventListener("input", (e) => {
  password = e.target.value;
});

let divAlert = document.getElementById("errorLogin");
let mensajes = document.getElementById("mensajes");

let formLogin = document.querySelector("#formLogin");
function Login(email, password) {
    if (email === "" || password === "") {
      console.log("faltan");
      divAlert.className = "alert alert-danger";
      inputEmail.value = "";
      inputPassword.value = "";
    } else {
      console.log("envio de datos");
      formLogin.classList.add("d-none");
      let spinner = document.getElementById("spinner");
      spinner.classList.remove("d-none");
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          answerFirebase = JSON.stringify(userCredential);
          answerFirebase = JSON.parse(answerFirebase);
          spinner.classList.add("d-none");
        })
        .catch((error) => {
          let divAlert = document.getElementById("errorLogin");
          formLogin.classList.remove("d-none");
          spinner.classList.add("d-none");
          divAlert.className = "alert alert-danger";
          inputEmail.value = "";
          inputPassword.value = "";
        });
    }
  }
let formChat = document.querySelector("#formChat");
formChat.addEventListener("submit", (e) => {
  divAlert.classList.add("d-none");

  e.preventDefault();
  let message = e.target[0].value.trim();
  let uid = answerFirebase.user.uid;
  if (!message) {
      divAlert.classList.remove("d-none");
      console.log("no tiene nada");
    } else {
      mensajes.innerHTML = "";
    divAlert.classList.add("d-none");
    console.log("si tiene algo");
    SaveMessage(message, uid);
    e.target[0].value = "";
  }
});

async function SaveMessage(text, uid) {
  try {
    let message = await addDoc(collection(db, "chat"), {
      text: text,
      uid: uid,
      date: Date.now(),
    });
    console.log("Se guardo Bien" + message.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

let btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  Login(email, password);
});

let btnCloseSession = document.getElementById("btnCloseSession");
btnCloseSession.addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      formLogin.classList.remove("d-none");
      btnCloseSession.classList.add("d-none");
      divAlert.classList.add("d-none");
      formChat.classList.add("d-none");
      mensajes.classList.add("d-none");
      inputEmail.value = "";
      inputPassword.value = "";
    })
    .catch((error) => {
      console.log("Fallo en la salida");
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Si hay user",user.uid);
    divAlert.classList.add("d-none");
    formLogin.classList.add("d-none");
    btnCloseSession.classList.remove("d-none");
    formChat.classList.remove("d-none");
    mensajes.classList.remove("d-none");
    contenidoChat(user);
  } else {
    console.log("No hay user");
  }
});

function contenidoChat(user) {
  mensajes.innerHTML = "";
  const q = query(collection(db, "chat"),orderBy("date"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === user.uid) {
        mensajes.innerHTML += `
            <div class="d-flex justify-content-end p-1">
          <span class="badge text-bg-dark">${doc.data().text}</span>
        </div>
            `;
      }else{
        mensajes.innerHTML += `
            <div class="d-flex justify-content-start p-1">
          <span class="badge text-bg-light">${doc.data().text}</span>
        </div>
            `;
      }
      mensajes.scrollTop = mensajes.scrollHeight;
    });
  });
}



// let botones = document.getElementById("botonesLogin");
