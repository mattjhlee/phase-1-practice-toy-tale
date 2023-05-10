let addToy = false;
const toyCollection = document.querySelector("#toy-collection");
const addToyForm = document.querySelector(".add-toy-form");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys") 
    .then(resp => resp.json())
    .then(data => {
      data.forEach(toy => renderToy(toy))
    })

    function renderToy(toy) {
        const card = document.createElement("div");
        card.className = "card";

        const h2 = document.createElement("h2");
        h2.textContent = toy.name;
        card.appendChild(h2);

        const img = document.createElement("img");
        img.className = "toy-avatar";
        img.src = toy.image;
        card.appendChild(img);

        const p = document.createElement("p");
        p.textContent = `${toy.likes} Likes`;
        card.appendChild(p);

        const button = document.createElement("button");
        button.className = "like-btn";
        button.id = toy.id;
        button.textContent = "Like ❤️"
        card.appendChild(button);
        button.addEventListener("click", () => addLikes(parseInt(p.innerText), button))
        
        toyCollection.appendChild(card);
    }

  addToyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addNewToy(event);
    })

  function addNewToy(event) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": event.target.name.value,
        "image": event.target.image.value,
        "likes": 0,
      })
    })
      .then(resp => resp.json())
      .then(data => {
        renderToy(data);
      })
  }

  function addLikes(likes, button) {
    let newLikes = ++likes;
    const toyId = button.id;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept : "application/json"
      },
      body: JSON.stringify({
        "likes": newLikes,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        const toy = button.parentNode;
        toy.querySelector("p").textContent = `${newLikes} Likes`;
      })
  }
});
