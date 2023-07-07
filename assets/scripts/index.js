//pull in Dave's random functions
import Random from './Random.js';

//create references to all buttons in the game here.
const gameStartButton = document.querySelector("#game-start-button")
const continueFromIntroButton = document.querySelector("#continue-from-intro-button")

//create references to UI elements here
const statusMessageHolder = document.querySelector("#status-message")
const infoPanel = document.querySelector("#info-panel")
const actionPanel = document.querySelector("#action-panel")

//create references to all of the different activity screens
const travelActivityButton = document.querySelector("#activity-travel");
const dealActivityButton = document.querySelector("#activity-deal");
const loanActivityButton = document.querySelector("#activity-loan");
const bankActivityButton = document.querySelector("#activity-bank");
const viewStashButton = document.querySelector("#activity-stash");
const hospitalActivityButton = document.querySelector("#activity-hospital");
const upgradeShopActivityButton = document.querySelector("#activity-upgrade-shop");
const gunShopActivityButton = document.querySelector("#activity-gun-shop");

const activityButtons = [travelActivityButton,dealActivityButton,loanActivityButton,bankActivityButton]



//these holders are used to hold programmatically generated html i.e. a bunch of buttons
const travelButtonHolder = document.querySelector("#travel-buttons");
const dealButtonHolder = document.querySelector("#deal-buttons");
const activityButtonHolder = document.querySelector("#activity-buttons");

//this holds the name of the burrough in the activities panel (the one with buttons to indicate which activies are available in each burrough)
const activitiesInInfo = document.querySelector("#activities-in");


//create references fo all of the different action screens that the player can activate
const travelPanel = document.querySelector("#travel-panel");
const dealPanel = document.querySelector("#deal-panel");
const loanPanel = document.querySelector("#loan-panel");
const bankPanel = document.querySelector("#bank-panel");
const stashPanel = document.querySelector("#stash-panel");
const muggingPanel = document.querySelector("#mugging-panel");
const hospitalPanel = document.querySelector("#hospital-panel");
const upgradeShopPanel = document.querySelector("#upgrade-shop-panel");
const gunShopPanel = document.querySelector("#gun-shop-panel");


const topPanel = document.querySelector("#top-panel");

//this array refers to each of the panels. This is used to show / hide each panel on button clicks
//this array deliberately doesn't contain the lookingForYouPanel because that panel is handled differently i.e. it is triggered by game conditions and not from the player's actions
//i.e. this array contains all of the panels that the player can choose to activate. Panels which aren't activated by the player should not be placed in this array
const activityPanels = [travelPanel, dealPanel, loanPanel, bankPanel, stashPanel, hospitalPanel,upgradeShopPanel,gunShopPanel];

//create references to action screens that the player cannot activate i.e. that trigger from game states
const lookingForYouPanel = document.querySelector("#looking-for-you-panel")

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
    lookingForYouPanel.classList.add("hide"); 

})
dealActivityButton.addEventListener("click", event => {
    console.log("deal button clicked");
    showDealPanel();    
    lookingForYouPanel.classList.add("hide");
})
loanActivityButton.addEventListener("click", event => {
    console.log("loan button clicked");
    visitTony();
    hideAllActionPanels();
    loanPanel.classList.remove("hide");
    lookingForYouPanel.classList.add("hide");
})
bankActivityButton.addEventListener("click", event => {
    console.log("bank button clicked");
    hideAllActionPanels();
    bankPanel.classList.remove("hide");
    lookingForYouPanel.classList.add("hide");
    visitBank();
})
viewStashButton.addEventListener("click", event => {
    console.log("stash button clicked");
    printInventory();
    hideAllActionPanels();
    stashPanel.classList.remove("hide");
    lookingForYouPanel.classList.add("hide");
})

hospitalActivityButton.addEventListener("click", event => {
    console.log("hospital button clicked")
    hideAllActionPanels();
    lookingForYouPanel.classList.add("hide");
    visitHospital();
    hospitalPanel.classList.remove("hide");
    

});
upgradeShopActivityButton.addEventListener("click", event => {
    console.log("upgrade shop button clicked")
    hideAllActionPanels();
    lookingForYouPanel.classList.add("hide");
    upgradeShopPanel.classList.remove("hide");
});
gunShopActivityButton.addEventListener("click", event => {
    console.log("gun shop button clicked")
    hideAllActionPanels();
    lookingForYouPanel.classList.add("hide");
    visitGunShop();
    gunShopPanel.classList.remove("hide");
});

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
const bankUI = document.querySelector("#bank");
const healthUI = document.querySelector("#health")
const stashUI = document.querySelector("#stash")


let interestRate = 10; 
let currentLocation = 0; //this is an array index value that connects to "locations" which is an array of location objects

let statusMessage = "";


let burroughs = []; //this is an object that will contain additional info about each location e.g. services,  etc
let drugs = {};
let inventory = {};
let weapons = {};

//define player stats placeholders
let cash = 0;
let debt = 0;
let bank = 0;
let health = 0;
let maxHealth = 0;
let maxStash = 0;
let countHeld = 0;
let day = 0;
let dayOfUpsidedness = 4; //this is the day when tony's goons come find you
let healingCost = 100; //when determining the total healing cost, we take the delta between current and total healt and then multiply it by this factor

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
let smokesBuy = "";
let smokesSell = "";
let acidSell = "";
let acidBuy = "";
let cocaineBuy = "";
let cocaineSell = "";
let heroinBuy = "";
let heroinSell = "";
let subBuy = "";
let subSell = "";

//define drug price info placeholders
let cannabisInfo = "";
let shroomsInfo = "";
let boozeInfo = "";
let smokesInfo = "";
let acidInfo = "";
let cocaineInfo = "";
let heroinInfo = "";
let subInfo = "";



//define drug holding placeholders for the deals panel
let cannabisCountElement = "";
let shroomsCountElement = "";
let boozeCountElement = "";

//define a place to print the stash info
const stashInfoHolder = document.querySelector("#stash-info");

//define a place to print loanshark info
const loanInfoHolder = document.querySelector("#loan-info")

//define a place to print the bank account info
const bankInfoHolder = document.querySelector("#bank-info")

//define a place to print the mugging status + minigame
const muggingInfoHolder = document.querySelector("#mugging-info")

//define a place to print the hospital info + buttons
const hospitalInfoHolder = document.querySelector("#hospital-info")

//define a place to print thee gun shop info + buttons
const gunShopInfoHoldder = document.querySelector("#gun-shop-info")

const fightBackInfoHolder = document.querySelector("#fight-back-info");

//bank withdraw buttons
const withdraw10 = document.querySelector("#withdraw-10");
const withdraw25 = document.querySelector("#withdraw-25");
const withdraw100 = document.querySelector("#withdraw-100");

//bank withdraw listeners
withdraw10.addEventListener("click", event => {
    console.log(event.srcElement.id + " click");
    withdraw(10);
})
withdraw25.addEventListener("click", event => {
    console.log(event.srcElement.id + " click");
    withdraw(25);
})
withdraw100.addEventListener("click", event => {
    console.log(event.srcElement.id + " click");
    withdraw(100);
})

//bank deposit buttonss
const deposit10 = document.querySelector("#deposit-10");
const deposit25 = document.querySelector("#deposit-25");
const deposit100 = document.querySelector("#deposit-100");

//bank deposit listeners
deposit10.addEventListener("click", event => {
    console.log(event.srcElement.id + " click");
    deposit(10);
})
deposit25.addEventListener("click", event => {
    console.log(event.srcElement.id + " click");
    deposit(25);
})
deposit100.addEventListener("click", event => {
    console.log(event.srcElement.id + " click");
    deposit(100);
})


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
You need to raise $1M in 30 days...OR ELSE!</p>`

const introMessage = `<p>

You are flat broke.
<br /><br />
So, your cousin Pauly from Jersey introduces you to his "friend" Tony.
<br /><br />
Tony "generously" gives you a $2,500 loan.
<br /><br />
Tony says he's a reasonable guy, so he's only charging ${interestRate}% interest per day.
<br /><br />
With a big slap on the back, Tony says his guys will come find you in ${dayOfUpsidedness} days to see how you're doing.


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
        weapons = objects.weapons;
        console.log(objects.weapons[0]);

        console.log(inventory);
        console.log(burroughs)
        console.log(drugs);
        console.log(weapons);

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
        console.log("Manhattan click");
        travelClick(0);
    })
    harlemButton = document.querySelector("#harlem-button")
    harlemButton.addEventListener("click", event => {
        console.log("Harlem Click");
        travelClick(1);
    })

    bronxButton = document.querySelector("#bronx-button");
    bronxButton.addEventListener("click", event => {
        console.log("Bronx Click");
        travelClick(2);
    })

    brooklynButton = document.querySelector("#brooklyn-button");
    brooklynButton.addEventListener("click", event => {
        console.log("Brooklyn Click");
        travelClick(3);
    })

    queensButton = document.querySelector("#queens-button");
    queensButton.addEventListener("click", event => {
        console.log("Queens Click")
        travelClick(4);
        
    })

    console.log("travel button listeners added")
    

}

//travel between burroughs. Also progresses time and checks loan status. Also rolls for a chance to get mugged
const travelClick = destination => {
    console.log("Traveling to : " + burroughs[destination].name);
    currentLocation = destination;
    day++;
    let interest = debt * interestRate / 100
    let trimmedInterest = parseFloat(interest.toFixed(2));

    //travel makes the day count increase so add debt
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

    checkForMugging();
    
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

    
    //define the status message based on current burrough
    updateStatusMessage();

    //and unhide the UI Info Panel
    infoPanel.classList.remove("hide");
    //as well as the UI Action Panel
    actionPanel.classList.remove("hide");
    dealPanel.classList.remove("hide");
    topPanel.classList.add("sticky-div")
    continueFromIntroButton.classList.add("hide")
    
})

//call this method any time you want to update the printed UI info values
const updateInfoPanelStats = () => {
    cashUI.textContent = `$${cash.toLocaleString(undefined, { useGrouping: true })}`; //toLocaleString etc is a method to print a number e.g. $35,235.35
    bankUI.textContent = `$${bank.toLocaleString(undefined, { useGrouping: true })}`;
    let fixedDebt = debt.toLocaleString(undefined, { useGrouping: true });
    debtUI.textContent = `$${fixedDebt}`;
    healthUI.textContent = `${health} / ${maxHealth}`;
    stashUI.textContent = `${countHeld} / ${maxStash}`;
    console.log("UI values updated");

}

const updateStatusMessage = () => {
    statusMessage = `<p>It is Day ${day}.</p>`
    if (debt > 0) {
        statusMessage += `<p>Tony expects full payment by Day ${dayOfUpsidedness}</p>`
    }
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

    if (burroughs[currentLocation].services.hospital) {
        hospitalActivityButton.classList.remove("hide")
    } else {
        hospitalActivityButton.classList.add("hide")
    }

    if (burroughs[currentLocation].services.upgradeShop) {
        upgradeShopActivityButton.classList.remove("hide")
    } else {
        upgradeShopActivityButton.classList.add("hide")
    }

    if (burroughs[currentLocation].services.gunShop) {
        gunShopActivityButton.classList.remove("hide")
    } else {
        gunShopActivityButton.classList.add("hide")
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
        //console.log("Initiatlizing drug: " + drug.name)
        dealButtonHolder.insertAdjacentHTML("beforeend",
            `<div id="${drug.name}-deal" class="drug-deal">
                <h4 class="drug-name ${drug.name}-bg"> ${drug.name}</h3>
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
        buyDrug(1); //the integer we pass into buyDrugs must be equal to the index value of the relevant drug in the drugs array (which is, in turn, taken from the objects.json)
    })

    cannabisSell = document.querySelector("#cannabis-deal-sell");
    cannabisSell.addEventListener("click", event => {
        console.log("sell cannabis!")
        sellDrug(1);
    })
    
    shroomsBuy = document.querySelector("#shrooms-deal-buy");
    shroomsBuy.addEventListener("click", event => {
        console.log("buy shrooms!")
        buyDrug(2);
    })

    shroomsSells = document.querySelector("#shrooms-deal-sell");
    shroomsSells.addEventListener("click", event => {
        console.log("sell shrooms!")
        sellDrug(2);
    })

    boozeBuy= document.querySelector("#booze-deal-buy");
    boozeBuy.addEventListener("click", event => {
        console.log("buy booze!")
        buyDrug(0);
    })

    boozeSell = document.querySelector("#booze-deal-sell");
    boozeSell.addEventListener("click", event => {
        console.log("sell booze!")
        sellDrug(0);
    })

    //smokes is actually Chew-Z
    smokesBuy = document.querySelector("#smokes-deal-buy");
    smokesBuy.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        buyDrug(4);
    })

    smokesSell = document.querySelector("#smokes-deal-sell");
    smokesSell.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        sellDrug(4);
    });

    acidBuy = document.querySelector("#acid-deal-buy");
    acidBuy.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        buyDrug(3);
    });

    acidSell = document.querySelector("#acid-deal-sell");
    acidSell.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        sellDrug(3)
    });

    cocaineBuy = document.querySelector("#cocaine-deal-buy")
    cocaineBuy.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        buyDrug(5);
    });

    cocaineSell = document.querySelector("#cocaine-deal-sell");
    cocaineSell.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        sellDrug(5)
    });

    heroinBuy = document.querySelector("#heroin-deal-buy");
    heroinBuy.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        buyDrug(6)
    });
   
    heroinSell = document.querySelector("#heroin-deal-sell");
    heroinSell.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        sellDrug(6);
    });

    subBuy = document.querySelector("#sub-deal-buy");
    subBuy.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        buyDrug(7);
    });

    subSell = document.querySelector("#sub-deal-sell");
    subSell.addEventListener("click", event => {
        console.log(event.srcElement.id + " click");
        sellDrug(7);
    });

    cannabisInfo = document.querySelector("#Cannabis-price");
    shroomsInfo = document.querySelector("#Shrooms-price");
    boozeInfo = document.querySelector("#Bootleg");
    smokesInfo = document.querySelector("#Chew-Z-price");
    acidInfo = document.querySelector("#Acid-price");
    cocaineInfo = document.querySelector("#Cocaine-price");
    heroinInfo = document.querySelector("#Heroin-price");
    subInfo = document.querySelector("#Substance")

    cannabisCountElement = document.querySelector("#cannabis-deal-held");
    shroomsCountElement = document.querySelector("#shrooms-deal-held");
    boozeCountElement = document.querySelector("#booze-deal-held")
    console.log("Cannabis Count: " + cannabisCountElement.textContent);

    printDrugPrices();
    drugListInitialized = true;
}

//also print the inventory count for each drug
const printDrugPrices = () => {
    let drugInfoArray = [boozeInfo, cannabisInfo, shroomsInfo, acidInfo, smokesInfo, cocaineInfo, heroinInfo, subInfo];
    let index = 0;
    
    
    drugInfoArray.forEach(entry => {
        let name = drugs[index].name.toLowerCase();
        let average = inventory[name].average
        average = average.toFixed(2);
        //console.log("here we go now with " + name);
        entry.innerHTML = `
            <div class="flex justify-content-space-between width-100"><h3>$${drugs[index].buyPrice.toLocaleString(undefined, { useGrouping: true })}</h3><h3>  $${drugs[index].sellPrice.toLocaleString(undefined, { useGrouping: true }) }</h3></div>
            <div class="flex"><h5>Holding: </h5><h5 id="${drugs[index].id}-held" class="min-width">${inventory[name].count} @ $${average.toLocaleString(undefined, { useGrouping: true }) }</h5></div>`

            
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
        //console.log(inventory);
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

    
    if (debt > 0) {
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
    } else {
        loanInfoHolder.innerHTML = `
        <div class="loan-holder">
            <h3>Tony says, "Pleasure doin' business with ya. Thanks for being as honest and upstanding as I am."</h3>
            <h3>"Now get outta here before I take a piece of your action!"</h3>

        </div>
        `
    }
    

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
    let lookAttempts = Math.abs(dayOfUpsidedness - day) //look attempts increase day by day
    console.log("Sal the enforcer is looking for the player. Attempts: " + lookAttempts);
    lookingForYouPanel.innerHTML = ""; //initialize with an empty panel because below we're going to += a bunch of js

    //wait until the event loop is empty and then call this (i.e. timeout = 0). This ensures that the logic that handles the display / hiding of the different panels on travel click don't get in the way of hiding all and then showing the "Sal's looking for you" screen
    setTimeout(() => {
        activityPanels.forEach(panel => {
            console.log("looking for you so hiding all the panels")
            panel.classList.add("hide");
        }); 
    }, 0)

    let lookingString = ``;
    let locationString = `<p>You are in ${burroughs[currentLocation].name}.</p>`;
    let found = false;

    for (let lookAttempt = 0; lookAttempt < lookAttempts; lookAttempt++) {
        console.log("This is attempt #" + lookAttempt);
        //make a random int to represent the burrough that Sal will look in
        let burroughRND = Random.int(0, burroughs.length - 1);
        console.log("Burrough: " + burroughRND + " Current: " + currentLocation)
        console.log(`Sal Looked in ${burroughs[burroughRND].name}. You are in ${burroughs[currentLocation].name}`)
        lookingString += `<p>Sal Looked in ${burroughs[burroughRND].name}.</p>`
        //if that is also the burrough that the player is in, the player will be punished. If not, the player eludes Sal
        if (burroughRND !== currentLocation) {
            console.log("You managed to avoid Sal so far...")
            
        } else {
            console.error("Sal found you. Uh oh.")
            lookingString += `<br/>${locationString}<br/><br/><p>Uh oh...</p><br/><br/>`
            found = true;
            break //and we stop the execution of the loop
        }

        

    }

    if (found === false) {
        lookingString += `${locationString}<br/><p>You managed to avoid Sal!</p>`;
    } else {
        goUpsideYourHead(); //player has been caught by the mob enforcer while late on loan payment. Player gets punishsed
    }

    let baseString = `
            <p>Tony expects his money. You're late.</p><br/>
            <p>Sal's been lookin' for ya.</p><br/>`;

    let finalString = baseString + lookingString;
    lookingForYouPanel.innerHTML += finalString;

    console.log("printing final string")
    lookingForYouPanel.classList.remove("hide");
    
}

//this is what happens when Sal finds you and you're late on loan payment
const goUpsideYourHead = () => {

    activityButtonHolder.classList.add("hide"); //hide the activities panel to ensure the player reads the Upside Your Head panel and understands that they took damage.
                                                //this also allows the player to see the screen that has the info that killed them prior to taking them to the "you died" screen
    //make sure this happens only once the stack is clear. This feels like an abusive and wrong way to use this. Is that right? Let me know: dandectis@gmail.com lol
    setTimeout(() => {
        console.error("ouch!")
        const means = ["a tire iron", "a 5 iron", "a baseball bat", "these brass knuckes", "my size 13 boots"]
        let rnd = Random.int(0, means.length - 1);
        console.log(means[rnd] + " Rnd: " + rnd)
        let damage = Random.int(10,50)
        let upsideHead = `
            <p>Sorry, kid," Sal says, "But Tony expects his money. So I'm gonna have to go upside your head with ${means[rnd]} now. Nothing personal.</p><br/>
            <div id="continue-after-mob-hit" class="button" >"Ouch!" (-${damage} HP) <br/>"Was that really necessary, man?" (continue)</div>`


        health -= damage;
        
        updateInfoPanelStats();

        console.log(upsideHead);
        lookingForYouPanel.innerHTML += upsideHead;

        //the player will need to click the continue button in order to proceed away from this screen.
        const continueButton = document.querySelector("#continue-after-mob-hit");
        continueButton.addEventListener("click", () => {
            checkHealth(); //we check to see if the player has died before moving on

            //and turn the activity buttons back on if the player has not died
            i
        })
    },0)
    

}

const checkHealth = () => {
    if (health <= 0) {
        //hide the UI Info Panel
        infoPanel.classList.add("hide");
        //as well as the UI Action Panel
        actionPanel.classList.add("hide");
        dealPanel.classList.add("hide");
        statusMessageHolder.innerHTML = `
            <p>You died on day ${day}. Tough luck.</p>
            <div id="restart-game" class="button">Play Again</div> 
            `
        //grab a reference to the button you just created and then add a listener to make it refresh the page on click. This is my kludgy shortcut to starting a new game :)
        const playAgainButton = document.querySelector("#restart-game");
        playAgainButton.addEventListener("click", () => {
            location.reload(); //reload the page as a shortcut to starting a new game
        })

    }

    if (health > 0) {
        activityButtonHolder.classList.remove("hide");
        lookingForYouPanel.classList.add("hide");
    }
}

//brings up bank info
const visitBank = () => {
    console.log("Visiting bank")
    bankInfoHolder.innerHTML = `<p>You have $${bank} in the bank.`

}

const deposit = percent => {
    console.log("Depositing: " + percent);
    let depositAmount = cash * percent / 100;
    bank += depositAmount;
    cash -= depositAmount;
    updateInfoPanelStats();
    visitBank();
}

const withdraw = percent => {
    console.log("Withdrawing: " + percent);
    let withdrawAmount = bank * percent / 100;
    bank -= withdrawAmount;
    cash += withdrawAmount;
    updateInfoPanelStats();
    visitBank();
}

//you should also bake the police chase trigger into this method
const checkForMugging = () => {

    let cashFactor = cash / 1500;
    let inventoryFactor = countHeld / 4;
    let muggingChanceScore = cashFactor + inventoryFactor; //this factor determines how likely the player is to get mugged. The idea is to have money and stash contribute to the chance, but without making it too overpowered.
    if (muggingChanceScore > 60) {
        muggingChanceScore = 60;
    }

    if (muggingChanceScore < 5) {
        muggingChanceScore = 5;
    }

    let mugChance = Random.int(0, 100);
    console.log("Mugging CashFactor: " + cashFactor + " InventoryFactor: " + inventoryFactor);
    console.log("Mugging Liklihood: " + muggingChanceScore + " Roll For Mugging: " + mugChance);
    if (mugChance < muggingChanceScore) {
        fightOrFlight();
    }
}

//logic to allow the player to fight back or escape

const fightOrFlight = () => {
    //placeholder pass through function for now
    //playerMugged(); //remove me

    //check to see if the player has any weapons
    const playerHasWeapon = weapons.some((weapon) => weapon.playerHas === true);
    console.log("Player Has Weapon? " + playerHasWeapon);

    setTimeout(() => {
        activityButtonHolder.classList.add("hide")
        activityPanels.forEach(panel => {
            console.log("mugging you so hiding all the panels")
            panel.classList.add("hide");
        });
    }, 0)

    fightBackInfoHolder.innerHTML = ``; //clear any text left over from any previous mugging

    let ammo = 0;
    let canYouFightString = ``;
    let bestWeaponHeld = ""
    let yourOptionsAre = ``;
    let fightString = ``;

    if (playerHasWeapon) {
        //figure out the best weapon that the player is carrying and determine how many shots it gives the player
        weapons.forEach(weapon => {
            if (weapon.playerHas) {
                bestWeaponHeld = weapon.name;
                ammo = weapon.shots;
            }
        })

        console.log("You've got this many shots: " + ammo)
        canYouFightString = `<p>Good thing you're armed with your trusty ${bestWeaponHeld}.</p>`
        fightString = `<div id="fight" class="button">Shoot his ass!</div>`

    } else {
        canYouFightString = `<p>And you are unarmed!</p>`
    }

    yourOptionsAre += `
        <br/>
        <h4>Your Options are:</h4>    
        ${fightString}
        <div id="run-away" class="button">RUN AWAY!</div>
        <div id="surrender" class="button">Surrender</div>`


    muggingInfoHolder.innerHTML = `
        <p>On your way out of the subway, you got mugged!</p>
        <br/>
        ${canYouFightString}`

    //create a reference to the mugging button parent object
    const muggingButtonsHolder = document.querySelector("#mugging-buttons")
    muggingButtonsHolder.classList.remove("hide");
    muggingButtonsHolder.innerHTML = yourOptionsAre
    muggingPanel.classList.remove("hide");
    //running away has 3 possible outcomes: failure (mugged) / partial success (you drop drugs) / success (you escape with no loss)

    //create references to the fight / flight option buttons
    const fightButton = document.querySelector("#fight");
    const runButton = document.querySelector("#run-away")
    const surrenderButton = document.querySelector("#surrender")

    //add listeners to the fight or flight options buttons. The "fight" button will only exist when the player has a weapon in their inventory
    try {
        fightButton.addEventListener("click", event => {
            console.log("fight button clicked");
            fightBack(ammo, bestWeaponHeld);
        })
    } catch {
        console.log("there's no fight button to add an event listner to")
    }

    runButton.addEventListener("click", event => {
        
        console.log("run away button clicked")
        runAway();
    })

    surrenderButton.addEventListener("click", event => {
        muggingButtonsHolder.innerHTML = ""; //clear the "your options are" buttons because the player just surrendered
        playerMugged();
        console.log("surrender button clicked")
    })


    //fighting back will see the player shoot at the assailant and the assailtn attack the player in return.
    //each turn the player can fight back or run
    //they will lose HP when the attacker shoots them. They can die
    //player can surrender to avoid dropping to 0 HP (be advised that HP are currently drained in the playerMugged section)

    
}

const fightBack = (shots, bestWeaponHeld) => {
    console.log("fighting back. You're gonna take " + shots + " shots")
    let shotOrShots = "";
    if (shots > 1) {
        shotOrShots = "shots"
    } else {
        shotOrShots = "shot"
    }

    fightBackInfoHolder.innerHTML = ``;
    fightBackInfoHolder.innerHTML = `<br/><p>You can take ${shots} ${shotOrShots}.</p>`

    let playerHitTarget = false;

    for (let attempt = 0; attempt < shots; attempt++) {
        console.log("Shot Atempt: " + attempt);
        fightBackInfoHolder.innerHTML += `<br/><p>BLAM!!</p>`
        let accuracy = Random.int(0, 100) //roll a random shot value
        let hitThreshold = 25;

        if (accuracy < hitThreshold) {

            playerHitTarget = true;
            console.log("shot #" + attempt + "hit him!");
            console.log("you got away!")

            const muggingButtonsHolder = document.querySelector("#mugging-buttons")
            muggingButtonsHolder.classList.add("hide"); //hide the "your options are" panel, because the player just got away

            const insultList = ["piece of shit", "son of a bitch", "mother fucker", "asshole"]
            let rnd = Random.int(0, insultList.length - 1);

            fightBackInfoHolder.innerHTML += `
                <br/><p>You hit that ${insultList[rnd]}!<br/><br/> You were able to get away.</p><br/>
                <div id="continue-after-fight-button" class="button">Serves him right! (continue)</div>`

            const continueAfterFightButton = document.querySelector("#continue-after-fight-button");
            continueAfterFightButton.addEventListener("click", event => {
                fightBackInfoHolder.innerHTML = "";

                muggingPanel.classList.add("hide");
                activityButtonHolder.classList.remove("hide");
            })

            break
        } else { 
            fightBackInfoHolder.innerHTML += `<p>Oh, damn. You missed!</p>`
            
            console.log("shot #" + attempt + " missed!")
        }
    }

    if (!playerHitTarget) {
        setTimeout(() => {
            getShotAt();
        }, 100)
        
    }
    
}

const runAway = () => {
    const muggingButtonsHolder = document.querySelector("#mugging-buttons")
    muggingInfoHolder.innerHTML = `<h4>RUN AWAY!</h4>`
    fightBackInfoHolder.innerHTML = ``;

    //these 3 params determine how the chase goes
    let catchThreshold = 25; // % chance that the mugger will catch the player and proceed to the mugging screen
    
    let persistanceThreshold = 50; // finally this is the % chance that the mugger keeps chasing the player

    //see if the mugger caught the player
    let catchChance = Random.int(0, 100);
    console.log("player is running away")
    muggingInfoHolder.innerHTML += `<br/><p>You turn and run like hell!</p>`
    if (catchChance < catchThreshold) {
        console.error("mugger caught the player")
        muggingInfoHolder.innerHTML += `</br><p>But you were not fast enough...</p>`
        
        muggingButtonsHolder.innerHTML = "";
        playerMugged();
        return
    }

    //the mugger (and possibly later police officer?) shoots at the player
    getShotAt();

    
    //then we check to see if they are still chasing the player
    let persistenceChance = Random.int(0, 100);
    if (persistenceChance < persistanceThreshold) {
        fightBackInfoHolder.innerHTML += `<br/><p>He's still chasing you! What are you gonna do?</p>`
    } else {
        fightBackInfoHolder.innerHTML += `<br/><p>You got away!</p><br/>`
        muggingButtonsHolder.innerHTML = `<div id="continue" class="button">Oh, thank goodness. (continue)</div>`

        const continueButton = document.querySelector("#continue");
        continueButton.addEventListener("click", event => {
            activityButtonHolder    .classList.remove("hide");
            muggingPanel.classList.add("hide");
        })
    }
    
}

const getShotAt = () => {
    //if they didn't catch the player, mugger takes a shot at the player. Chance to lose HP
    console.log("getting shot at");
    let shotChance = Random.int(0, 100);
    let shotHitThreshold = 50; // assuming the mugger doesn't catch the player, they shoot at the player. This is the % chance that they hit
    

    fightBackInfoHolder.innerHTML += `<br/><p>Look out! They're shooting at you!</p>`

    console.log("mugger is shooting at the player")
    if (shotChance < shotHitThreshold) {
        console.error("player got shot!")
        let damage = Random.int(10, 25);
        fightBackInfoHolder.innerHTML += `<br/><p>You're hit! Ouch! -${damage} HP</p>`
        health -= damage
        updateInfoPanelStats();
    } else {
        fightBackInfoHolder.innerHTML += `<br/><p>But that son of a bitch missed!</p>`
    }
}

//handles mugging info
const playerMugged = () => {
    console.error("oh shit! You're getting mugged!");
        
    

    let totalLoss = 0;

    //go through each drug in the inventory and take half of it away (maybe make this random instead of hardcoded to 0.5)
    for (const drug in inventory) {
        //console.log("Drug Name: " + drug + " " + inventory[drug].count)
        if (inventory[drug].count > 0) {
            let loss = Math.round(inventory[drug].count * 0.5);
            totalLoss += loss;
            inventory[drug].count -= loss;
            console.log(drug + " loss: " + loss)
        }
    }

    //subtract the total drugs lost in the mugging from the inventory count
    countHeld -= totalLoss;

    //randomize an amount of cash to lose in the mugging
    let percentRobbed = Random.float(0.33, 0.66);
    let robbedTotal = Math.round(cash * percentRobbed)
    
    cash -= robbedTotal;

    let damage = Random.int(5, 50);
    health -= damage;

    //print info about the outcome
    muggingInfoHolder.innerHTML += `
        
        <br/><p>Those bastards took ${totalLoss} units from your stash</p>
        <p>You lost ${damage} HP in the struggle</p>
        <p>They also took $${robbedTotal.toLocaleString(undefined, { useGrouping: true })} from your bill fold.</p>
        <br/>
        <div id="continue-from-mugging" class="button">Well, that sucked. (continue)</div>`
    

    updateInfoPanelStats();

    const continueButton = document.querySelector("#continue-from-mugging");
    continueButton.addEventListener("click", event => {
        muggingPanel.classList.add("hide");
        activityButtonHolder.classList.remove("hide");
    })
        

        
    
}

//create the inner HTML (including buttons) for the hospital functionality
const visitHospital = () => {
    console.log("visiting hospital");
    let appraisalString = "";

    //check the player's health to determine how the doctor responds
    if(health === maxHealth){
        appraisalString = "There's nothing wrong with you. Get the fuck outta here! I oughta charge you just for wasting my time"
    }
    if (health >= 90 && health < maxHealth) {
        appraisalString = "You came here for that? Take this bandaid and stop wasting my time"
    } else if (health < 90 && health >= 70) {
        appraisalString = "That's nothing. Take some ibuprofen and stop wasting my time"
    } else if (health < 70 && health >= 50) {
        appraisalString = "Kids these days. They break a few bones and they think it's the end of the world. Buck of softies. Take these painkillers and get outta my sight."
    } else if (health < 50 && health >= 30) {
        appraisalString = "It's just a flesh wound. I've seen worse. Take this super glue and apply it to the dangling appendages. And stop being so dramatic."
    } else if (health < 30) {
        appraisalString = "Oh, damn. You're pretty fucked up. Let me take care of you."
    } else if (health === 0){
        appraisalString = "Uh, I'm not sure how to tell you this, but you're actually dead."
    }

   
    
    //calculate the cost to heal (and format it e.g. $1,234.56)
    let healCost = (maxHealth - health) * healingCost;
    let formattedHealCost = healCost.toLocaleString(undefined, { useGrouping: true });
    //also generate a description string and a placeholder to later hold a button to heal the player
    let costString = ``;
    let healButtonString = ``;


    
    //if the player is at full health, cost to heal and the healing button remain empty
    if (health < maxHealth) {
        
        costString = `I'm gonna need $${formattedHealCost} to patch you up.`
        healButtonString = `<div id="heal-button" class="button">Okay, doc (pay the fee)</div>`
    }

    //print the hospital info
    hospitalInfoHolder.innerHTML = `
    <div class="padding-bottom-4">
        <h2>${burroughs[currentLocation].name} Medical</h2>
    </div>
    <p>If you have $$$ we have HP. If you're broke, fuck off! What, you think healthcare is a human right of something?*</p>
    <br/>
    <p>The doc takes one look at you and says, "${appraisalString}."</p>
    <br/>
    <p>${costString} </p>
    <br/>
    ${healButtonString}

        
    <div class="small-text padding-top-8">*healthcare is, of course, a human right. I'm making a joke here!</div>
    `
    //only do things with the healButton when health is < max i.e. when that button is sure to exist
    //there's certainly a more elegant way to handle this e.g. try catch. But this works for now
    if (health < maxHealth) {
        const healButton = document.querySelector("#heal-button");
        console.log("HealButton: " + healButton);
        healButton.addEventListener("click", event => {
            console.log("heal button click");
            if (cash > healCost) {
                health = maxHealth;
                cash -= healCost;
                hospitalInfoHolder.innerHTML = `<p>Thank you for supporting our for-profit healthcare enterprise!</p><p><br/> Should you encounter more trauma (while still having have the funds to afford it), we'll be here for you.`
                updateInfoPanelStats();
            }

        })
    }
        
}

const visitGunShop = () => {
    console.log("visiting gun shop");
    gunShopInfoHoldder.innerHTML = ``
    //generate a button for each gun
    weapons.forEach(gun => {
        //but only if the player doesn't already have that gun in their possession
        let playerHas = false;
        playerHas = gun.playerHas;
        //console.log(gun);
        //console.log(playerHas)
        if (gun.playerHas !== true) {
            //console.log(gun.name + " " + gun.cost)
            gunShopInfoHoldder.insertAdjacentHTML("beforeend", `
        <div id="buy-${gun.id}" class="button justify-content-space-between padding-inline-5"><h2>${gun.name.toUpperCase()}</h2><h2>$${gun.cost.toLocaleString(undefined, { useGrouping: true })}</h2></div>
        `)
        }
        
    })

    const gunShopStatusMessage = document.querySelector("#gun-shop-status-message");

    const buyPistolButton = document.querySelector("#buy-pistol")
    const buyShotgunButton = document.querySelector("#buy-shotgun")
    const buyUziButton = document.querySelector("#buy-uzi")
    const buyPlasmaRifleButton = document.querySelector("#buy-plasma")

    //add listeners to the buy buttons, if they exist
    try {
        buyPistolButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyGun(0)
        })
    } catch {
        console.log("Buy Pistol Button doesn't exist because the player has already bought it")
    }

    try {
        buyShotgunButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyGun(1)
        })
    } catch {
        console.log("Buy Shotgun Button doesn't exist because the player has already bought it")
    }

    try {
        buyUziButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyGun(2)
        })
    } catch {
        console.log("Buy Uzi Button doesn't exist because the player has already bought it")
    }

    try {
        buyPlasmaRifleButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyGun(3)
        })
    } catch {
        console.log("Buy Plasma Rifle doesn't exist because the player has already bought it")
    }
    
    
    

    const buyGun = (gun) => {
        
        //check to see if the player has enough money to buy the gun
        if (cash >= weapons[gun].cost) {
            console.log("buying " + weapons[gun].name)
            gunShopStatusMessage.innerHTML = `<br/><p>Enjoy your ${weapons[gun].name}. Use it in good health. <br/>Good health for you, anyway heh heh heh.`
            cash -= weapons[gun].cost;
            weapons[gun].playerHas = true;
            updateInfoPanelStats();
            visitGunShop(); //to update the visible buttons i.e. remove the button that the player just bought

        } else {
            console.error("insufficient funds");
            
            gunShopStatusMessage.innerHTML = `<br/><p>You ain't got the money for that ${weapons[gun].name}! <br/>Put that shit down and quit Wasting my time!</p>`
        }
    }
}

//this logic runs on page load
loadObjectsJSON(); //and load the JSON objects for things like locations
printWelcomeMessage(); //put the intro message on the screen


//to add a new drug:
//add placeholder entries at the top
//add entries in "initializeDrugList"
//add json info - both in the drug category and then again in the inventory (you should probably generate the inventory dynamically based on a forEach of the names of the drugs in the drug list)

//TODO:
//the bones upgrade shop and are in place. Flesh them out
//it's possible to have tony find you and get mugged at the same time. Make that not be possible
//Add the county office where you can pay off the loan on grandma's house
//add auto save functionality
//use that functionality to add a high score system
//add special events when the prices are really high or really low
//add cops that chase you. More chance to get chased the more profit you make
//add a "highest / lowest" seen thing on the market
//add a shop so you can get some upgrades e.g. weapons and inventory