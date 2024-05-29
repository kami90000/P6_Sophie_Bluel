"use strict";

// !------------------------------------- Constants
const filters = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");
const tokenUser = sessionStorage.getItem("userToken");

// !-------------------------------------- Global variables
let allWorks = [];
let allCategories = [];
let select;
let inputTxt;
let imgInput;
let submitButton;
let modalList;
let previouslyFocusedElement = null;


// !--------------------------------------- API Functions

/**
 * Retrieves all works from the API.
 *
 * @return {Promise<void>} Returns a promise resolving to undefined.
 */
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");

  return response.json();
};

/**
 * Retrieves the categories from the API.
 *
 * @return {Promise<void>} A promise that resolves once the categories are retrieved.
 */
const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  return response.json();
};

// !--------------------------------------- Gallery Functions

/**
 * Creates a gallery principal.
 *
 * @param {Object} work - The work object.
 * @return {HTMLLIElement} The gallery item element.
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
 * Creates a gallery item element for the modal.
 *
 * @param {Object} work - The work object.
 * @return {HTMLLIElement} The gallery item element for the modal.
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
 * Creates a gallery by adding a new div element with the class "gallery" to the DOM.
 * If an existing gallery already exists, it is removed before creating the new one.
 *
 * @param {Array} galleryItems - An array of objects representing the gallery items.
 */
const createGallery = async (categorieId = null) => {
  
  allWorks = await getWorks();
  console.log(allWorks)
  
  gallery.innerHTML = "";
  const galleryModal = document.querySelector(".galleryModal");
  galleryModal.innerHTML = ""; // Modal gallery

  allWorks.forEach((work) => {
    if (categorieId == null || categorieId == work.category.id) {
      // Main gallery
      createGalleryItem(work);
      // Modal gallery
      galleryModal.appendChild(createModalGalleryItem(work));
    }


  });


};


// !--------------------------------------- Filters Functions

/**
 * Filters works by category and updates the gallery.
 *
 * @param {string} categoryId - The category ID.
 */
/*const filterCategory = (categoryId) => {
  if (allWorks.length === 0) {
    return;
  }

  const filteredGallery = categoryId === "0"
    ? allWorks
    : allWorks.filter(work => work.categoryId == categoryId);

  createGallery(filteredGallery);
};*/

/**
 * Creates filters and adds click event listeners.
 */
const createFilters =  async () => {

  allCategories = await getCategories();

  // Ajoutez la logique pour récupérer les catégories et créer les filtres dynamiquement

  allCategories.forEach(category => {
    const li = document.createElement("li");
    li.id = category.id; // Assurez-vous que l'ID correspond à l'ID de la catégorie
    li.textContent = category.name;
    li.classList.add("filterButton");
    filters.appendChild(li);
  });


  const allFilters = document.querySelectorAll(".filters li")
  allFilters.forEach(filter => {
    


      filter.addEventListener("click", function () {
        let categorieId = filter.getAttribute("id");
        allFilters.forEach((filter) => filter.classList.remove("filterButtonActive"));
        filter.classList.add("filterButtonActive");

       
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


// !--------------------------------------- Banner Functions
/**
 * Adds a banner to the page.
 */
const addBanner = () => {
  const banner = document.createElement("div");
  banner.classList.add("banner");

  const bannerTxt = document.createElement("a");
  bannerTxt.innerText = "Mode édition";

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");
  bannerTxt.appendChild(editIcon);

  banner.appendChild(bannerTxt);
  document.body.insertBefore(banner, document.body.firstChild);
};

// !--------------------------------------- Remove Filters
/**
 * Removes filters from the page.
 */
const removeFilters = () => {
 
    filters.innerHTML = "";

};



// !--------------------------------------- Delete work

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
      //setDeleteModal();
     // return await response.json(); // Retourne les données du travail supprimé si nécessaire
    } else {
      throw new Error("Une erreur est survenue lors de la suppression du travail.");
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la suppression du travail :", error);

  }
};

// !--------------------------------------- Preview work
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
 * Generates a preview of a work based on the selected file.
 *
 * @param {Event} event - The event object triggered by the user action.
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
 * Validates if a given file is a valid work file.
 *
 * @param {Object} file - The file object to be validated.
 * @return {boolean} Returns true if the file is a valid work file, otherwise returns false.
 */
const validateWorkFile = (file) => {
  const allowedTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);
  const maxFileSize = 4 * 1024 * 1024;

  return allowedTypes.has(file.type) && file.size <= maxFileSize;
};




// !--------------------------------------- Add work

const addWork = (inputTxt, select, imgInput) => {
  const formData = new FormData();
  formData.append("title", inputTxt.value);
  formData.append("category", select.value);
  formData.append("image", imgInput.files[0]);

  const token = localStorage.getItem("userToken");

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  })
    .then(async (res) => {
      if (res.ok) {
        alert("Le travail a bien été ajouté");

        const newWorkResponse = await res.json();
        allWorks.push(newWorkResponse);
        createGallery(allWorks);
        //setDeleteModal();
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
};

// Fonction pour reset le formulaire ajout image
function resetForm() {
  const form = document.getElementById("formModal");
  form.reset();

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
  iconDelete.style.display = "none";

  if (imageFile) {
      imageFile.remove();
  };

  inputFile.value = "";
  errorImg.textContent = "";
};

// Fonction pour activé ou désactivé le boutton de formulaire en fonction des champs remplis

function buttonFormCheck() {
  const titleWork = document.getElementById("title");
  const select = document.getElementById("category");
  const inputFile = document.getElementById("photoInput");
  const buttonValidate = document.getElementById("buttonValidate");


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
    addBanner();
    removeFilters();


    // Modification de la margin sous le h2 'Mes Projets' 
    const portfolioTitle = document.querySelector(".portfolioTitle");
    //portfolioTitle.style.marginBottom = "90px";

    // Ajout du bouton modifier
    const boutonEdit = document.createElement("a");
    boutonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
    boutonEdit.href = "#modal1";
    boutonEdit.classList.add("editBouton", "js-modal")
    portfolioTitle.appendChild(boutonEdit)


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
    //addModifyBtn();
    logout();
  }

};


async function main() {
  await displayUser();
  displayAdmin();


  
}
main();