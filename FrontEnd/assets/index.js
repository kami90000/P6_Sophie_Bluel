"use strict";

// !------------------------------------- Constants
const filters = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");

// !-------------------------------------- Global variables
let allWorks = [];
let allCategories = [];
let select;
let inputTxt;
let imgInput;
let submitButton;


// !--------------------------------------- API Functions

/**
 * Retrieves all works from the API.
 *
 * @return {Promise<void>} Returns a promise resolving to undefined.
 */
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  allWorks = await response.json();
};

/**
 * Retrieves the categories from the API.
 *
 * @return {Promise<void>} A promise that resolves once the categories are retrieved.
 */
const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  allCategories = await response.json();
};

// !--------------------------------------- Gallery Functions

/**
 * Creates a gallery principal.
 *
 * @param {Object} work - The work object.
 * @return {HTMLLIElement} The gallery item element.
 */
const createGalleryItem = (work) => {

  const listItem    = document.createElement("li");
  const figure      = document.createElement("figure");
  const img         = document.createElement("img");
  const figcaption  = document.createElement("figcaption");

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
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figcaption.classList.add("figcaption");

  figure.appendChild(img);
  figure.appendChild(figcaption);
  listItem.appendChild(figure);

  return listItem;
};


/**
 * Creates a gallery by adding a new div element with the class "gallery" to the DOM.
 * If an existing gallery already exists, it is removed before creating the new one.
 *
 * @param {Array} galleryItems - An array of objects representing the gallery items.
 */
const createGallery = (galleryItems) => {
  gallery.innerHTML = "";
  

  galleryItems.forEach((work) => {
    createGalleryItem(work);


  });


};


// !--------------------------------------- Filters Functions

/**
 * Filters works by category and updates the gallery.
 *
 * @param {string} categoryId - The category ID.
 */
const filterCategory = (categoryId) => {
  if (allWorks.length === 0) {
    return;
  }

  const filteredGallery = categoryId === "0"
    ? allWorks
    : allWorks.filter(work => work.categoryId == categoryId);

  createGallery(filteredGallery);
};

/**
 * Creates filters and adds click event listeners.
 */
const createFilters = () => {
  filters.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "LI") {
      const categoryId = target.id.toLowerCase();
      filterCategory(categoryId);

      filters.querySelectorAll("li").forEach(li => li.classList.remove("active"));
      target.classList.add("active");
    }
  });
};

 // Ajoutez la logique pour récupérer les catégories et créer les filtres dynamiquement
 getCategories().then(categories => {
  categories.forEach(category => {
    const li = document.createElement("li");
    li.id = category.id; // Assurez-vous que l'ID correspond à l'ID de la catégorie
    li.textContent = category.name;
    filters.appendChild(li);
  });
});


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
  const filtersElements = document.querySelectorAll(".filters");

  filtersElements.forEach((filtersElement) => {
    filtersElement.innerHTML = "";
  });
};

// !--------------------------------------- Modify Button Functions
const addModifyBtn = () => {
  const modifyBtn = document.createElement("button");
  modifyBtn.classList.add("modify");

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");

  modifyBtn.appendChild(editIcon);
  modifyBtn.appendChild(document.createTextNode(" modifier"));

  const portfolioTitle = document.getElementById("portfolioTitle");
  portfolioTitle.appendChild(modifyBtn);

  modifyBtn.addEventListener("click", setDeleteModal);
};

// !--------------------------------------- Close modal
const closeModal = () => {
  const modal = document.querySelector(".modal");
  modal.remove();
  document.body.classList.remove("modal-open");
};

// !--------------------------------------- Modal Functions

/**
 * Sets up the delete modal by creating the necessary DOM elements and attaching event listeners.
 * 
 */
const setDeleteModal = () => {
  const existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("section");
  modal.classList.add("modal");

// Création de la section "Galerie Photo"

  const gallerySection = document.createElement("section");
  gallerySection.classList.add("gallery-section");
  const photoGallery = document.createElement("ul");
  photoGallery.classList.add("photo-gallery");

  allWorks.forEach((work) => {
    const listItem = createGalleryItem(work);
    const figcaption = listItem.querySelector("figcaption");
    listItem.removeChild(figcaption);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.addEventListener("click", () => {
      deleteWork(work.id);
      listItem.remove();
      allWorks = allWorks.filter((item) => item.id !== work.id);
      createGallery(allWorks);
    });

    listItem.appendChild(deleteIcon);
    photoGallery.appendChild(listItem);
  });

  gallerySection.appendChild(photoGallery);
  modal.appendChild(gallerySection);

 // Création de la section "Formulaire Ajouter un Travail"

  const formSection = document.createElement("section");
  formSection.classList.add("form-section", "hidden");

  // Créez votre formulaire ici et ajoutez-le à la section formSection

  modal.appendChild(formSection);
  
// Ajoutez la modal au document
  document.body.classList.add("modal-open");
  document.body.insertBefore(modal, document.body.firstChild);

  allWorks.forEach((work) => {
    const listItem = createGalleryItem(work);
    const figcaption = listItem.querySelector("figcaption");
    listItem.removeChild(figcaption);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.addEventListener("click", () => {
      deleteWork(work.id);
      listItem.remove();
      allWorks = allWorks.filter(item => item.id !== work.id);
      createGallery(allWorks);
    });

    if (existingModal) {
      existingModal.remove();

    }
      listItem.classList.add("hidden");
      modalList.appendChild(listItem);
    
  });

  modal.id = "delete-modal";
  document.body.classList.add("modal-open");
  modal.classList.add("modal");
  iconModal.classList.add("iconModal");
  arrowLeft.classList.add("fa-solid", "fa-arrow-left");
  iconClose.classList.add("fa-solid", "fa-xmark");
  addImgBtn.classList.add("add-btn");
  line.classList.add("line");

  titleModal.textContent  = "Galerie Photo";
  addImgBtn.textContent   = "Ajouter une photo";

  portfolio.appendChild(modal);
  modal.appendChild(iconModal);
  iconModal.appendChild(arrowLeft);
  iconModal.appendChild(iconClose);
  modal.appendChild(titleModal);
  modal.appendChild(modalList);
  modal.appendChild(line);
  modal.appendChild(addImgBtn);

  iconClose.addEventListener("click", closeModal);
  arrowLeft.addEventListener("click", setDeleteModal);
  addImgBtn.addEventListener("click", setCreateModal);

};
/**
 * Sets up the create modal by creating and appending the necessary elements.
 */
const setCreateModal = () => {

  const modal       = document.querySelector(".modal");
  const titleModal  = document.querySelector(".modal h3"); 
  const line        = document.querySelector(".line");

  const form        = document.createElement("form");
  const addPhoto    = document.createElement("div");
  const iconeImg    = document.createElement("i");
  const labelImg    = document.createElement("label");
  const btnPreview  = document.createElement("input");
  const detailsImg  = document.createElement("p");
  const titleImg    = document.createElement("label");
  const labelCat    = document.createElement("label");
  
  imgInput          = document.createElement("input");
  inputTxt          = document.createElement("input");
  select            = document.createElement("select");
  submitButton      = document.createElement("button");


  const options = ["Appartements", "Objets", "Hôtels & restaurants"];
  for (const optionText of options) {
    const option = document.createElement("option");
    option.value = options.indexOf(optionText);
    option.textContent = optionText;
    select.appendChild(option);
  }

  titleModal.nextSibling.remove();
  line.nextElementSibling.remove();

  modal.id = "create-modal";
  document.body.classList.add("modal-open");
  iconeImg.classList.add("fa-regular", "fa-image");
  addPhoto.classList.add("add-photo");
  btnPreview.classList.add("btn-preview");
 
  titleModal.textContent    = "Ajout photo";
  detailsImg.textContent    = "jpg, png : 4mo max";

  labelImg.htmlFor          = "image";
  imgInput.type             = "file";
  imgInput.id               = "image";
  imgInput.htmlFor          = "image";
  imgInput.accept           = ".jpg, .jpeg, .png";
  imgInput.style.display    = "none";

  btnPreview.type           = "button";
  btnPreview.value          = "+ Ajouter photo";

  titleImg.id               = "label";
  titleImg.htmlFor          = "texte";
  titleImg.textContent      = "Titre";
  inputTxt.type             = "text";
  inputTxt.id               = "texte";
  inputTxt.name             = "texte";

  labelCat.htmlFor          = "categorie";
  labelCat.textContent      = "Catégorie";
  select.id                 = "categorie";
  select.name               = "categorie";

  submitButton.type         = "submit";
  submitButton.textContent  = "Valider";
  submitButton.id           = "submit";

  modal.appendChild(form);
  form.appendChild(addPhoto);
  addPhoto.appendChild(iconeImg);
  addPhoto.appendChild(labelImg);
  addPhoto.appendChild(imgInput);
  addPhoto.appendChild(btnPreview);
  addPhoto.appendChild(detailsImg);
  form.appendChild(titleImg);
  form.appendChild(inputTxt);
  form.appendChild(labelCat);
  form.appendChild(select);
  form.appendChild(line);
  form.appendChild(submitButton);

  imgInput.addEventListener("change", workPreview);
  btnPreview.addEventListener("click", () => {
    imgInput.click();
  });
 
  inputTxt.addEventListener('input', validateForm);
  select.addEventListener('input', validateForm);
  imgInput.addEventListener('input', validateForm);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addWork(inputTxt, select, imgInput);
  });
}

// !--------------------------------------- User Functions
/**
 * Display the user profile by creating a gallery of all their works and
 * adding filters for sorting and filtering the works.
 *
 * @param {array} allWorks - An array of all the user's works.
 */
const displayUser = async () => {
  await getWorks();
  console.log(allWorks)
  createGallery(allWorks);
  createFilters();
};

// !--------------------------------------- Admin Functions
const displayAdmin = () => {
  console.log (allWorks);  
  createGallery(allWorks);
  addBanner();
  removeFilters();
  addModifyBtn();
};


function main() {
  displayUser();
  displayAdmin();

  }
  main();

