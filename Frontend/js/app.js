import home from "./home.js";
import selectedPlantsView from "./selectedPlantsView.js";
import header from "./header.js";
import footer from "./footer.js";
import allRecipesView from "./allRecipesView.js";
import singlePlantRecipeView from "./singlePlantRecipeView.js";



// ***************************************************************
// ***************************************************************
// THIS IS THE SECTION on HOW TO TAKE ZIPCODE TO FROSTDATE:
// ***************************************************************
// THE FUNCTION " findFrostDateFromZipCode " IS RUN IN  makeHomeViewFromJSON
//***************************************************************

function findFrostDateFromZipCode(plants) {
  const zipNumb = document.querySelector(".zipcode");
  const indoorCalcEl = document.querySelector(".indoorStart")
  console.log(zipNumb.value);
  fetch(`https://phzmapi.org/${zipNumb.value}.json`
  )
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((zipDetails) => {
      console.log(zipDetails);

      fetch(
        `https://api.farmsense.net/v1/frostdates/stations/?lat=${zipDetails.coordinates.lat}&lon=${zipDetails.coordinates.lon}`
      )
        .then((res) => res.json())
        .then((stationID) => {
          stationID;
let stationName = stationID[0].name;
          fetch(
            `https://api.farmsense.net/v1/frostdates/probabilities/?station=${stationID[0].id}&season=1`
          )
            .then((res) => res.json())
            .then((frostDateNumb) => {
              frostDateNumb[0].prob_50;
              console.log(frostDateNumb[0].prob_50);
              let fdate = frostDateNumb[0].prob_50;
              console.log("F-DATE NEXT")
              console.log(fdate);
              
              let date = dateConverter(fdate);
              let indoorDateStart = new Date(date);
       
             
              makeSelectedPlantViewFromJson(plants, indoorDateStart, stationName);


            });
        });
    })
    .catch((error) => console.error(error));
}
// -----------------------------------------------------------------------------
// ***************************************************************
function dateConverter(fdate) {
console.log(fdate);
                let fdateMonth = fdate.substring(0, 2);
                console.log(fdateMonth);
                let fdateDay = fdate.substring(2);
                console.log(fdateDay);
                let today = new Date()
                const d = new Date(today.getFullYear(), fdateMonth - 1, fdateDay);
                  return d;
}

// *************************************************
// **************************************************
// THIS IS THE HOMEVIEW SECTION:
// *************************************************
const containerEl = document.querySelector(".container");
function makeHomeView() {
  console.log("working");
  fetch("http://localhost:8080/")
    .then((res) => res.json())
    .then((plants) => {
      makeHomeViewFromJSON(plants);
    });
}

function makeHomeViewFromJSON(plants){
  containerEl.innerHTML = header();
  containerEl.innerHTML += home(plants);
  containerEl.innerHTML += footer();
  //bind function will go here
  const checkBoxDivs = containerEl.querySelector(".veg_id");

  //Submit button
  const submit_button = document.querySelector(".submitButton");
  submit_button.addEventListener("click", ValidateVegSelection);

  // Deleted this section because submit button already does this function.
  // const zipSubBtn = containerEl.querySelector(".zipSubmitButton");
  // zipSubBtn.addEventListener("click", findFrostDateFromZipCode);

  console.log(plants.id);

  // //All recipes button
  const allRecButton = document.querySelector(".allRecipesButton");
  allRecButton.addEventListener("click", makeAllRecipesView)
}

makeHomeView();

// *************************************************
// **************************************************
// THIS IS THE SELECTED PLANTS VIEW SECTION:
// *************************************************

//Once the submit button is clicked on the homepage, the function below runs

function ValidateVegSelection()  { 

try {
  var array = [];
  var queryString = "";
  var checkboxes = document.querySelectorAll("input:checked");
  
  for (var i = 0; i < checkboxes.length; i++) {
    console.log(checkboxes[i].parentElement.querySelector(".veg_id").value);
    array.push(checkboxes[i].parentElement.querySelector(".veg_id").value);
    queryString +=
      checkboxes[i].parentElement.querySelector(".veg_id").value + "," ;
  } 
}
// catch(error) {
//   window.alert("Zip code invalid. Please enter a valid zip code.");
// }
finally {alert("Zip code invalid. Please enter a valid zip code.");}





  // TRIM QUERYSTRING HERE AS STRETCH GOAL


fetch("http://localhost:8080/plants?plantsIds="+queryString) 
.then(res => res.json())
.then(plants =>{

  findFrostDateFromZipCode(plants);

})
}  

function makeSelectedPlantViewFromJson(plants, date, stationName){
  containerEl.innerHTML = header();
  containerEl.innerHTML += selectedPlantsView(plants, date, stationName);
  containerEl.innerHTML += footer();


const plantDivs = document.querySelectorAll(".singlePlant");
plantDivs.forEach(plantDiv => {
  const plantIdInput = plantDiv.querySelector(".plantId");
  plants.forEach(plant =>{
    if(plantIdInput.value == plant.id){
      const recipeButton = plantDiv.querySelector(".clickForRecipeButton");
      recipeButton.addEventListener("click", ()=>{
      makeSinglePlantRecipeView(plant);
      })
    }
  })

})

}

// *************************************************
// **************************************************
// THIS IS THE ALL RECIPE VIEW SECTION:
// *************************************************
  
function makeAllRecipesView(plants){

  fetch("http://localhost:8080/")
  .then((res) => res.json())
  .then((plants) => {
      makeAllRecipesViewFromJson(plants);
  })
}
function makeAllRecipesViewFromJson(plants){
containerEl.innerHTML = header();
containerEl.innerHTML += allRecipesView(plants);
containerEl.innerHTML += footer();


  const allRecDivs = document.querySelectorAll(".allRecDiv");
  allRecDivs.forEach(allRecDiv => {
    const plantRecIdInput = allRecDiv.querySelector(".plantRecId");
    plants.forEach(plant =>{
      if(plantRecIdInput.value == plant.id){
        const singleRecBtn = document.querySelectorAll(".plantPhoto");
        singleRecBtn.addEventListener("click", () => {
        makeSinglePlantRecipeView(plant);
        })
      }
    })
})
}


// *************************************************
// **************************************************
// THIS IS THE SINGLE PLANT RECIPES VIEW SECTION:
// *************************************************
//need tpo change makeSinglePlantRecipeView to take in just "plant"
function makeSinglePlantRecipeView(plant){
  console.log("this is working");
  fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${plant.name}&app_id=2762fe12&app_key=9a0f0246c250ede5b70c49d6ee4d1116`)
.then(res =>res.json())
.then(recipes =>{
console.log(recipes);
  //This should take in plant name and list of recipe JSON
  makeSinglePlantRecipeViewFromJson(recipes);
})
}
function makeSinglePlantRecipeViewFromJson(recipes){
  containerEl.innerHTML = header();
  containerEl.innerHTML += singlePlantRecipeView(recipes);
  containerEl.innerHTML += footer();

  const recipeImgBtn = document.querySelectorAll(".recipeImage");
  recipeImgBtn.addEventListener("click", () => {
    
  })

}



// *************************************************
// **************************************************
// THIS IS THE SINGLE RECIPE VIEW SECTION, FROM PLANT:
// *************************************************

// *************************************************
// **************************************************
// THIS IS THE ALL RECIPE VIEW SECTION:
// *************************************************
