import indoorStartFrag from "./indoorStartFrag.js";
import calendarButton from "./calendarButton.js";
import indoorCalcFrag
 from "./indoorCalcFrag.js";
export default function selectedPlantsView(plants, d, stationName){
    console.log(plants + d);
    const lengthOfDay = (24 * 60 * 60 * 1000);
return `
<button class ="backBtn">Back Button</button>
<button onclick="window.print()" class="printBtn">Print this Page</button>
<div class="plantInfo">
<h2>This is the average last frost date for your area + ${d.toDateString()}</h2>


${plants
  .map((plant) => {
    return `
    <div class="singlePlant">
    <input type="hidden" class="plantId" value="${plant.id}">
<h1 class="plantName">${plant.name}</h1>
<img class="plantPhoto" src=${plant.photoLink}>
<p>${plant.careTips}</p>
<h3 class="maturityDay"> Days to maturity: ${plant.maturityDays}</h3>
<h3 class="height"> Height: ${plant.height}</h3>
<h3 class="sun"> Sun exposure: ${plant.sunExposure}</h3>
<h3 class="companion">Recommended Companion Plants: ${plant.companionPlants}</h3>




<button class ="clickForRecipeButton">Click for ${plant.name} recipes </button>

<h1>Recommended indoor start date: ${indoorCalcFrag(plant, d)}</h1>
<h1>Recommended outdoor start date:${d.toDateString()}</h1>
<button id="default-button">Calendar Button${calendarButton(indoorStartFrag(plant, d), plant, d)}</button>

</div>`;
  })
  .join("")}

  <h2>Nearest Reporting Weather Station: ${stationName}</h2>
  
</div>`;




}