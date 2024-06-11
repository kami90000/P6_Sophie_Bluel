"use strict";

// !------------------------------------- Constantes
const filters = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");
const tokenUser = sessionStorage.getItem("userToken");

// !-------------------------------------- variables globales
let allWorks = [];
let allCategories = [];
let select;
let inputTxt;
let imgInput;
let submitButton;
let modalList;
let previouslyFocusedElement = null;


// !--------------------------------------- fonctions API

/**
 *  Récupère toutes les œuvres depuis l'API.
 *
 * @return {Promise<void>} Retourne une promesse résolue une fois les œuvres récupérées.
 */
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");

  return response.json();
};

/**
 * Récupère les catégories depuis l'API.
 *
 * @return {Promise<void>}  Retourne une promesse résolue une fois les catégories récupérées.
 */
const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  return response.json();
};

// !--------------------------------------- Fonctions Galerie

/**
 * Crée un élément de galerie principal.
 *
 * @param {Object} work -  L'objet représentant une œuvre.
 * @return {HTMLLIElement}  L'élément de la galerie.
 */
const createGalleryItem = (work) => {

  const listItem = document.createElement("li");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figcaption.classList.add("figcaption");

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);


  return figure;
};

/**
  * Crée un élément de galerie pour la modale.
 *
 * @param {Object} work - L'objet représentant une œuvre.
 * @return {HTMLLIElement} L'élément de la galerie pour la modale.
 */
const createModalGalleryItem = (work) => {
  const listItem = document.createElement("li");
  const figure = document.createElement("figure");
  const img = document.createElement("img");

  // Crée une icône de corbeille
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fas", "fa-trash-alt", "delete-icon");

  // Ajoute un événement de clic à l'icône de corbeille pour supprimer le travail
  trashIcon.addEventListener("click", () => {
    deleteWork(work.id); // Appelle la fonction de suppression avec l'ID approprié
  });


  img.src = work.imageUrl;
  img.alt = work.title;


  figure.appendChild(img);
  figure.appendChild(trashIcon);
  listItem.appendChild(figure);

  return listItem;
};


/**
  * Crée une galerie en ajoutant un nouvel élément div avec la classe "gallery" au DOM.
 * Si une galerie existante existe déjà, elle est supprimée avant de créer la nouvelle.
 
 * @param {Array} galleryItems -  Un tableau d'objets représentant les éléments de la galerie.
 */
// Fonction pour créer la galerie des œuvres
const createGallery = async (categorieId = null) => {
 // Récupération de toutes les œuvres depuis l'API
  allWorks = await getWorks();
  console.log(allWorks)
  // Effacement du contenu existant de la galerie
  gallery.innerHTML = "";
  const galleryModal = document.querySelector(".galleryModal");
  galleryModal.innerHTML = ""; 

  // Parcours de toutes les œuvres
  allWorks.forEach((work) => {
     // Vérifie si la catégorie est spécifiée et si l'œuvre appartient à cette catégorie
    if (categorieId == null || categorieId == work.category.id) {
        // Crée un élément de galerie pour chaque œuvre
     
      createGalleryItem(work);// Créer un élément de galerie

      galleryModal.appendChild(createModalGalleryItem(work));// Ajouter à la modale
    }


  });


};


// !---------------------------------------  Fonctions Filtre

/**
  * Crée les filtres et ajoute des écouteurs d'événements de clic.
 *
 * @param {string} categoryId 
 */
// Création des filtres
const createFilters = async () => {
   // Récupère toutes les catégories depuis l'API
allCategories = await getCategories();

  // Ajoutez la logique pour récupérer les catégories et créer les filtres dynamiquement

  // Pour chaque catégorie, crée un élément de filtre
  allCategories.forEach(category => {
    const li = document.createElement("li");
    li.id = category.id; // Assure que l'ID correspond à l'ID de la catégorie
    li.textContent = category.name;
    li.classList.add("filterButton");
    filters.appendChild(li);
  });

 // Sélectionne tous les filtres (éléments <li>) pour ajouter des écouteurs d'événements
  const allFilters = document.querySelectorAll(".filters li")
  allFilters.forEach(filter => {


   // Ajoute un écouteur d'événement de clic à chaque filtre
    filter.addEventListener("click", function () {
      let categorieId = filter.getAttribute("id");

       // Supprime la classe active de tous les filtres et l'ajoute au filtre cliqué
      allFilters.forEach((filter) => filter.classList.remove("filterButtonActive"));
      filter.classList.add("filterButtonActive");

 // Recrée la galerie avec les éléments correspondant à la catégorie sélectionnée
      createGallery(categorieId);

    });
  });

  // Créez dynamiquement les options de catégorie dans le champ select de la modal d'ajout de photo
  const selectModal = document.getElementById("category");
  allCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectModal.appendChild(option);
  });

};



// !--------------------------------------- Fonctions Bannière
/**
 * Ajoute une bannière à la page.
 */
const addBanner = () => {
  const banner = document.createElement("div");
  banner.classList.add("banner");

  const bannerTxt = document.createElement("a");
  bannerTxt.innerText = "Mode édition";
  bannerTxt.classList.add("edit-link"); 

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");
  bannerTxt.appendChild(editIcon);

  banner.appendChild(bannerTxt);
  document.body.insertBefore(banner, document.body.firstChild);
};

// !--------------------------------------- Suppression des Filtres

/**
  * Supprime les filtres de la page.
 */
const removeFilters = () => {

  filters.innerHTML = "";

};



// !--------------------------------------- Suppression de work

const deleteWork = async (Id) => {

  try {
    const response = await fetch(`http://localhost:5678/api/works/${Id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenUser}`,
      },
    });

    if (response.ok) {
      console.log("Le travail a bien été supprimé");
      createGallery();
  
    } else {
      throw new Error("Une erreur est survenue lors de la suppression du travail.");
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la suppression du travail :", error);

  }
};

// !--------------------------------------- Aperçu d'un work

// Affiche un aperçu de l'image sélectionnée.

function displayPreview(file) {
  const previewContainer = document.querySelector(".add-photo");
  const previewImg = document.createElement("figure");
  previewImg.classList.add("img-preview");

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    previewImg.innerHTML = `<img src="${reader.result}" alt="Preview">`;
    previewContainer.innerHTML = "";
    previewContainer.appendChild(previewImg);
  });

  reader.readAsDataURL(file);
}

/**
 * Génère un aperçu de l'œuvre basée sur le fichier sélectionné.
 *
 * @param {Event} event - L'objet événement déclenché par l'action de l'utilisateur.
 */
function workPreview(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  const showAlert = () => {
    alert("Veuillez sélectionner une image au format JPG, JPEG ou PNG, et dont la taille est inférieure à 4 Mo.");
  };

  if (file && validateWorkFile(file)) {
    displayPreview(file);
  } else {
    showAlert();
  }
}

/**
 *  Valide si un fichier donné est un fichier d'œuvre valide.
 *
 * @param {Object} file -  L'objet fichier à valider.
 * @return {boolean} Retourne true si le fichier est valide, sinon retourne false.
 */
const validateWorkFile = (file) => {
  const allowedTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);
  const maxFileSize = 4 * 1024 * 1024;

  return allowedTypes.has(file.type) && file.size <= maxFileSize;
};




// !--------------------------------------- Ajout work

const addWork = (inputTxt, select, imgInput) => { // Crée un nouvel objet FormData pour contenir les données du formulaire
  const formData = new FormData();            
  formData.append("title", inputTxt.value);  // Ajoute le titre du projet à l'objet FormData
  formData.append("category", select.value);   // Ajoute la catégorie du projet à l'objet FormData
  formData.append("image", imgInput.files[0]); // Ajoute le fichier image du projet à l'objet FormData

  const token = localStorage.getItem("userToken");  // Récupère le token utilisateur depuis le stockage local 

  // Envoie une requête POST à l'API pour ajouter le nouveau projet
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  })
    .then(async (res) => {
        // Si la réponse est positive, avertit l'utilisateur et met à jour la galerie
      if (res.ok) {
        alert("Le travail a bien été ajouté");

  // Parse la réponse pour récupérer le nouveau projet ajouté
        const newWorkResponse = await res.json();
        allWorks.push(newWorkResponse);// Ajouter l'œuvre à la liste
        createGallery(allWorks);// Mettre à jour la galerie

      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du travail :", error);
    });
};


// !--------------------------------------- Validate form
function validateForm() {
  if (inputTxt && inputTxt.value !== "" && select.value !== "option" && imgInput.files.length > 0) {
    submitButton.style.background = "#1D6154";
    submitButton.disabled = false;
    submitButton.style.cursor = "pointer";
  } else {
    submitButton.disabled = true;
    submitButton.style.background = "#A7A7A7";
    submitButton.style.cursor = "auto";
  }
}
// !--------------------------------------- Log in
const logout = () => {
  const log = document.getElementById("log");

  const userToken = sessionStorage.getItem("userToken");

  if (userToken) {
    log.innerText = "logout";

    log.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("userToken");
      window.location.href = "index.html";
    });
  }
};


// MODAL

let modal = null
const focusableSelector = "button, a, input, textarea";
let focusables = [];

// fonction pour ouvrir la modale
const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.querySelector(':focus');
  modal.style.display = null;
  focusables[0].focus();
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);


};

// Fonction pour remplir la galerie modale
const createGalleryModal = () => {
  const galleryModal = document.querySelector(".galleryModal");
  galleryModal.innerHTML = "";

  allWorks.forEach((work) => {
    // Créer un élément de galerie pour la modal
    const modalGalleryItem = createModalGalleryItem(work);
    galleryModal.appendChild(modalGalleryItem);
  });
};


// fonction pour fermer la modale
const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

  const modalContent1 = document.querySelector(".modalContent1");
  const modalContent2 = document.querySelector(".modalContent2");
  const arrowLeft = document.querySelector(".arrowLeft");

  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
    modalContent1.style.display = "flex";
    modalContent2.style.display = "none";
    arrowLeft.style.display = "none";
    // Reset formulaire 
    resetForm();
  }, 300);

  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

};

const stopPropagation = function (e) {
  e.stopPropagation();
};

// Gérer le focus des éléments dans la modale
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1
  }
  focusables[index].focus();
  console.log(index);
};

// Fonction pour changer de fenêtre dans la modale
function navigateModal() {
  const buttonModal = document.querySelector(".buttonModal");
  const modalContent1 = document.querySelector(".modalContent1");
  const modalContent2 = document.querySelector(".modalContent2");
  const arrowLeft = document.querySelector(".arrowLeft");

  // Pour aller vers la fenêtre d'ajout de projet
  buttonModal.addEventListener("click", function () {
    modalContent1.style.display = "none";
    modalContent2.style.display = "flex";
    arrowLeft.style.display = "flex";
    buttonFormCheck();
  });

  // Pour aller vers la fenêtre de la gallerie de la modale
  arrowLeft.addEventListener("click", function () {
    modalContent1.style.display = "flex";
    modalContent2.style.display = "none";
    arrowLeft.style.display = "none";
    resetForm()
  });


 

  

  addWorks();



};



// Fonction pour ajouter un projet
function addWorks() {
  const titleWork = document.getElementById("title");
  const select = document.getElementById("category");
  const inputFile = document.getElementById("photoInput");
  const form = document.getElementById("formModal");

  titleWork.addEventListener("input", buttonFormCheck);
  select.addEventListener("input", buttonFormCheck);
  inputFile.addEventListener("input", buttonFormCheck);

  form.addEventListener("submit", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const file = await inputFile.files[0];
      const Title = titleWork.value;  // Déclarez la variable Title
      const Category = select.value;  // Déclarez la variable Category
      const ImageValue = file;    

      const formData = new FormData();
      formData.append("image", ImageValue);
      formData.append("title", Title);
      formData.append("category", Category);

      const adminToken = sessionStorage.getItem("userToken");

      let response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
              Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
      });

      if (response.ok) {
          console.log("Projet ajouté avec succès.");
          createGallery();
          this.reset();
          closeModal();
      } else {
          console.log("erreur formulaire");
      };
  });
};
// Fonction pour activé ou désactivé le boutton de formulaire en fonction des champs remplis

function buttonFormCheck() {
  const titleWork = document.getElementById("title");//champ de saisie du titre 
  const select = document.getElementById("category"); //Le menu déroulant de sélection de catégorie avec l'ID "category".
  const inputFile = document.getElementById("photoInput"); //Le champ de saisie de fichier avec l'ID "photoInput".
  const buttonValidate = document.getElementById("buttonValidate");// Le bouton de validation avec l'ID "buttonValidate"


  if (titleWork.value !== "" && select.value !== "" && inputFile.files.length > 0) {
    buttonValidate.disabled = false;
    buttonValidate.style.backgroundColor = "#1d6154";
    console.log("formulaire ok");
  } else {
    buttonValidate.disabled = true;
    buttonValidate.style.backgroundColor = "#a7a7a7";
    console.log("formulaire incomplet");
  };

};

// Fonction pour reset le formulaire ajout image
function resetForm() {
  const form = document.getElementById("formModal");
  form.reset();



  const previewContainer = document.getElementById("previewContainer");

  const imageFile = document.querySelector(".imageFile");
  const inputFile = document.getElementById("photoInput");
  const iconDelete = document.querySelector(".iconDelete");
  const logoPhoto = document.querySelector(".logoPhoto");
  const btnPhotoInput = document.querySelector(".btnPhotoInput");
  const photoInputTxt = document.querySelector(".photoInputTxt");
  const errorImg = document.querySelector(".errorImg");

  logoPhoto.style.display = "flex";
  btnPhotoInput.style.display = "flex";
  photoInputTxt.style.display = "flex";
  errorImg.style.display = "flex";
 
  previewContainer.style.display = "none";

  if (imageFile) {
    imageFile.remove();
  };


  errorImg.textContent = "";
};




// !--------------------------------------- User Functions
/**
 * Display the user profile by creating a gallery of all their works and
 * adding filters for sorting and filtering the works.
 *
 * @param {array} allWorks - An array of all the user's works.
 */
const displayUser = async () => {

  await createGallery();
  await createFilters();
};

// !--------------------------------------- Admin Functions
const displayAdmin = () => {

  if (tokenUser) {
    addBanner(); // Ajouter une bannière d'édition
    removeFilters();// Masquer les filtres

  const portfolioTitle = document.querySelector(".portfolioTitle");
  
    // Ajout du bouton modifier
    const boutonEdit = document.createElement("a");
    boutonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
    boutonEdit.href = "#modal1";
    boutonEdit.classList.add("editBouton", "js-modal")
    portfolioTitle.appendChild(boutonEdit)

    // Ajouter des événements pour ouvrir la modale
    document.querySelectorAll(".js-modal").forEach((a) => {
      a.addEventListener("click", openModal);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
      }
      if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
      }
    });

navigateModal();
logout();
  }

};
document.addEventListener('DOMContentLoaded', () => {
  const photoInput = document.getElementById('photoInput');
  const logoPhoto = document.querySelector('.logoPhoto');
  const btnPhotoInput = document.querySelector('.btnPhotoInput');
  const photoInputTxt = document.querySelector('.photoInputTxt');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');

  photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Affiche l'image de prévisualisation
        previewImage.src = e.target.result;
        previewContainer.style.display = 'flex';


        // Masque les éléments par défaut
        logoPhoto.style.display = 'none';
        btnPhotoInput.style.display = 'none';
        photoInputTxt.style.display = 'none';
      };

      reader.readAsDataURL(file);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const photoInput = document.getElementById('photoInput');
  const submitButton = document.getElementById('buttonValidate');

  // Fonction pour valider les champs du formulaire
  function validerFormulaire() {
    const titre = titleInput.value.trim();
    const categorie = categorySelect.value;
    const image = photoInput.files.length > 0;

    // Vérifie si tous les champs sont remplis
    if (titre !== "" && categorie !== "" && image) {
      // Active le bouton "Valider"
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "#1D6154";
      submitButton.style.cursor = "pointer";
    } else {
      // Désactive le bouton "Valider"
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "#A7A7A7";
      submitButton.style.cursor = "auto";
    }
  }

  // Écouteurs d'événements pour les champs de saisie et de sélection
  titleInput.addEventListener('blur', validerFormulaire);
  categorySelect.addEventListener('blur', validerFormulaire);
  photoInput.addEventListener('change', validerFormulaire);

  // Assurez-vous que le bouton "Valider" est désactivé initialement
  validerFormulaire();
});





async function main() {
  await displayUser();
  displayAdmin();



}
main();