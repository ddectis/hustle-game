//pull in Dave's random functions
import Random from './Random.js';

//create references to all buttons in the game here.
const gameStartButton = document.querySelector("#game-start-button")
const continueFromIntroButton = document.querySelector("#continue-from-intro-button")

//create references to UI elements here
const statusMessageHolder = document.querySelector("#status-message")
const statusHeading = document.querySelector("#status-header") //once the player clears the intro tabs, this STATUS heading appears in the status box that had up to that point been used for the intro text
const infoPanel = document.querySelector("#info-panel")
const actionPanel = document.querySelector("#action-panel")

//create references to all of the different activity screens
const travelActivityButton = document.querySelector("#activity-travel");
const dealActivityButton = document.querySelector("#activity-deal");
const loanActivityButton = document.querySelector("#activity-loan");
const bankActivityButton = document.querySelector("#activity-bank")

const activityButtons = [travelActivityButton,dealActivityButton,loanActivityButton,bankActivityButton]

console.log("Bank: " + bankActivityButton)

const travelButtonHolder = document.querySelector("#travel-buttons")

//create references fo all of the different action screens
const travelPanel = document.querySelector("#travel-panel");
const dealPanel = document.querySelector("#deal-panel");
const loanPanel = document.querySelector("#loan-panel");
const bankPanel = document.querySelector("#bank-panel");

const activityPanels = [travelPanel, dealPanel, loanPanel, bankPanel];

//references to player stats on the UI info panel
const cashUI = document.querySelector("#cash")
const debtUI = document.querySelector("#debt")
const healthUI = document.querySelector("#health")
const stashUI = document.querySelector("#stash")


let interestRate = 10; 
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


let burroughs = {}; //this is an object that will contain additional info about each location e.g. services,  etc

//define player stats placeholders
let cash = 0;
let debt = 0;
let health = 0;
let maxHealth = 0;
let stashSize = 0;
let countHeld = 0;
let day = 0;

//define travel button placeholders
let manhattanButton = "";
let harlemButton = "";
let bronxButton = "";
let brooklynButton = "";
let queensButton = "";

let cannabisPrice = 0;
const cannabisPriceUI = document.querySelector("#cannabis-price")

const printWelcomeMessage = () => {
    statusMessageHolder.innerHTML = welcomeMessage;
}

//load a JSON that contains data to use in the game
//other game initialization logic is triggered here after the json is loaded
const loadObjectsJSON = async() => {
    try {
        const response = await fetch('./assets/scripts/objects.json');
        const objects = await response.json();

        burroughs = objects.locations; //grab the location objects from the objects master list

        console.log(burroughs)

        burroughs.forEach(burrough => {
            console.log("Createing Travel Button for: " + burrough.name)
            //create a button for each burrough
            travelButtonHolder.insertAdjacentHTML("beforeend",
                `<div class="button" id="${burrough.name.toLowerCase()}-button">Travel to ${burrough.name}`)
            
        })

        
        console.log(objects.playerInfo);
        //load the game variables from the json
        cash = objects.playerInfo.cash;
        debt = objects.playerInfo.debt;
        health = objects.playerInfo.maxHealth;
        maxHealth = objects.playerInfo.maxHealth;
        stashSize = objects.playerInfo.stashSize;
        
             
    } catch (error) {
        console.error("Error loading JSON file:", error);
    }

    updateInfoPanelStats(); //and print their values
    createTravelButtons();
    randomizeDrugPrices();
    

}

//create references to the travel buttons and add listeners. Listeners should call a univeral travel function that takes a value in to point the travel destination
const createTravelButtons = () => {
    manhattanButton = document.querySelector("#manhattan-button")
    manhattanButton.addEventListener("click", event => {
        travelClick(0);
        console.log("Manhattan click")
    })
    harlemButton = document.querySelector("#harlem-button")
    harlemButton.addEventListener("click", event => {
        travelClick(1);
        console.log("Harlem Click");
    })

    bronxButton = document.querySelector("#bronx-button");
    bronxButton.addEventListener("click", event => {
        travelClick(2);
        console.log("Bronx Click")
    })

    brooklynButton = document.querySelector("#brooklyn-button");
    brooklynButton.addEventListener("click", event => {
        travelClick(3)
        console.log("Brooklyn Click")
    })

    queensButton = document.querySelector("#queens-button");
    queensButton.addEventListener("click", event => {
        travelClick(4);
        console.log("Queens Click")
    })

    console.log("travel button listeners added")
    

}

const travelClick = destination => {
    console.log("Traveling to : " + burroughs[destination].name);
    currentLocation = destination;
    day++;
    let interest = debt * interestRate / 100
    let trimmedInterest = parseFloat(interest.toFixed(2));
    
    debt += trimmedInterest; //make sure you are only adding numbers with 2 digits after the deci
    console.log("Interest: " + interest);
    updateStatusMessage();
    updateInfoPanelStats();
    listAvailableActivities();
    randomizeDrugPrices();

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
    updateStatusMessage();

    //and unhide the UI Info Panel
    infoPanel.classList.remove("hide");
    //as well as the UI Action Panel
    actionPanel.classList.remove("hide");

    continueFromIntroButton.classList.add("hide")
})

//call this method any time you want to update the printed UI info values
const updateInfoPanelStats = () => {
    cashUI.textContent = `$${cash}`;
    debtUI.textContent = `$${debt.toFixed(2)}`;
    healthUI.textContent = `${health} / ${maxHealth}`;
    stashUI.textContent = `${countHeld} / ${stashSize}`;
    console.log("UI values updated");

}

const updateStatusMessage = () => {
    statusMessage = `<p>It is Day ${day}. You are currently in ${burroughs[currentLocation].name}</p>`
    statusMessageHolder.innerHTML = statusMessage;
}

const listAvailableActivities = () => {
    console.log("listing available activities for: " + burroughs[currentLocation].name)
    if (burroughs[currentLocation].services.bank) {
        bankActivityButton.classList.remove("hide")
    } else {
        bankActivityButton.classList.add("hide")
    }

    if (burroughs[currentLocation].services.deal) {
        dealActivityButton.classList.remove("hide")
    } else {
        dealActivityButton.classList.add("hide")
    }

    if (burroughs[currentLocation].services.loanShark) {
        loanActivityButton.classList.remove("hide")
    } else {
        loanActivityButton.classList.add("hide")
    }

    if (burroughs[currentLocation].services.travel) {
        travelActivityButton.classList.remove("hide")
    } else {
        travelActivityButton.classList.add("hide")
    }
}


//handle activity button clicks

travelActivityButton.addEventListener("click", event => {
    console.log("travel button clicked");
    hideAllActionPanels();
    travelPanel.classList.remove("hide");

})
dealActivityButton.addEventListener("click", event => {
    console.log("deal button clicked");
    hideAllActionPanels();
    dealPanel.classList.remove("hide");
})
loanActivityButton.addEventListener("click", event => {
    console.log("loan button clicked");
    hideAllActionPanels();
    loanPanel.classList.remove("hide");
})
bankActivityButton.addEventListener("click", event => {
    console.log("bank button clicked");
    hideAllActionPanels();
    bankPanel.classList.remove("hide");
})

const hideAllActionPanels = () => {
    activityPanels.forEach(panel => {
        panel.classList.add("hide")
    })
}

const randomizeDrugPrices = () => {
    console.log("randomizing drug prices");
    let rnd = Random.int(50, 500)

    cannabisPrice = rnd;
    console.log("Rand: " + cannabisPrice);


    printDrugPrices();
}

const printDrugPrices = () => {
    cannabisPriceUI.textContent = `$${cannabisPrice}`
}

//this logic runs on page load
printWelcomeMessage(); //put the intro message on the screen
loadObjectsJSON(); //and load the JSON objects for things like locations
