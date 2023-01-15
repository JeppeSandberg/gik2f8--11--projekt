listForm.name.addEventListener('keyup', (e) => validateField(e.target));
listForm.name.addEventListener('blur', (e) => validateField(e.target));
listForm.year.addEventListener('input', (e) => validateField(e.target));
listForm.year.addEventListener('blur', (e) => validateField(e.target));
listForm.director.addEventListener('input', (e) => validateField(e.target));
listForm.director.addEventListener('blur', (e) => validateField(e.target));
listForm.addEventListener('submit', onSubmit);

const packingListElement = document.getElementById('packingList');

let nameValid = true;
let yearValid = true;
let directorValid = true;


const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  switch (name) {
    case 'name': {
      if (value.length < 2) {
        nameValid = false;
        validationMessage = "Fältet 'Namn' måste innehålla minst 2 tecken.";
      } else if (value.length > 25) {
        nameValid = false;
        validationMessage =
          "Fältet 'Namn' får inte innehålla mer än 25 tecken.";
      } else {
        nameValid = true;
      }
      break;
    }
    case 'year': {
      if (value.length != 4) {
        yearValid = false;
        validationMessage = "Fältet 'Utgivningsår' måste innehålla 4 tecken.";
      } else {
        yearValid = true;
      }
      break;
    }
    case 'director': {
      if (value.length < 2) {
        directorValid = false;
        validationMessage = "Fältet 'Regissör' måste innehålla minst 2 tecken.";
      } else if (value.length > 20) {
        directorValid = false;
        validationMessage =
          "Fältet 'Regissör' får inte innehålla mer än 20 tecken.";
      } else {
        directorValid = true;
      }
      break;
    }
  }
  
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}



function onSubmit(e) {
  e.preventDefault();

  if (nameValid && yearValid && directorValid) {
    console.log('Submit');
    saveFilm();
  }
}


function saveFilm() {
  const film = {
    name: listForm.name.value,
    year: listForm.year.value,
    director: listForm.director.value,
  };
   
api.create(film).then((film) => {
  
  if (film) {
      renderList();
    }
  });

  listForm.name.value="" ;
  listForm.year.value="" ;
  listForm.director.value="";
}

function renderList() {
  console.log('rendering');
  api.getAll().then((films) => {
    packingListElement.innerHTML = '';

    if (films && films.length > 0) {
      films.forEach((film) => {
        packingListElement.insertAdjacentHTML('beforeend', renderFilm(film));
      });
    }
  });
}


function renderFilm({ id, name, year, director}) {
let html = `
<li class="flex select-none mt-2 pt-4 border-b bg-white/80 rounded-lg">
  <div class="flex justify-between w-5/6">
    <p class="mb-6 ml-8 mr-30 w-1/6">${name}</p><p class=" mb-6  w-1/6">${year}</p> <p class="mb-6 w-1/6">${director}</p>
  </div>
  <div>
  <button onclick="deleteFilm(${id})" class="inline-block ml-10 rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-1">Ta bort</button>
</div>`;
return html;
}

function deleteFilm(id) {
  api.remove(id).then(() => {
    renderList();
  });
}

renderList();
