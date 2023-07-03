
//create references to all buttons in the game here.
const gameStartButton = document.querySelector("#game-start-button")
const continueFromIntroButton = document.querySelector("#continue-from-intro-button")

//create references to UI elements here
const statusMessageHolder = document.querySelector("#status-message")
const statusHeading = document.querySelector("#status-header") //once the player clears the intro tabs, this STATUS heading appears in the status box that had up to that point been used for the intro text
const infoPanel = document.querySelector("#info-panel")
const actionPanel = document.querySelector("#action-panel")
const travelButtonHolder = document.querySelector("#travel-buttons")

//references to player stats on the UI info panel
const cashUI = document.querySelector("#cash")
const debtUI = document.querySelector("#debt")
const healthUI = document.querySelector("#health")
const stashUI = document.querySelector("#stash")


let interestRate = 5; 
let currentLocation = 0; //this is an array index value that connects to "locations" which is an array of location objects

const welcomeMessage = `<p>Oh, man. <br/><br/>The county tax assessor 
says Grandma is gonna lose the house. 
<br />
<br />
Also the house is an orphanage. 
<br />
<br />
For kittens and puppies.
<br /><br />
You need to raise $100K in 30 days...OR ELSE!</p>`

const introMessage = `<p>

You are flat broke.
<br /><br />
So, your cousin Pauly from Jersey introduces you to his "friend" Tony.
<br /><br />
Tony "generously" gives you a $5,000 loan.
<br /><br />
Tony says he's a reasonable guy, so he's only charging ${interestRate}% interest per day.
<br /><br />
With a big slap on the back, Tony says his guys will come find you in a week to see how you're doing.


</p>`

let statusMessage = "";


let burroughs = {};

let cash = 0;
let debt = 0;
let health = 0;
let maxHealth = 0;
let stashSize = 0;
let countHeld = 0;


const printWelcomeMessage = () => {
    statusMessageHolder.innerHTML = welcomeMessage;
}

//load a JSON that contains data to use in the game
const loadObjectsJSON = async() => {
    try {
        const response = await fetch('./assets/scripts/objects.json');
        const objects = await response.json();

        burroughs = objects.locations; //grab the location objects from the objects master list
        

        burroughs.forEach(burrough => {
            console.log("This one is: " + burrough.name)
            //create a button for each burrough
            travelButtonHolder.insertAdjacentHTML("beforeend",
                `<div class="button" id="${burrough.name}-button">Travel to ${burrough.name}`)
        })
        
        console.log(objects.playerInfo);
        //load the game variables from the json
        cash = objects.playerInfo.cash;
        debt = objects.playerInfo.debt;
        health = objects.playerInfo.maxHealth;
        maxHealth = objects.playerInfo.maxHealth;
        stashSize = objects.playerInfo.stashSize;
        updateInfoPanelStats(); //and print their values
        
             
    } catch (error) {
        console.error("Error loading JSON file:", error);
    }
    

}


//game start button click
gameStartButton.addEventListener("click", event => {
    console.log("start button clicked");
    statusMessageHolder.innerHTML = introMessage;



    continueFromIntroButton.classList.remove("hide")

    gameStartButton.classList.add("hide")

})

//continue from intro click - this is where the game actually begins
continueFromIntroButton.addEventListener("click", event => {
    console.log("continue from intro button clicked");

    statusHeading.classList.remove("hide");
    //define the status message based on current burrough
    let statusMessage = `<p>You are currently in ${burroughs[0].name}</p>`

    //and print that message
    statusMessageHolder.innerHTML = statusMessage;

    //and unhide the UI Info Panel
    infoPanel.classList.remove("hide");
    //as well as the UI Action Panel
    actionPanel.classList.remove("hide");

    continueFromIntroButton.classList.add("hide")
})

//call this method any time you want to update the printed UI info values
const updateInfoPanelStats = () => {
    cashUI.textContent = `$${cash}`;
    debtUI.textContent = `$${debt}`;
    healthUI.textContent = `${health} / ${maxHealth} MAX`;
    stashUI.textContent = `${countHeld} / ${stashSize} MAX`;
    console.log("UI values updated");

}









//this logic runs on page load
printWelcomeMessage(); //put the intro message on the screen
loadObjectsJSON(); //and load the JSON objects for things like locations

