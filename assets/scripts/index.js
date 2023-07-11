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
const countyActivytButton = document.querySelector("#activity-county")

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
const countyPanel = document.querySelector("#county-panel");

const marketStatusPopup = document.querySelector("#market-status-popup")


const topPanel = document.querySelector("#top-panel");

//define a place to print the panel info for each action panel panel
const stashInfoHolder = document.querySelector("#stash-info");
const loanInfoHolder = document.querySelector("#loan-info")
const bankInfoHolder = document.querySelector("#bank-info")
const muggingInfoHolder = document.querySelector("#mugging-info")
const hospitalInfoHolder = document.querySelector("#hospital-info")
const gunShopInfoHoldder = document.querySelector("#gun-shop-info")
const fightBackInfoHolder = document.querySelector("#fight-back-info");
const countyInfoHolder = document.querySelector("#county-info");
const shopInfoHolder = document.querySelector("#upgrade-shop-info")


//this array refers to each of the panels. This is used to show / hide each panel on button clicks
//this array deliberately doesn't contain the lookingForYouPanel because that panel is handled differently i.e. it is triggered by game conditions and not from the player's actions
//i.e. this array contains all of the panels that the player can choose to activate. Panels which aren't activated by the player should not be placed in this array
const activityPanels = [travelPanel, dealPanel, loanPanel, bankPanel, stashPanel, hospitalPanel,upgradeShopPanel,gunShopPanel,countyPanel];

//create references to action screens that the player cannot activate i.e. that trigger from game states
const lookingForYouPanel = document.querySelector("#looking-for-you-panel")
const endOfGamePanel = document.querySelector("#end-of-game-panel")

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
    visitShop();
});
gunShopActivityButton.addEventListener("click", event => {
    console.log("gun shop button clicked")
    hideAllActionPanels();
    lookingForYouPanel.classList.add("hide");
    visitGunShop();
    gunShopPanel.classList.remove("hide");
});
countyActivytButton.addEventListener("click", event => {
    console.log("county office clicked");
    hideAllActionPanels();
    
    visitCountyOffice();
    countyPanel.classList.remove("hide");
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
const bankUI = document.querySelector("#bank");
const healthUI = document.querySelector("#health")
const stashUI = document.querySelector("#stash")

let currentLocation = 0; //this is an array index value that connects to "locations" which is an array of location objects

let statusMessage = "";

let burroughs = []; //this is an object that will contain additional info about each location e.g. services,  etc
let drugs = {};
let inventory = {};
let weapons = {};
let upgrades = {};

//define player stats placeholders
let cash = 0;
let debt = 0;
let bank = 0;
let health = 0;
let maxHealth = 0;
let maxStash = 0;
let countHeld = 0;
let day = 0;
let dayOfUpsidedness = 7; //this is the day when tony's goons come find you
let healingCost = 300; //when determining the total healing cost, we take the delta between current and total healt and then multiply it by this factor
let toalDaysInGame = 30;
let interestRate = 20; 
let grandmasTaxesPaid = false; //The main objective is to turn this value to true by way of paying the $1M in back taxes. 

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
let drugPriceNewsString = ``; //this string will be used to store drug price announcements in the status bar e.g. price crash or skyrocket

//create a reference to the settings button and then attach 
const settingsPanel = document.querySelector("#settings-panel")
const settingsButton = document.querySelector("#settings-button")
const closeSettingsButton = document.querySelector("#close-settings-button")
settingsButton.addEventListener("click", event => {
    toggleSettingsPanel();
})
closeSettingsButton.addEventListener("click", event => {
    toggleSettingsPanel();
})

const toggleSettingsPanel = () => {
    actionPanel.classList.toggle("hide");
    settingsPanel.classList.toggle("hide");
    closeSettingsButton.classList.toggle("hide")
}

const viewHighScoresButton = document.querySelector("#view-highscores-button")
viewHighScoresButton.addEventListener("click", event => {
    printHighScores();
})

//create a place to store the theme colors loaded in objects.json
let themeColors = [];

//create references to the visual theme buttons. Listeners will be added in the loadJSON method, because you want the listeners to have the correct values for the theme colors from the json
const standardThemeButton = document.querySelector("#standard-theme-button")
const lightThemeButton = document.querySelector("#light-theme-button");
const orangeThemeButton = document.querySelector("#orange-theme-button");
const blueThemeButton = document.querySelector("#blue-theme-button");

const cssReference = document.querySelector("#stylesheet");


let playerStats = []; //player stats will be recorded here every turn. This data will be used to make graphs



const welcomeMessage = `<p>Oh, man. <br/><br/>The Queens county tax assessor 
says Grandma is gonna lose the house. 
<br />
<br />
Also the house is an orphanage. 
<br />
<br />
For kittens and puppies.
<br /><br />
You need to raise $1,000,000 in 30 days...OR ELSE!</p>
<div class="actions"><p><b><u>Goal:</u> Go to the Queens County Assessor's Office and Pay Grandma's tax bill</b></p></div>`

const introMessage = `<p>

You are flat broke.
<br /><br />
So, your cousin Pauly from Jersey introduces you to his "friend" Tony.
<br /><br />
Tony "generously" gives you a $2,500 loan.
<br /><br />
Tony says he's a reasonable guy, so he's only charging ${interestRate}% interest per day. Plus a very modest flat rate convenience fee surcharge. 
<br /><br />
With a big slap on the back, Tony says his guys will come find you in ${dayOfUpsidedness} days to see how you're doing.


</p>`


const printWelcomeMessage = () => {
    console.log("printing welcome message")
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
        upgrades = objects.upgrades;
        themeColors = objects.themes;

        console.log(themeColors);
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
                `<div class="button padding-block-5" id="${burrough.name.toLowerCase()}-button">Travel to ${burrough.name}`)
            
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


    //and then add listeners to make the theme buttons do something
    standardThemeButton.addEventListener("click", event => {
        console.log("standard theme button clicked");
        //changeVisualTheme(0)
        cssReference.href = "./assets/style/style.css"
    })
    lightThemeButton.addEventListener("click", event => {
        console.log("light theme button clicked");
        //changeVisualTheme(1)
        cssReference.href = "./assets/style/style-light.css"
    })
    orangeThemeButton.addEventListener("click", event => {
        console.log("orange theme button clicked");
        cssReference.href = "./assets/style/style-orange.css"
    })
    blueThemeButton.addEventListener("click", event => {
        console.log("blue theme button clicked");
        cssReference.href = "./assets/style/style-blue.css"
    })

    loadGame(); //check to see if the player has a game in progress
    updateInfoPanelStats(); //and print their values
    createTravelButtons();
    randomizeDrugPrices();
    listAvailableActivities();
    

}

const changeVisualTheme = (themeNumber) => {
    console.log("loading theme: " + themeNumber)
    console.log(themeColors[themeNumber].backgroundColor)

    let backgroundColor = themeColors[themeNumber].backgroundColor;
    let textColor = themeColors[themeNumber].textColor;
    let buttonBackgroundColor = themeColors[themeNumber].buttonBackgroundColor;
    let buttonTextColor = themeColors[themeNumber].buttonTextColor;
    let buttonShadowColor = themeColors[themeNumber].buttonDropShadowColor;
    let drugNameBackgroundColor = themeColors[themeNumber].storeColor;

    //add references to all of the element you'll need to change. Group them into arrays so you can forEach over them to change the CSS
    const bodyElement = document.querySelector("body")
    const buttonElements = document.querySelectorAll(".button")
    console.log(buttonElements)

    //the body and the text on all the buttons are the same color
    //the body text and the button background are the same color
    bodyElement.style.color = textColor;
    bodyElement.style.backgroundColor = backgroundColor;
    buttonElements.forEach(button => { //buttonElements is a node list, so you have to iterate over it
        button.style.color = buttonTextColor;
        button.style.backgroundColor = buttonBackgroundColor;
        let boxShadowString = `${buttonShadowColor} 3px 5px 0px`
        console.log(boxShadowString);
        button.style.boxShadow = boxShadowString;
    })

    const uiHolders = document.querySelectorAll(".ui-holder")
    console.log(uiHolders)
    uiHolders.forEach(holder => {
        console.log(holder)
        holder.style.borderColor = textColor;
    })

    marketStatusPopup.style.borderColor = textColor;
    marketStatusPopup.style.backgroundColor = backgroundColor;

    const actionHolders = document.querySelectorAll(".actions")
    actionHolders.forEach(holder => {
        holder.style.borderColor = textColor;
    })

    const drugDealElements = document.querySelectorAll(".drug-deal")
    drugDealElements.forEach(deal => {
        deal.style.outlineColor = textColor;
    })

    const drugDealNameBackgroundElements = document.querySelectorAll(".drug-name")
    drugDealNameBackgroundElements.forEach(drug => {
        drug.style.backgroundColor = drugNameBackgroundColor;
    })

    topPanel.style.borderColor = textColor;
    topPanel.style.backgroundColor = backgroundColor;
    infoPanel.style.borderColor = textColor;

    console.log("Background Color: " + backgroundColor)
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

    recordPlayerStats();

    day++;
    let interest = debt * interestRate / 100
    let trimmedInterest = parseFloat(interest.toFixed(0));

    //travel makes the day count increase so add debt
    debt += trimmedInterest; //make sure you are only adding numbers with 2 digits after the deci
    console.log("Interest: " + interest);

    checkDay(); //check to see if the game is over or not
    updateInfoPanelStats(); //update the printed stats values e.g. cash, debt, health etc
    listAvailableActivities(); //based on which burrough you are in, different activities will be available. This method handles that show / hide behavior
    randomizeDrugPrices(); 
    updateStatusMessage(); //if any exceptional drug prices were rolled, they will be printed here
   
    showDealPanel(); //bring up the deal panel after a the player travels to a new burrough
}

const recordPlayerStats = () => {
    console.log("recording player stats")
    let totalEarned = cash + bank;
    //record the day's information
    let stats = {
        "totalEarned": totalEarned,
        "stash": countHeld
    }
    playerStats.push(stats);
    console.log(playerStats)
    //add it to the player stats array

}

const checkDay = () => {
    if (day <= toalDaysInGame) {
        console.log("the game is not over. It continues.")
        if (debt > 0 && day > dayOfUpsidedness) {
            console.error("Tony's loan is overdue!! Sal is looking for you")
            lookForYou();
        }

        checkForMugging();

    } else {
        setTimeout(() => {
            activityButtonHolder.classList.add("hide");
            hideAllActionPanels();
            topPanel.classList.add("hide");
            travelPanel.classList.add("hide");
            gameOver();
        }, 0);
        
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


    initializeGame();
    
})

const initializeGame = () => {
    const title = document.querySelector("#title")
    title.classList.add("hide")
    settingsPanel.classList.add("hide")
    settingsPanel.classList.add("ui-padding")

    //define the status message based on current burrough
    updateStatusMessage();

    //and unhide the UI Info Panel
    infoPanel.classList.remove("hide");
    //as well as the UI Action Panel
    actionPanel.classList.remove("hide");
    dealPanel.classList.remove("hide");
    topPanel.classList.add("sticky-div")
    continueFromIntroButton.classList.add("hide")
}


let firstUpdatePointPassed = false
//call this method any time you want to update the printed UI info values
const updateInfoPanelStats = () => {
    cashUI.textContent = `$${cash.toLocaleString(undefined, { useGrouping: true })}`; //toLocaleString etc is a method to print a number e.g. $35,235.35
    bankUI.textContent = `$${bank.toLocaleString(undefined, { useGrouping: true })}`;
    let fixedDebt = debt.toLocaleString(undefined, { useGrouping: true });
    debtUI.textContent = `$${fixedDebt}`;
    healthUI.textContent = `${health} / ${maxHealth}`;
    stashUI.textContent = `${countHeld} / ${maxStash}`;
    console.log("UI values updated");

    //updateStatsChart();


    //generally when we update the info panel, we also want to save the game. However, we do not want to save the game when we first set the UI. This logic handles that
    if (firstUpdatePointPassed) {
        saveGame(); //also save the game every time we update the stats. This seems like a good place to place this call as we're updating the stats every time the state changes
    }
    firstUpdatePointPassed = true;
}

const updateStatusMessage = () => {
    statusMessage = `<p>It is Day ${day} of ${toalDaysInGame}.</p>`
    if (debt > 0) {
        statusMessage += `<p>Tony expects full payment by Day ${dayOfUpsidedness}</p>`
    }
    statusMessage += drugPriceNewsString;
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

    if (burroughs[currentLocation].services.county) {
        countyActivytButton.classList.remove("hide")
    } else {
        countyActivytButton.classList.add("hide")
    }


}


const randomizeDrugPrices = () => {
    console.log("randomizing drug pricesfor day# " + day);
    drugPriceNewsString = ``;
    //you've got an array called drugs
    drugs.forEach(drug => {
        
        let minPrice = drug.minPrice;
        let maxPrice = drug.maxPrice;

        let priceRandomizer = Random.int(0, 100);
        console.log(drug.name + " price index: " + priceRandomizer)
        if (priceRandomizer <= 1) {
            console.log(drug.name + " price crash!")
            drugPriceNewsString += `<p><b><u>${drug.name} prices have crashed!</u></b></p>`
            maxPrice = minPrice; //make the old minimum be the new maximum
            minPrice *= 0.33; //and then decrease the minimum
            
        }
        if (priceRandomizer >= 99) {
            console.log(drug.name + " price skyrockets!")
            drugPriceNewsString += `<p><b><u>${drug.name} prices have skyrocketed!</u></b></p>`
            minPrice = maxPrice; //make the old max the new min 
            maxPrice *= 2;   //and define and even lower new min value
        }

        //randomize the price of each drug in that array based on the min and max price parameters found in objects.json
        drug.sellPrice = Random.int(minPrice, maxPrice) //randomize the sell price
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
        //the inner portion (with ${drug.name) is then overwritten in printDrugPrices() which is called at the end of this method
        //console.log("Initiatlizing drug: " + drug.name)
        dealButtonHolder.insertAdjacentHTML("beforeend",
            `<div id="${drug.name}-deal" class="drug-deal">
                <h4 class="drug-name ${drug.name}-bg"> ${drug.name}</h3>
                <div class="flex width-100">
                    <div id="${drug.id}-buy" class="button height-50 margin-bottom-10">Buy</div>
                    <div id=${drug.name}-price class="drug-listing width-100"><div class="flex"><h3>$${drug.buyPrice}</h3><div class="flex"></div><h3>$${drug.sellPrice}</h3></div><h3>Holding: </h3><h3 id="${drug.id}-held">0</h3></div>
                    <div id="${drug.id}-sell" class="button height-50 margin-bottom-10">Sell</div>
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
        //console.log("Here's the inventory:")
        //console.log(inventory)
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

//create a variable to keep track of how many units are bought / sold when the player has the "buy / sell max" toggle enabled
let countMoved = 0
let totalCost = 0;

//take in an index value to match to the drugs array and then handle the logic to buy one unit of a drug
const buyDrug = drugIndex => {

    let index = drugIndex;
    let currentPrice = drugs[drugIndex].buyPrice;
    let name = drugs[drugIndex].name.toLowerCase();


    console.log("Player is trying to buy " + name + " for " + currentPrice)

    //check to see if the player has the money and space to buy another unit
    if (cash > currentPrice && countHeld < maxStash) {
        console.log("buying!");

        //keep track of the total inventory moved & the price
        countMoved++;
        totalCost += currentPrice;

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
        } else {
            showMarketPopup(countMoved, name, totalCost); //the player is only buying 1 unit, so send it to the status popup now
        }
    } else { //the player is done buying max or they didn't have enough capacity to buy another unity
        console.error("insufficient funds or capacity to buy another unit of " + name)
        showMarketPopup(countMoved, name, totalCost);
    }

    

    
}

//take in an index value to match to the drugs array and then handle the logic to sell one unit of a drug. Uses the same pattern as buyDrug
//really this function and buyDrug could be refactored into a moveDrug method that takes a parameter in to determine if it's a buy or sell operation. There's so much repeating in here
const sellDrug = drugIndex => {
    let index = drugIndex;
    let currentPrice = drugs[drugIndex].sellPrice;
    let name = drugs[drugIndex].name.toLowerCase();

    console.log("Player is trying to sell " + name + " for " + currentPrice)
    if (inventory[name].count > 0) {
        console.log("selling " + name)

        //keep track of the cumulative count moved & total cost
        countMoved--;
        totalCost += currentPrice

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
        } else {
            showMarketPopup(countMoved, name, totalCost);
        }
    } else {
        console.error("no more " + name + " in inventory")
        showMarketPopup(countMoved, name, totalCost);
    }
    
}

//put a timed pop up on screen to show the player what just happened with their purchase attempt
const showMarketPopup = (printCount, nameReceived, cost) => {
    console.log("PrintCount: " + printCount + " Name: " + nameReceived)
    countMoved = 0;
    totalCost = 0;

    let formattedCost = cost.toLocaleString(undefined, { useGrouping: true });

    //this method takes positive and negative values for printCount and uses that to determine if the user bought or sold. So we take the abs value if printCount is < 0 so we print a positive number of units sold
    let absCount = 0;
    if (printCount < 0) {
        absCount = Math.abs(printCount)
    }

    marketStatusPopup.innerHTML = ``;
    if (printCount < -1) {
        marketStatusPopup.innerHTML = `You sold ${absCount} units of ${nameReceived} for $${formattedCost}`
    }
    if (printCount === -1) {
        marketStatusPopup.innerHTML = `You sold ${absCount} unit of ${nameReceived} for $${formattedCost}`
    }
    if (printCount === 0) {
        marketStatusPopup.innerHTML = `You did not buy or sell anything. Do you have the space, funds or inventory?`
    } else if (printCount === 1) {
        marketStatusPopup.innerHTML = `You bought ${printCount} unit of ${nameReceived} for $${formattedCost}`
    } else if (printCount > 1) {
        marketStatusPopup.innerHTML = `You bought ${printCount} units of ${nameReceived} for $${formattedCost}`
    }

    
    marketStatusPopup.classList.remove("hide");
    setTimeout(() => {
        console.log("time out expired");
        marketStatusPopup.classList.add("hide")
    }, 2500)
    
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
            <h3>Tony expects payment in ${loanDaysRemaining} ${dayOrDays}.</h3>
            <div class="actions">
                <h3>Debt: $${debt}</h3>
                <br />
                <div id="pay-500" class="button">Pay $500</div>
                <br/><div id="pay-max" class="button">Pay $${debt.toLocaleString(undefined, { useGrouping: true })}</div>
            </div>
        </div>
        `

        let pay500Button = document.querySelector("#pay-500");
        pay500Button.addEventListener("click", () => {
            payDebt();
        })

        const payMaxButton = document.querySelector("#pay-max");
        payMaxButton.addEventListener("click", event => {
            if (cash > debt) {
                cash -= debt;
                debt = 0;
                updateInfoPanelStats();
                visitTony();
            }
        })

    } else {
        loanInfoHolder.innerHTML = `
        <div class="loan-holder">
            <p>Tony says, "Pleasure doin' business with ya. Thanks for being as honest and upstanding as I am."</p>
            <p>"Now get outta here before I take a piece of your action!"</p>

        </div>
        `
    }
    

}

//this is a silly method that should have been rewritten
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
            checkHealth(`Sal the enforcer went upside your head with his ${means[rnd]}`); //we check to see if the player has died before moving on

            //and turn the activity buttons back on if the player has not died
            activityButtonHolder.classList.remove("hide");
        })
    },0)
    

}

const checkHealth = causeOfPain => {
    if (health <= 0) {
        //the player just died, so remove the saved game
        localStorage.removeItem("savedGame");

        //the death message gets printed in the status panel which hitherto had been stuck to the top of the page. Bring it back into the middle for the death message
        topPanel.classList.remove("sticky-div") 

        //hide the UI Info Panel
        infoPanel.classList.add("hide");

        //as well as the UI Action Panel
        actionPanel.classList.add("hide");
        dealPanel.classList.add("hide");

        let didYouPayTaxes = ``
        if (!grandmasTaxesPaid) {
            didYouPayTaxes = `
                <br/><p>Tough luck. Grandma lost the house and you lost your life.</p>
                <br/><p>Your attempt was a total failure.</p>
                <br/><p>Also those puppies and kitties were counting on YOU, man!</p>`

        } else {
            didYouPayTaxes = `
                <br/><p>Tough luck. At least you managed to save Grandma's house.</p>
                <br/><p>And all those orphans and those fuzzy critters too.</p>
                <br/><p>But you lost your life in the process. Bummer.</p>`
        }

        //define the death message and print it at the same time
        statusMessageHolder.innerHTML = `
            <p>You died on day ${day}. </p>
            <br/><p>Cause of death: ${causeOfPain}.</p>
            ${didYouPayTaxes}
           
            
            <br/><div id="restart-game" class="button">I think you'd better try again</div> 
            `
        //grab a reference to the button you just created and then add a listener to make it refresh the page on click. This is my kludgy shortcut to starting a new game :)
        const playAgainButton = document.querySelector("#restart-game");
        playAgainButton.addEventListener("click", () => {
            location.reload(); //reload the page as a shortcut to starting a new game
        })

    }

    if (health > 0) {
        //activityButtonHolder.classList.remove("hide");
        lookingForYouPanel.classList.add("hide");
    }
}

//brings up bank info
const visitBank = () => {
    console.log("Visiting bank")
    bankInfoHolder.innerHTML = `<p>You have $${bank} in the bank.`

}

//handles banking deposits
const deposit = percent => {
    console.log("Depositing: " + percent);
    let depositAmount = Math.round(cash * percent / 100);
    bank += depositAmount;
    cash -= depositAmount;
    updateInfoPanelStats();
    visitBank();
}

//handles banking withdrawals
const withdraw = percent => {
    console.log("Withdrawing: " + percent);
    let withdrawAmount = Math.round(bank * percent / 100);
    bank -= withdrawAmount;
    cash += withdrawAmount;
    updateInfoPanelStats();
    visitBank();
}

//this method is called every time the player moves around
const checkForMugging = () => {

    let cashFactor = cash / 10000; //every $10,000 in the player's inventory increases the chances of a mugging by 1%
    let inventoryFactor = countHeld / 4; //every 4 inventory units held increases the chances of a mugging by 1%
    let muggingChanceScore = cashFactor + inventoryFactor; //this factor determines how likely the player is to get mugged. The idea is to have money and stash contribute to the chance, but without making it too overpowered.
    if (muggingChanceScore > 60) {
        muggingChanceScore = 60;
    }

    
    if (muggingChanceScore < 5) {
        muggingChanceScore = 5;
    }

    //this line ensures you get mugged every time. Use only for testing. Be sure to turn off when you actually want to play the game
    //muggingChanceScore = 100;
    
    let mugChance = Random.int(0, 100);
    console.log("Mugging CashFactor: " + cashFactor + " InventoryFactor: " + inventoryFactor);
    console.log("Mugging Liklihood: " + muggingChanceScore + " Roll For Mugging: " + mugChance);
    if (mugChance < muggingChanceScore) {
        activityButtonHolder.classList.add("hide");
        fightOrFlight();
    }
}

//the player can fight back but only if they have a weapon
const checkIfPlayerHasWeapon = () => {
    return weapons.some((weapon) => weapon.playerHas === true);
    
}

//the player decides if they want to fight back or run
const fightOrFlight = () => {
    //placeholder pass through function for now
    //playerMugged(); //remove me

    //check to see if the player has any weapons
    const playerHasWeapon = checkIfPlayerHasWeapon();
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

//if the player tries to fight back, this method is used
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
        fightBackInfoHolder.innerHTML = ``;
        setTimeout(() => {
            fightBackInfoHolder.innerHTML += `<br/><p>BLAM!!</p>`
        }, 100)
        
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
            setTimeout(() => {
                fightBackInfoHolder.innerHTML += `
                <br/><p>You hit that ${insultList[rnd]}!<br/><br/> You were able to get away.</p><br/>
                <div id="continue-after-fight-button" class="button">Serves him right! (continue)</div>`
                const continueAfterFightButton = document.querySelector("#continue-after-fight-button");
                continueAfterFightButton.addEventListener("click", event => {
                    fightBackInfoHolder.innerHTML = "";

                    muggingPanel.classList.add("hide");
                    activityButtonHolder.classList.remove("hide");
                })
            },150)
            


            break
        } else {
            fightBackInfoHolder.innerHTML += `<p>Oh, damn. You missed!</p>`

            console.log("shot #" + attempt + " missed!")
        }
    }

    if (!playerHitTarget) {
        setTimeout(() => {
            getShotAt();
        }, 200)

    }

}

//when the player runs away, this method is used
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
            activityButtonHolder.classList.remove("hide");
            muggingPanel.classList.add("hide");
        })
    }
    
}

//the mugger will shoot at the player, this method is used to determine if the player is hit and how much damage happened
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
        checkHealth(`A mugger shot you to death. Then he took all your drugs and money`); //pass in a string to use for the cause of death
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
            let lossFactor = Random.float(0.1, 0.6); //the muggers are going to take 10-60% of your stash of each drug
            let loss = Math.round(inventory[drug].count * lossFactor);
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
    checkHealth();
    //print info about the outcome
    muggingInfoHolder.innerHTML += `
        
        <br/><p>Those bastards took ${totalLoss} units from your stash</p>
        <p>You lost ${damage} HP in the struggle</p>
        <p>They also took $${robbedTotal.toLocaleString(undefined, { useGrouping: true })} from your bill fold before you managed to get away.</p>
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
        appraisalString = "Kids these days. They break a few bones and they think it's the end of the world. Buck of softies. Take these painkillers and get outta my sight"
    } else if (health < 50 && health >= 30) {
        appraisalString = "It's just a flesh wound. I've seen worse. Take this super glue and apply it to the dangling appendages. And stop being so dramatic"
    } else if (health < 30) {
        appraisalString = "Oh, damn. You're pretty fucked up. Let me take care of you"
    } else if (health === 0){
        appraisalString = "Uh, I'm not sure how to tell you this, but you're actually dead"
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
    <br/><p>If you have $$$ we have HP. If you're broke, fuck off! What, you think healthcare is a human right of something?*</p>
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

//bring up the gun shop info and establish functionality to enable buying a weapon + adding it to player's inventory
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

//bring up the tax info for Grandma's place. Player can pay the $1M tax bill here. Completing the tax payment is the main objective of the game
const visitCountyOffice = () => {
    console.log("visiting county office")
    if (!grandmasTaxesPaid) {
        //define the message that prints when the player goes to the count office
        let countyMessage = `
        <br /><p>You walk up to the service window inside the stodgy government office building.</p>
        <br /><p>You explain that you're here to pay the back taxes on your Grandmother's combination orphanage and animal rescue.</p>
        <br/><p>The clerk clacks the keys on the ancient terminal in front of him to pull up Grandma's info. He looks back at you with a straight face and says:<br/><br/> "That'll be one million dollars. We can only accept payment in full. Will that be check or credit?"</p>
        `
        countyInfoHolder.innerHTML = countyMessage;

        //check to see if the player has sufficient moneys to pay off the taxes
        if (cash >= 1000000) {
            console.log("player has enough moneys")
            let payButton = `<div id="pay-taxes" class="button padding-block-3">"Well..." (pay $1,000,000) </div>`
            countyInfoHolder.insertAdjacentHTML("beforeend", payButton)

            const payTaxesButton = document.querySelector("#pay-taxes");
            payTaxesButton.addEventListener("click", event => {
                console.log("pay tax button clicked");
                cash -= 1000000;
                
                grandmasTaxesPaid = true;
                countyInfoHolder.innerHTML = `
                <br/><br/><p>"Well," You say, as you begin passing piles of bills through the window, "it's gonna be cash today."</p>
                <br/><h2>CONGRATULATIONS!! YOU HAVE SAVED GRANDMA'S COMBINATION OPHANAGE AND ANIMAL RESCUE AND MULTI-GENERATIONAL HOME! WAY TO GO!</h2>
                <br/><div id="continue-from-tax-button" class="button padding-block-3">Cool, man. Right on. I did it all for Grandma and for the kitties and puppies.</div>
                <br/><p class="small-text">(continue to max your cash until 30 days is up!)</p>
                `

                updateInfoPanelStats();

                const continueFromTaxButton = document.querySelector("#continue-from-tax-button")
                continueFromTaxButton.addEventListener("click", event => {
                    countyPanel.classList.add("hide");

                })
            })
        } else {
            console.log("insufficient funds");
            countyInfoHolder.insertAdjacentHTML("beforeEnd",`<br/><p>"Oh," you say, patting your pockets, "I forgot my wallet! I'll be right back"`)
        }
    } else {
        let countyMessage = `
            <br/><p>Hello, again. Did you return to explain the origin of the million dollars in cash?</p>
            `
        countyInfoHolder.innerHTML = countyMessage;
    }
    
   
}

const visitShop = () => {
    
    
    
    //change all this code to make sense for the shop instead of the gun shop
    shopInfoHolder.innerHTML = `<br/><p>Welcome to Eddie's. What do you need?</p>`

    const shopButtonHolder = document.querySelector("#shop-button-holder")
    shopInfoHolder.innerHTML = ``;
    shopButtonHolder.innerHTML = ``;
    console.log(shopButtonHolder)
    //generate a button for each shop item
    upgrades.forEach(upgrade => {
        //but only if the player doesn't already have that gun in their possession
        let playerHas = false;
        playerHas = upgrade.has;
        //console.log(gun);
        //console.log(playerHas)
        if (upgrade.has !== true) {
            //console.log(gun.name + " " + gun.cost)
            shopButtonHolder.insertAdjacentHTML("beforeend", `
        <div id="buy-${upgrade.id}" class="button justify-content-space-between padding-inline-5"><h2>${upgrade.name.toUpperCase()}</h2><h2>$${upgrade.cost.toLocaleString(undefined, { useGrouping: true })}</h2><p>${upgrade.description}</p></div>
        `)
        }

    })

    const buyFlakButton = document.querySelector("#buy-flak");
    const buyArmorButton = document.querySelector("#buy-armor");
    const buyShieldButton = document.querySelector("#buy-shield");
    const buyPocketsButton = document.querySelector("#buy-pockets");
    const buyBriefButton = document.querySelector("#buy-brief");
    const buyDuffleButton = document.querySelector("#buy-duffle");


    //add listeners to the buy buttons, if they exist
    try {
        buyFlakButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyUpgrade(0)
        })
    } catch {
        console.log("Buy Flak Jacket Button doesn't exist because the player has already bought it")
    }

    try {
        buyArmorButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyUpgrade(1)
        })
    } catch {
        console.log("Buy Body Armor Button doesn't exist because the player has already bought it")
    }

    try {
        buyShieldButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyUpgrade(2)
        })
    } catch {
        console.log("Buy Energy Shield Button doesn't exist because the player has already bought it")
    }

    try {
        buyPocketsButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyUpgrade(3)
        })
    } catch {
        console.log("Buy Extra Pockets Button doesn't exist because the player has already bought it")
    } 

    try {
        buyBriefButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyUpgrade(4)
        })
    } catch {
        console.log("Buy Brief Case Button doesn't exist because the player has already bought it")
    }
    try {
        buyDuffleButton.addEventListener("click", event => {
            console.log(event.srcElement.id + " click")
            buyUpgrade(5)
        })
    } catch {
        console.log("Buy Buy Duffle Button doesn't exist because the player has already bought it")
    }

    const buyUpgrade = (upgrade) => {

        //check to see if the player has enough money to buy the gun
        if (cash >= upgrades[upgrade].cost) {
            console.log("buying " + upgrades[upgrade].name)
            shopInfoHolder.innerHTML = `<br/><p>Enjoy your ${upgrades[upgrade].name}. Use it in good health. <br/>Good health for you, anyway heh heh heh.`
            cash -= upgrades[upgrade].cost;
            upgrades[upgrade].has = true;
            updateInfoPanelStats();
            applyUpgrade(upgrade);
            visitShop(); //to update the visible buttons i.e. remove the button that the player just bought

        } else {
            console.error("insufficient funds");

            shopInfoHolder.innerHTML = `<br/><p>You ain't got the money for that ${upgrades[upgrade].name}! <br/>Put that shit down and quit Wasting my time!</p>`
        }
    }

    const applyUpgrade = (upgrade) => {
        console.log("Applying upgrade: " + upgrade)
        if (upgrade <= 2) {
            maxHealth += upgrades[upgrade].impact;
            console.log("applying max health upgrade. Max health +" + upgrades[upgrade].impact)
        } else {
            console.log("applying inventory upgrade")
            maxStash += upgrades[upgrade].impact;
            console.log("applying max stash upgrade. Max stash +" + upgrades[upgrade].impact)
        }
        updateInfoPanelStats();
    }
}

//when the game is over i.e. time has expired, not because of player death. The outcome of the game is printed in here and then it prints a button that will let the player continue onto the high score function
const gameOver = () => {
    const endOfGameMessageHolder = document.querySelector("#end-of-game-status-message")

    //the player has just completed the game, delete the saved game
    localStorage.removeItem("savedGame");

    let earnedTotal = cash + bank;
    let earnedTotalFormated = earnedTotal.toLocaleString(undefined, { useGrouping: true });

    let grandmaStatusString = ``;
    let rewardString = ``;
    //if the player completed the primary objective of the game, they get the good ending
    if (grandmasTaxesPaid) {
        grandmaStatusString = `<br/><p>You saved Grandma's House! And all of those orphans! And countless small helpless furry critters!</p></br><p>Each of those innocent critters will forever look up to you for many reasons, chief among them that they don't ask questions.</p><br/><p>Way to go!</p><br/><p>And on top of this heroic feat, you also banked: $${earnedTotalFormated} for yourself.`

        //define levels to determine what kind of special text is printed for the "what you do with your money" thing
        let rewardThreshold0 = 50000;
        let rewardThreshold1 = 150000;
        let rewardThreshold2 = 500000;
        let rewardThreshold3 = 1000000;
        let rewardThreshold4 = 5000000;
        let rewardThreshold5 = 10000000;

        rewardString = `<br/><br/><p>So, now what?</p>`

        if (earnedTotal < rewardThreshold0) {
            rewardString += `<br/><p>You didn't end up with much, but the important thing is you saved the house, you saved the puppies, the kitties and the orphans. Good work.</p>`;
        } else if (earnedTotal >= rewardThreshold0 && earnedTotal < rewardThreshold1) {
            rewardString += `<br /><p>You decide to take a luxurious world tour with the gains from your efforts.</p><br/><p>Bon voyage!</p>`;
        } else if (earnedTotal >= rewardThreshold1 && earnedTotal < rewardThreshold2) {
            rewardString += `<br/><p>You set off to look for a bit of woodsy land with a stream running through it to buy.</p><p>You look forward to taking it easy in the woods next to that stream for a good while</p>`;
        } else if (earnedTotal >= rewardThreshold2 && earnedTotal < rewardThreshold3) {
            rewardString += `<br/><p>You're just gonna chill for a while. With this money, you won't have to work for a long time.</p><br/><p>What have you always wanted to learn how to do? You're in school for that now. Go learn!</p>`;
        } else if (earnedTotal >= rewardThreshold3 && earnedTotal < rewardThreshold4) {
            rewardString += `<br/><p>You've been thinking about where you want to live. With this money, you can buy a nice place anywhere in the world and just chill. Where will you go?</p>`;
        } else if (earnedTotal >= rewardThreshold4 && earnedTotal < rewardThreshold5) {
            rewardString += `<br/><p>You plan to get a nice place in a nice part of town. You're going to go legit and start a business. You upgrade Grandma's place so you can take in lots more puppies and kitties. And you make donations to help reduce the incidence of orphans.</p>`;
        } else if (earnedTotal >= rewardThreshold5 ) {
            rewardString += `<br/><p>You upgrade Grandma's place so you can take in lots more puppies and kitties.<br/><br/>You make donations to help reduce the incidence of orphans. <br/><br/>You've been thinking about where you want to live. With this money, you will never have to work again. You can buy a nice place anywhere in the world and just chill. <br/><br/>Where will you go?</p>`;
        }

        //append the reward string you just selected onto the string you generated above. This will end up in the final status message below.
        grandmaStatusString += rewardString;

    } else {
        //if the player did not complete the primary objective, they get a sassy ending and no reward text and no high score saving
        grandmaStatusString = `<br/><p>Dude, you didn't pay the back taxes on Grandma's place. Now they're tearing it down and all those orphans and all those puppies and kitties are gonna be out on the street! You monster!</p><br/> <p>The $${earnedTotalFormated} that you banked is a hollow victory which neither man nor beast will celebrate.</p>`
        earnedTotal = 0; //setting this to 0 makes the score passed into to the high score handler will be 0
    }

    const continueButtons = `<br/>
        <div id="view-highscores-button" class="button padding-block-3">Continue</div>`
        
    endOfGameMessageHolder.innerHTML = grandmaStatusString + continueButtons;

    const goToHighScoresButton = document.querySelector("#view-highscores-button");
    goToHighScoresButton.addEventListener("click", event => {
        endOfGamePanel.classList.add("hide");
        highScoreHandling(earnedTotal);
    })

    endOfGamePanel.classList.remove("hide")
}


//load the high score json and also add the most recent score to the high score list and sort the high score list and print the high scores
const highScoreHandling = (gameScore) => {
    console.log("Loading High Scores")
    const highScorePanel = document.querySelector("#highscore-panel");
    highScorePanel.classList.remove("hide");
    const highScoreMessage = document.querySelector("#high-score-message");

    const savedHighscores = localStorage.getItem("highScores")

    const formattedScore = gameScore.toLocaleString(undefined, { useGrouping: true });

    //once this is up and running (i.e. no longer testing), wrap this in an "if taxes are paid" thing because runs that don't end with taxes paid are not eligible to be on the high score list
    const inputName = `
        <h2>Final Score: $${formattedScore}</h2>
        <p>Enter YOur Name:</p>
        <input type="text" id="player-name">
        <br/>
        <div class="button" id="enter-player-name">Enter</div>`

    highScoreMessage.innerHTML = inputName;
    const playerNameInput = document.querySelector("#player-name")
    let highscores = [];

    if (savedHighscores) {
        console.log("high scores file loaded")
        //map the loaded high score objects to the highscores[] array
        highscores = JSON.parse(savedHighscores)
    } else {
        console.log("high score file does not exist.")
    }

    const enterPlayerNameButton = document.querySelector("#enter-player-name");
    enterPlayerNameButton.addEventListener("click", event => {
        console.log("enter player name click");

        let scoreObject = {
            "name": playerNameInput.value,
            "score": gameScore
        }

        console.log(scoreObject);

        //add the most recent score to the score array
        highscores.push(scoreObject);

        //sort the list from high score to low
        highscores.sort((a, b) => b.score - a.score)
        console.log(highscores)

        // Convert the player object to a JSON string
        const savedScored = JSON.stringify(highscores);

        // Save the player data in localStorage
        localStorage.setItem('highScores', savedScored);

        highScoreMessage.innerHTML = ``

        let target = highscores.length;

        //check the amount of high scores saved
        if (highscores.length <= 10) {
            target = highscores.length - 1;
        } else {
            target = 19;
        }

        //generate HTML for the high score objects
        for (let scoreIndex = 0; scoreIndex <= target; scoreIndex++) {
            let printIndex = scoreIndex + 1;
            highScoreMessage.insertAdjacentHTML("beforeEnd", `<div class="high-score-entry""><p>#${printIndex}</p><p id="entry-${printIndex}">replace-me</p><p>$${highscores[scoreIndex].score.toLocaleString(undefined, { useGrouping: true })}</p></div>`)
            const playerName = document.querySelector(`#entry-${printIndex}`);
            console.log(playerName)
            let name = highscores[scoreIndex].name.slice(0, 15); //trim the name to 16 characters max

            playerName.textContent = name;
        }

        //and add a button to continue from there
        highScoreMessage.insertAdjacentHTML("beforeend", `<br/><div class="button" id="play-again-button">Play again</div>`)
        const playAgainButton = document.querySelector("#play-again-button");
        playAgainButton.addEventListener("click", event => {
            location.reload(); //reload the page as a shortcut to starting a new game
        })

    })
}

//this function loads the highscores and prints them on screen - this is reached from the options
const printHighScores = () => {

    topPanel.classList.add("hide")
    settingsPanel.classList.add("hide")

    //define the places on the page that you'll be using here and unhide the main panel
    const highScorePanel = document.querySelector("#highscore-panel");
    highScorePanel.classList.remove("hide");
    const highScoreMessage = document.querySelector("#high-score-message");
    highScoreMessage.innerHTML = ``;
    

    //load the saved high scores from local storage
    const savedHighscores = localStorage.getItem("highScores")

    //create an array to store them in
    let highscores = [];

    //check to see if you mapped anything to savedHigscores (i.e. if the saved file exists)
    if (savedHighscores) {
        console.log("high scores file loaded")
        //if so map the loaded high score objects to the highscores[] array
        highscores = JSON.parse(savedHighscores)
        
    } else {
        console.log("high score file does not exist.")
        highScoreMessage.insertAdjacentHTML("beforeend", `<h2>There are no high scores yet! Keep playing :)</h2>`)
    }

    console.log(highscores)

    let target = highscores.length;
    
    //check the amount of high scores saved
    if (highscores.length <= 19) {
        target = highscores.length;
    } else {
        target = 19; //target of 19 prints the top 20 scores
    }

    //generate HTML for the high score objects
    for (let scoreIndex = 0; scoreIndex < target; scoreIndex++) {
        let printIndex = scoreIndex + 1;
        console.log(scoreIndex);
        highScoreMessage.insertAdjacentHTML("beforeEnd", `<div class="high-score-entry""><p>#${printIndex}</p><p id="entry-${printIndex}">replace-me</p><p>$${highscores[scoreIndex].score.toLocaleString(undefined, { useGrouping: true })}</p></div>`)
        const playerName = document.querySelector(`#entry-${printIndex}`);
        console.log(playerName)
        let name = highscores[scoreIndex].name.slice(0, 15); //trim the name to 16 characters max

        playerName.textContent = name;
    }

    highScoreMessage.insertAdjacentHTML("beforeend", `<br/><div class="button" id="close-scores-button"><h3>Close Scores</h3></div>`)

    const closeScoresButton = document.querySelector("#close-scores-button");
    closeScoresButton.addEventListener("click", event => {
        highScorePanel.classList.add("hide");
        topPanel.classList.remove("hide");
        settingsPanel.classList.remove("hide");
    })

}

const saveGame = () => {
    //create an object that contains every value that you wish you save
    console.log("inventory just ahead of save:")
    console.log(inventory)
    let saveObject = {
        "day": day,
        "cash": cash,
        "bank": bank,
        "debt": debt,
        "health": health,
        "maxHealth": maxHealth,
        "stash": countHeld,
        "maxStash": maxStash,
        "inventory": inventory,
        "weapons": weapons,
        "taxPaid": grandmasTaxesPaid,
        "location": currentLocation,
    }
    
    console.log(saveObject)

    //convert the save object into a JSON string
    const saveJSON = JSON.stringify(saveObject);

    //and save that JSON in localStorate
    localStorage.setItem("savedGame", saveJSON)


}

const loadGame = () => {
    console.log("checking for saved game");

    //load the savedGame JSON string from locaStroage
    const loadedGame = localStorage.getItem("savedGame");

    //parse the JSON string into an object
    const loadedObject = JSON.parse(loadedGame);
    console.log("Here's the loaded objects: ")
    console.log(loadedObject)
    let gameLoaded = false;
    try {

        //as I wrote this load method, I realized that if I cleaned up my data structures, it would be a lot easier to write and extend this method.
        //If all of these gameplay variables were put into a JSON array, then I could load and save the game with one simple "=" operation instead of going line by line
        //not sure I'll put that refactor work into this code but it's a lesson I'll definitely carry forward to future projects
        day = loadedObject.day;
        cash = loadedObject.cash;
        bank = loadedObject.bank;
        debt = loadedObject.debt;
        health = loadedObject.health;
        maxHealth = loadedObject.maxHealth;
        countHeld = loadedObject.stash;
        maxStash = loadedObject.maxStash;
        inventory = loadedObject.inventory;
        weapons = loadedObject.weapons;
        grandmasTaxesPaid = loadedObject.taxPaid;
        currentLocation = loadedObject.location;

        console.log("found a saved game to load")
        console.log(loadedObject)
        console.log(inventory)
        gameLoaded = true;
    } catch (error) {
        console.log("While trying tl oad the save game, the following error occurred: " + error);
    }

    //loadGame() is run on page laod, if the game is loaded successfully, the below logic runs. The purpose here is to intercept the usual game start routine to let the player know that they have a saved game they can continue if they wish
    if (gameLoaded) {
        gameStartButton.classList.add("hide");

        let taxPaid = ``;
        if (!grandmasTaxesPaid) {
            taxPaid = `You need to go to Queens to pay Grandma's $1M tax bill before day 30.`
        } else {
            taxPaid = `You already paid Grandma's tax bill. Well done. Maximize your $$$ until day 30!`
        }

        statusMessageHolder.innerHTML = `
            <h2>You have a saved game in progress.</h2>
            <br/><p>It is day ${day} and you are in ${burroughs[currentLocation].name}.
            <br/><br/>You have $${cash.toLocaleString(undefined, { useGrouping: true })} in hand and $${bank.toLocaleString(undefined, { useGrouping: true })} in the bank.
            <br/><br/>${taxPaid}</p>
            <br/>
            <br/>
            <div class="button" id="continue-game-button">Continue Saved Game</div>`

        const continueGameButton = document.querySelector("#continue-game-button")
        continueGameButton.addEventListener("click", event => {
            initializeGame();
            settingsPanel.classList.add("hide");
            
        })

        const eraseSavedGameButton = document.querySelector("#intro-erase-saved-game")
        eraseSavedGameButton.classList.remove("hide");
        eraseSavedGameButton.addEventListener("click", event => {
            console.log("saved game erased")
            localStorage.removeItem("savedGame")
            location.reload(); //reload the page as a shortcut to starting a new game
        })
    }

}

//probably don't need to finish writing this...well maybe actually you do once you put in the safe game feature, a page load won't reset the game, will it?
const reinitializeGame = () => {

    //reset gameplay variables
    cash = 0;
    debt = 0;
    bank = 0;
    health = 0;
    maxHealth = 0;
    maxStash = 0;
    countHeld = 0;
    day = 0;
    grandmasTaxesPaid = false; //The main objective is to turn this value to true by way of paying the $1M in back taxes.

    //clear the inventory
    inventory.forEach(drug => {
        drug.count = 0;
        console.log(drug.name + " " + drug.count)
    })



}

//const chart = new JSC.Chart('stats-chart-id', {
//    debug: 'true',
//    type: 'line',
//    series: ([
//        {
//            name: 'funds',

//        }, {
//            name: 'inventory',

//        }
//    ]),
//    yAxis: {
//        scaleRange: {
//            min: 0, // minimum value
//            max: 20000 // maximum value
//        }
//    }
//})



//let entryNumber = 0;

//const updateStatsChart = () => {
    
//    chart.options({
//        yAxis: {
//            scaleRange: {
//                min: 0, // minimum value
//                max: 20000 // maximum value
//            }
//        }
//    })
//    entryNumber++;
//    chart.series(0).points.add({ x: `${entryNumber}`, y: `${cash}` });

//};


//this logic runs on page load. This is the hook that gets you into all of the other functions above.

loadObjectsJSON(); //and load the JSON objects for things like locations

printWelcomeMessage(); //put the intro message on the screen







//to add a new drug:
//add placeholder entries at the top
//add entries in "initializeDrugList"
//add json info - both in the drug category and then again in the inventory (you should probably generate the inventory dynamically based on a forEach of the names of the drugs in the drug list)

//TODO:
//to fix the themeing thing, instead of applying inline styles, what you want to do is include another css file in <head>


//convert the stash info to a stats page, replace the table of inventory with a pie chart. That's going to involve including a library in your project, I think
//also track your cash level every day and graph it. Maybe graph cash on one side and inventory on the other!
//graphs!

//make the value of your inventory (as opposed to the overall count) contribute more to your chance of getting mugged
//it's possible to have tony find you and get mugged at the same time. Make that not be possible

//add cops that chase you. More chance to get chased the more profit you make -> how is this different than a mugging?
//add a "highest / lowest" seen thing on the market
//add a shop so you can get some upgrades e.g. inventory size / body armor
