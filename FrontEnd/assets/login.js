"use strict";

// !----------------------------- Constantes

// Sélection des éléments du DOM nécessaires pour le formulaire de connexion
const submit = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formLogin = document.getElementById("formLogin");



// !----------------------------- Functions
/**
  * Enregistre le token fourni dans le stockage local de l'utilisateur.
 *
 * @param {string} token - Le token à enregistrer.
 */
function saveToken(token) {
    sessionStorage.setItem("userToken", token);
}

/**
 // Envoie une requête POST au serveur avec les informations de connexion
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function sendId() {
     // Envoie une requête POST au serveur avec les informations de connexion
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then((res) => {
         // Si la réponse est positive (status 200), on retourne les données en JSON
        if (res.ok) {
            return res.json();
        } else {
             // Si la réponse n'est pas positive, on lance une erreur
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
    })
    .then((data) => {
         // Récupère le token de la réponse du serveur et le sauvegarde
        const userToken = data.token;
        saveToken(userToken);
        // Redirige l'utilisateur vers la page principale après connexion réussie
        document.location.href = "index.html";
    })
    .catch((error) => {
         // Affiche un message d'erreur si une erreur se produit lors de la connexion
        document.querySelector(".errorLogin").innerHTML = error.message;
    });
}


// !----------------------------- Événement
// Ajoute un écouteur d'événement sur la soumission du formulaire
formLogin.addEventListener("submit", (event) => {
    // Empêche le comportement par défaut de soumission du formulaire
   event.preventDefault();
     // Exécute la fonction d'envoi des informations de connexion
   sendId();
});





