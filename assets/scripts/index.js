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
const viewStashButton = document.querySelector("#activity-stash")

const activityButtons = [travelActivityButton,dealActivityButton,loanActivityButton,bankActivityButton]

console.log("Bank: " + bankActivityButton)

//these holders are used to hold programmatically generated html i.e. a bunch of buttons
const travelButtonHolder = document.querySelector("#travel-buttons");
const dealButtonHolder = document.querySelector("#deal-buttons");

const activitiesInInfo = document.querySelector("#activities-in");


//create references fo all of the different action screens
const travelPanel = document.querySelector("#travel-panel");
const dealPanel = document.querySelector("#deal-panel");
const loanPanel = document.querySelector("#loan-panel");
const bankPanel = document.querySelector("#bank-panel");
const stashPanel = document.querySelector("#stash-panel");

const activityPanels = [travelPanel, dealPanel, loanPanel, bankPanel, stashPanel];

const moveMaximumPossibleToggle = document.querySelector("#moveMaximumProduct");
let moveMaximumPossible = false;
moveMaximumPossibleToggle.addEventListener("change", event => {
    console.log("change detected");
    console.log(event.srcElement.checked)
    moveMaximumPossible = event.srcElement.checked;
})

//handle activity button clicks
travelActivityButton.addEventListener("click", event => {
    console.log("travel button clicked");
    hideAllActionPanels();
    travelPanel.classList.remove("hide");

})
dealActivityButton.addEventListener("click", event => {
    console.log("deal button clicked");
    showDealPanel();    
})
loanActivityButton.addEventListener("click", event => {
    console.log("loan button clicked");
    visitTony();
    hideAllActionPanels();
    loanPanel.classList.remove("hide");
})
bankActivityButton.addEventListener("click", event => {
    console.log("bank button clicked");
    hideAllActionPanels();
    bankPanel.classList.remove("hide");
})
viewStashButton.addEventListener("click", event => {
    console.log("stash button clicked");
    printInventory();
    hideAllActionPanels();
    stashPanel.classList.remove("hide");
})

const showDealPanel = () => {
    hideAllActionPanels();
    dealPanel.classList.remove("hide");
}

const hideAllActionPanels = () => {
    activityPanels.forEach(panel => {
        panel.classList.add("hide")
    })
}



//references to player stats on the UI info panel
const cashUI = document.querySelector("#cash")
const debtUI = document.querySelector("#debt")
const healthUI = document.querySelector("#health")
const stashUI = document.querySelector("#stash")


let interestRate = 10; 
let currentLocation = 0; //this is an array index value that connects to "locations" which is an array of location objects

let statusMessage = "";


let burroughs = []; //this is an object that will contain additional info about each location e.g. services,  etc
let drugs = {};
let inventory = {};

//define player stats placeholders
let cash = 0;
let debt = 0;
let health = 0;
let maxHealth = 0;
let maxStash = 0;
let countHeld = 0;
let day = 0;
let dayOfUpsidedness = 1; //this is the day when tony's goons come find you

//define travel button placeholders
let manhattanButton = "";
let harlemButton = "";
let bronxButton = "";
let brooklynButton = "";
let queensButton = "";

//define drug buy and sell button placeholders
let cannabisBuy = "";
let cannabisSell = "";
let shroomsBuy = "";
let shroomsSells = "";
let boozeBuy = "";
let boozeSell = "";

//define drug price info placeholders
let cannabisInfo = "";
let shroomsInfo = "";
let boozeInfo = "";

//define drug holding placeholders for the deals panel
let cannabisCountElement = "";
let shroomsCountElement = "";
let boozeCountElement = "";

//define a place to print the stash info
const stashInfoHolder = document.querySelector("#stash-info");

//define a place to print loanshark info
const loanInfoHolder = document.querySelector("#loan-info")



let drugListInitialized = false;


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
Tony "generously" gives you a $2,500 loan.
<br /><br />
Tony says he's a reasonable guy, so he's only charging ${interestRate}% interest per day.
<br /><br />
With a big slap on the back, Tony says his guys will come find you in a week to see how you're doing.


</p>`


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
        drugs = objects.drugs;
        inventory = objects.playerInfo.inventory;

        console.log(inventory);
        console.log(burroughs)
        console.log(drugs)

        console.log(inventory);

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
        maxStash = objects.playerInfo.maxStash;
        
             
    } catch (error) {
        console.error("Error loading JSON file:", error);
    }

    updateInfoPanelStats(); //and print their values
    createTravelButtons();
    randomizeDrugPrices();
    listAvailableActivities();
    

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

//travel between burroughs. Also progresses time and checks loan status
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
    if (debt > 0 && day > dayOfUpsidedness) {
        console.error("Tony's loan is overdue!! Sal is looking for you")
        lookForYou();
    }
    showDealPanel(); //bring up the deal panel after a the player travels to a new burrough
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
    dealPanel.classList.remove("hide");

    continueFromIntroButton.classList.add("hide")
})

//call this method any time you want to update the printed UI info values
const updateInfoPanelStats = () => {
    cashUI.textContent = `$${cash}`;
    debtUI.textContent = `$${debt.toFixed(2)}`;
    healthUI.textContent = `${health} / ${maxHealth}`;
    stashUI.textContent = `${countHeld} / ${maxStash}`;
    console.log("UI values updated");

}

const updateStatusMessage = () => {
    statusMessage = `<p>It is Day ${day}.</p>`
    statusMessageHolder.innerHTML = statusMessage;
}

const listAvailableActivities = () => {
    console.log("listing available activities for: " + burroughs[currentLocation].name)
    
    activitiesInInfo.textContent = `Activities in ${burroughs[currentLocation].name}`
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


const randomizeDrugPrices = () => {
    console.log("randomizing drug prices");
    
    //you've got an array called drugs
    drugs.forEach(drug => {
        //randomize the price of each drug in that array based on the min and max price parameters found in objects.json
        drug.sellPrice = Random.int(drug.minPrice, drug.maxPrice) //randomize the sell price
        drug.buyPrice = (drug.sellPrice * 1.1); //calculate a buy price that's a bit more expensive
        drug.buyPrice = parseFloat(drug.buyPrice.toFixed(0)); //get rid of the digits after the decimal for the buy price
        console.log(drug.name + " " + drug.sellPrice)
    })

    if (!drugListInitialized) {
        initializeDrugList();
    } else {
        //a method to update the drug prices each day
        printDrugPrices();
    }
    
}


//run this code only once. It will create the list of drugs adn attach listeners to the buttons on that list
//add new drugs here
const initializeDrugList= () => {
    
    drugs.forEach(drug => {
        //creates an HTML template for each drug. Creates everything here so that listeners can then be attached
        //the inner portion (with ${drug.name}) is then overwritten in printDrugPrices() which is called at the end of this method
        dealButtonHolder.insertAdjacentHTML("beforeend",
            `<div id="${drug.name}-deal" class="drug-deal">
                <h4 class="drug-name"> ${drug.name}</h3>
                <div class="flex width-100">
                    <div id="${drug.id}-buy" class="button height-50">Buy</div>
                    <div id=${drug.name}-price class="drug-listing width-100"><div class="flex"><h3>$${drug.buyPrice}</h3><div class="flex"></div><h3>$${drug.sellPrice}</h3></div><h3>Holding: </h3><h3 id="${drug.id}-held">0</h3></div>
                    <div id="${drug.id}-sell" class="button height-50">Sell</div>
                </div>
            </div>`);

    })

    //attach listeners sbuy and sell buttons for each drug
    cannabisBuy = document.querySelector("#cannabis-deal-buy");
    cannabisBuy.addEventListener("click", event => {
        console.log("buy cannabis!")
        buyDrug(0); //the integer we pass into buyDrugs must be equal to the index value of the relevant drug in the drugs array (which is, in turn, taken from the objects.json)
    })

    cannabisSell = document.querySelector("#cannabis-deal-sell");
    cannabisSell.addEventListener("click", event => {
        console.log("sell cannabis!")
        sellDrug(0);
    })
    
    shroomsBuy = document.querySelector("#shrooms-deal-buy");
    shroomsBuy.addEventListener("click", event => {
        console.log("buy shrooms!")
        buyDrug(1);
    })

    shroomsSells = document.querySelector("#shrooms-deal-sell");
    shroomsSells.addEventListener("click", event => {
        console.log("sell shrooms!")
        sellDrug(1);
    })

    boozeBuy= document.querySelector("#booze-deal-buy");
    boozeBuy.addEventListener("click", event => {
        console.log("buy booze!")
        buyDrug(2);
    })

    boozeSell = document.querySelector("#booze-deal-sell");
    boozeSell.addEventListener("click", event => {
        console.log("sell booze!")
        sellDrug(2);
    })
    

    cannabisInfo = document.querySelector("#Cannabis-price");
    shroomsInfo = document.querySelector("#Shrooms-price");
    boozeInfo = document.querySelector("#Bootleg");

    cannabisCountElement = document.querySelector("#cannabis-deal-held");
    shroomsCountElement = document.querySelector("#shrooms-deal-held");
    boozeCountElement = document.querySelector("#booze-deal-held")
    console.log("Cannabis Count: " + cannabisCountElement.textContent);

    printDrugPrices();
    drugListInitialized = true;
}

//also print the inventory count for each drug
const printDrugPrices = () => {
    let drugInfoArray = [cannabisInfo, shroomsInfo, boozeInfo];
    let index = 0;
    
    
    drugInfoArray.forEach(entry => {
        let name = drugs[index].name.toLowerCase();
        console.log("here we go now with " + name);
        entry.innerHTML = `
            <div class="flex justify-content-space-between width-100"><h3>$${drugs[index].buyPrice}</h3><h3>  $${drugs[index].sellPrice}</h3></div>
            <div class="flex"><h3>Holding: </h3><h3 id="${drugs[index].id}-held" class="min-width">${inventory[name].count} @ $${inventory[name].average}</h3></div>`

            
        index++;
    })
    index = 0;
    

}

//take in an index value to match to the drugs array and then handle the logic to buy one unit of a drug
const buyDrug = drugIndex => {

    let index = drugIndex;
    let currentPrice = drugs[drugIndex].buyPrice;
    let name = drugs[drugIndex].name.toLowerCase();

    console.log("Player is trying to buy " + name + " for " + currentPrice)

    //check to see if the player has the money and space to buy another unit
    if (cash > currentPrice && countHeld < maxStash) {
        console.log("buying!");
        //add 1 unit of the relevant drug to the inventory and calculate the unit price
        inventory[name].count++;
        inventory[name].cost += currentPrice
        inventory[name].average = inventory[name].cost / inventory[name].count;
        countHeld++;
        cash -= currentPrice;
        console.log(inventory);
        updateInfoPanelStats();
        printDrugPrices();

        //"move maximum possible" tries to buy / sell the max amount permitted by cash or by inventory
        if (moveMaximumPossible) {
            buyDrug(index); //so run this method again
        } 
    } else {
        console.error("insufficient funds or capacity to buy another unit of " + name)
    }
    
}

//take in an index value to match to the drugs array and then handle the logic to sell one unit of a drug. Uses the same pattern as buyDrug
const sellDrug = drugIndex => {
    let index = drugIndex;
    let currentPrice = drugs[drugIndex].sellPrice;
    let name = drugs[drugIndex].name.toLowerCase();

    console.log("Player is trying to sell " + name + " for " + currentPrice)
    if (inventory[name].count > 0) {
        console.log("selling " + name)
        //subtract 1 unit of the relevant drug to the inventory and calculate the unit price
        inventory[name].count--;
        inventory[name].cost -= currentPrice
        inventory[name].average = inventory[name].cost / inventory[name].count;
        if (inventory[name].count === 0) {
            inventory[name].cost = 0
            inventory[name].average = 0;
        }
        countHeld--;
        cash += currentPrice;
        console.log(inventory);
        updateInfoPanelStats();
        printDrugPrices();
        if (moveMaximumPossible) {
            sellDrug(index);
        }
    } else {
        console.error("no more " + name + " in inventory")
    }

}

//print the stash details
const printInventory = () => {
    console.log("Printing Inventory");
    stashInfoHolder.innerHTML = "";
    let i = 0;
    for (const key in inventory) {
        console.log(key + ": " + inventory[key].count)
        stashInfoHolder.insertAdjacentHTML("beforeend",
            `<div class="stash-card">
                <h3 class="drug-name">${drugs[i].name}</h3>
                <div class="flex column align-items-flex-end">
                    <h3>Holding: ${inventory[key].count}</h3>
                    <h3>Avg: $${inventory[key].average}</h3>
                </div>

            </div>`)
        i++;
    }
}

const visitTony = () => {
    console.log("Generating Tony's Info");
    let loanDaysRemaining = dayOfUpsidedness - day;
    let dayOrDays = "";
    if (loanDaysRemaining > 1 || loanDaysRemaining === 0) {
        dayOrDays = "days"
    } else {
        dayOrDays = "day"
    }

    

    loanInfoHolder.innerHTML =
        `<div class="loan-holder">
            <h3>Tony expects payment in ${loanDaysRemaining} ${dayOrDays}</h3>
            <h3>Debt: $${debt}</h3>
            <br />
            <div id="pay-500" class="button">Pay $500</div>
        </div>
        `

    let pay500Button = document.querySelector("#pay-500");
    pay500Button.addEventListener("click", () => {
        payDebt();
    })

}

const payDebt = () => {

    //check debt levels and subtract 500 if > 500 remaining, or subtract remaining if not
    if (debt >= 500 && cash >= 500) {
        debt -= 500;
        cash -= 500;
    } else if (debt < 500 && debt > 0) {
        debt -= debt;
        cash -= debt;
    } else if (debt < 0) {
        console.error("no debt left to pay, numbskull!")        
    }

    

    let yet = "";
    
    if (debt > 0) {
        yet = "...yet";
    } else {
        yet = "";
    }
    let paymentMessage = `<p>Sal behind the bar takes the envelope containing your money. 

He says, "Tony'll be real glad you came by to pay him his money. And I'm glad because that means I don't gotta go upside your head${yet}"</p>`
    console.log(paymentMessage);
    updateInfoPanelStats();
    visitTony();

}

//this is where Sal is looking for you because you are late on your loan payment
const lookForYou = () => {
    console.log("Sal is looking")
    let lookAttempts = Math.abs(dayOfUpsidedness - day)
    console.log("Attempts: " + lookAttempts);

    for (let lookAttempt = 0; lookAttempt < lookAttempts; lookAttempt++) {
        console.log("This is attempt #" + lookAttempt);
        //make a random int to represent the burrough that Sal will look in
        let burroughRND = Random.int(0, burroughs.length);
        console.log(`Sal Looked in ${burroughs[burroughRND].name}. You are in ${burroughs[currentLocation].name}`)

        //if that is also the burrough that the player is in, the player will be punished. If not, the player eludes Sal
        if (burroughRND !== currentLocation) {
            console.log("You managed to avoid Sal!")
        } else {
            console.error("Sal found you. Uh oh.")
            goUpsideYourHead(); //player has been caught by the mob enforcer while late on loan payment. Player gets punishsed
            return //and we stop the execution of the loop
        }
    }
    
}

//this is what happens when Sal finds you and you're late on loan payment
const goUpsideYourHead = () => {
    console.error("ouch!")
}

//this logic runs on page load
loadObjectsJSON(); //and load the JSON objects for things like locations
printWelcomeMessage(); //put the intro message on the screen


//to add a new drug:
//add placeholder entries at the top
//add entries in "initializeDrugList"
//add json info - both in the drug category and then again in the inventory (you should probably generate the inventory dynamically based on a forEach of the names of the drugs in the drug list)