"use strcdct";

// !----------------------------- Constantes
const submit = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");

// !----------------------------- Functions
/**
 * Saves the provided token to the user's local storage.
 *
 * @param {string} token - The token to be saved.
 */
function saveToken(token) {
    localStorage.setItem("userToken", token);
}

/**
 * Sends the user ID to the server for authentication.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function sendId() {
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
    })
    .then((data) => {
        const userdata = data.token;
        saveToken(userdata);
        document.location.href = "index.html";
    })
    .catch((error) => {
        document.querySelector(".errorLogin").innerHTML = error.message;
    });
}

// !----------------------------- Événement
submit.addEventListener("click", (event) => {
    event.preventDefault();
    sendId();
});