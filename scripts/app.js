const inputField = document.getElementById("user-field");
inputField.addEventListener("keyup", (event) => {
  if (event.keyCode === 13 || event.key === "Enter") {
    loadBooksData();
  }
});

const loadBooksData = async () => {
  // show spinner and hide elements
  elementDisplayBlock("spinner");
  const container = document.getElementById("books-container");
  container.textContent = "";
  document.getElementById("total-result-container").classList.add("d-none");

  // collect user input value
  const inputField = document.getElementById("user-field");
  const searchTerm = inputField.value;
  if (searchTerm !== "") {
    const URL = `https://openlibrary.org/search.json?q=${searchTerm}`;
    const response = await fetch(URL);
    const data = await response.json();
    displayBookData(data);
  } else {
    errorMessage("Please Type something!");
  }
  // clear input value and hide spinner
  inputField.value = "";
  elementDisplayNone("spinner");
};

// show and hide spinner
const elementDisplayNone = (id) => {
  const spinner = document.getElementById(id);
  spinner.classList.add("d-none");
};

const elementDisplayBlock = (id) => {
  const spinner = document.getElementById(id);
  spinner.classList.remove("d-none");
};

// show Books data in display
const displayBookData = (books) => {
  const booksContainer = document.getElementById("books-container");
  booksContainer.textContent = "";

  // validate total results
  const totalContainer = document.getElementById("total-result-container");
  if (books.docs.length > 0) {
    totalContainer.classList.remove("d-none", "text-center", "text-danger");
    totalContainer.innerText = `About ${books.numFound} results (0.46 seconds)`;
    // use ForEach Method for traverse every single element
    const booksData = books.docs;
    booksData.forEach((book) => {
      const colDiv = document.createElement("div");
      colDiv.classList.add("col");
      colDiv.innerHTML = displayHTML(book);
      booksContainer.appendChild(colDiv);
    });
  } else {
    errorMessage(`Here No Result Found!`);
  }
};

// Error Message Handling
const errorMessage = (errorMsg) => {
  const totalContainer = document.getElementById("total-result-container");
  totalContainer.classList.remove("d-none");
  totalContainer.classList.add("text-center", "text-danger");
  totalContainer.innerText = errorMsg;
};

// display html render
const displayHTML = (book) => {
  const {
    publisher,
    cover_i,
    author_name,
    first_publish_year,
    title,
    title_suggest,
    author_alternative_name,
  } = book;

  return `
       <div class="card h-100 rounded-3 shadow border-primary border-bottom border-3 border-0">
                                   <img class="object-cover" height="400px" src="https://covers.openlibrary.org/b/id/${
                                     cover_i !== undefined ? cover_i : 8310846
                                   }-M.jpg" class="card-img-top"
                                        alt="...">
                                   
                                   <div class="card-footer p-0">
                                        <ul class="list-group list-group-flush p-0">
                                             <li class="list-group-item"><span class="text-success">Book Name:</span> ${
                                               title ? title : title_suggest
                                             } </li>
                                             <li class="list-group-item"><span class="text-success">Author Name:</span> ${
                                               book.hasOwnProperty(
                                                 "author_name"
                                               )
                                                 ? author_name[0]
                                                 : author_alternative_name ||
                                                   "N/A"
                                             }</li>
                                             <li class="list-group-item"><span class="text-success">First Published:</span> ${
                                               first_publish_year
                                                 ? first_publish_year
                                                 : "N/A"
                                             }</li>
                                             <li class="list-group-item"><span class="text-danger">Publisher:</span> ${
                                               publisher ? publisher[0] : "N/A"
                                             }</li>
                                        </ul>
                                   </div>
                              </div>
       `;
};
