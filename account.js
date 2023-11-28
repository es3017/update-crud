let animals; // Variable to store animal data
let panel_class; // Variable to store the current panel class

// Function to set up the initial state of the page
const setUp = () => {
  console.log("in setup");
  $(".access").css({ border: "2px solid green" });
  $("nav ul li").hide(); // Hide navigation menu items
  $("#login").on("click", login); // Add a click handler for login button
};

// Function to check if the username and password are valid
const authOK = (userName, userPasscode) => {
  return userName == "dog" && userPasscode == "goofy";
};

// Function to handle the login
const login = () => {
  console.log("Logging in");
  let userName = $("#id_Name").val();
  let userPasscode = $("#id_Passcode").val();
  if (authOK(userName, userPasscode)) {
    $("nav ul li").show(); // Show navigation menu items on successful login
  }
  $(".access").hide(); // Hide the login box
  let nameStr = $(`<h3>Welcome, ${userName} account handler!</h3>`);
  $("header").append(nameStr);
  $("#dog").on("click", createPanel); // Add a click handler for the dogs button
};

// Function to create a panel based on the clicked button
const createPanel = (event) => {
  console.log("createpanel -- event --", event);
  panel_class = event.target.id;
  console.log("panel_class : ", panel_class);
  $(".animals").html(`<div class=${panel_class}></div>`);
  let area = $(`.animals .${panel_class}`);
  animals = panel_class == "dog" ? getAllDogsAPI() : getAllCatsAPI();
  animals.forEach((animal) => {
    let animalLine = $(
      `<div class="displayLine">
          <div class="info">${animal.animal_name} the ${animal.breed} <img src="./images/${animal.animal_name}.png"/> </div>
          <div class="crud_buttons"><button class="view">View</button><button class="update">Update</button><button class="remove">Remove</button></div>
          <div class="showInfo"></div>
       </div>`
    );
    area.append(animalLine);
  });
  let createPara =
    $(`<span>Use the CREATE button below to register a new ${panel_class} for the shelter.</span>
    <div class="crud_buttons"><button class="create">Create</button></div>`);
  $(`.animals`).prepend(createPara);
  $(".crud_buttons .create").on("click", createHandler);
  $(".displayLine button").on("click", (e) => {
    const target = $(e.target);
    console.log(target["0"]);
    handler(target["0"]);
  });
};

// Function to handle button clicks
const handler = (element) => {
  console.log("in handler - see element ", element);
  let elementClass = element.className;
  console.log("element class ", elementClass);
  let indexOfAnimal = $(`button.${elementClass}`).index(element);
  console.log("index of animal ", indexOfAnimal);
  console.log(animals[indexOfAnimal]);

  if (indexOfAnimal >= 0)
    if (elementClass == "view") {
      viewHandler(indexOfAnimal);
    } else if (elementClass == "update") {
      updateHandler(indexOfAnimal);
    } else if (elementClass == "remove") {
      console.log("Removing!!!!", indexOfAnimal);
      removeHandler(indexOfAnimal);
    }
};

// Function to display details of an animal
const viewHandler = (index) => {
  console.log("viewhandler", index);
  let info = $(".showInfo:eq(" + index + ")");
  console.log("INFO", info);
  info.html(
    `${animals[index].animal_name} is ${animals[index].age} years old. This ${animals[index].breed} is fed at these hours: ${animals[index].feed_times}, with ${animals[index].scoops} scoops of ${animals[index].food}. Careful! ${animals[index].warning}!!<button class="close">X</button>`
  );
  info.find(".close").on("click", () => {
  });
};

// Function to handle the update input
const updateHandler = (index) => {
  console.log("updatehandler", index);
  displayUpdateForm(index);
};

// Function to display the update form for a selected animal
const displayUpdateForm = (index) => {
  const selectedAnimal = animals[index];
  let updateForm = $(
    `<div class="updateForm">
        <label for="update_name"> Name </label><br />
        <input type="text" id="update_name" value="${selectedAnimal.animal_name}" size="6" /><br />
        <label for="update_breed"> Breed </label><br />
        <input type="text" id="update_breed" value="${selectedAnimal.breed}" size="8" /><br />
        <label for="update_age"> Age </label><br />
        <input type="text" id="update_age" value="${selectedAnimal.age}" size="1" /><br />
        <button class="save_update">Save Update</button>
        <button class="cancel_update">Cancel</button>
    </div>`
  );
  let area = $(`.animals .${panel_class}`);
  let selectedAnimalElement = area.find(".displayLine").eq(index);
  selectedAnimalElement.after(updateForm);
  updateForm.find(".save_update").on("click", function () {
    saveUpdate(index);
  });
  updateForm.find(".cancel_update").on("click", function () {
    cancelUpdate(index);
  });
};

// Function to save the updates made to an animal
const saveUpdate = (index) => {
  const updatedAnimal = {
    breed: $("#update_breed").val(),
    animal_name: $("#update_name").val(),
    age: $("#update_age").val(),
  };
  animals[index] = updatedAnimal;
  updateDisplay(index);
  $(".updateForm").remove();
};

// Function to cancel the update process
const cancelUpdate = (index) => {
  $(".updateForm").remove();
};

// Function to update the displayed information for an animal
const updateDisplay = (index) => {
  let selectedAnimalElement = $(`.animals .${panel_class} .displayLine`).eq(index);
  selectedAnimalElement.find(".info").html(
    `${animals[index].animal_name} the ${animals[index].breed} <img src="./images/${animals[index].animal_name}.png"/>`
  );
};

// Function to handle the removal of an animal
const removeHandler = (index) => {
  console.log("Removing ... ", index);
  let item = $(".dog .displayLine").eq(index);
  console.log("Removing ... ", item);
  item.remove();
  animals.splice(index, 1);
  console.log(animals);
};

// Function to handle the creation of a new animal
const createHandler = () => {
  $("button.create").prop("disabled", true);
  console.log("Creating a new animal for shelter");
  let createPara =
    $(`<input type="text" id="new_name" value='name' size="6"/> 
    is a 
    <input type="text" id="new_breed" value='breed' size="8" />, 
    and is 
    <input type="text" id="new_age" value=age size="1" /> 
    years old. Feed her at 
    <input type="text" id="new_feed_times" value='feed_times' size="16">
    with 
    <input type="text" id="new_scoops" value='x' size="1">
    scoops of 
    <input type="text" id="new_food" value='food' size="11">. 
    <input type="text" id="new_warning" value='warning' size="30">.<button class="save_new">Save</button>`);
  $(".crud_buttons .create").after(createPara);
  $(".save_new").on("click", function () {
    let newAnimal = {
      breed: $("input#new_breed").val(),
      animal_name: $("input#new_name").val(),
      age: $("input#new_age").val(),
      feed_times: $("#new_feed_times").val(),
      food: $("#new_food").val(),
      scoops: $("#new_scoops").val(),
      warning: $("#new_warning").val(),
    };
    console.log("------->>>>", newAnimal);
    animals.push(newAnimal);
    console.log(animals);
    let area = $(`.animals .${panel_class}`);
    console.log("AREA, in create for adding new animal:", area);
    let animalLine = $(
      `<div class="displayLine">
          <div class="info">${newAnimal.animal_name} the ${newAnimal.breed} <img src="./images/genericdog.jpg"/> </div>
          <div class="crud_buttons"><button class="view">View</button><button class="update">Update</button><button class="remove">Remove</button></div>
          <div class="showInfo"></div>
       </div>`
    );
    area.append(animalLine);
    $(".displayLine button").on("click", (e) => {
      const target = $(e.target);
      console.log(target);
      console.log(target["0"]);
      handler(target["0"]);
    });
    $("button.create").prop("disabled", false);
    createPara.remove();
  });
};

$(document).ready(setUp);
