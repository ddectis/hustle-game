# It's HustleTIme!
HustleTime is JS a clone of the classic TI-86 calculator game "Dope Wars". I created this project as a javascript learning exercise. It's build in vanilla javascript. I wrote all of the code with the exception of the random library that was shared with me by my friend Dave Kirkbride. Thanks Dave!

The goal of this project was to increase my javascript skills by building a simple, bug-free, event-driven game. I've achieved those goals with this project! The code is a mess but future projects will focus more on architecture and organization. The focus on this project was functionality. 

I would be very happy to receive any feedback or guidance related to this project. I'm always eager to learn :)

# Game Overview
In HustleTime the player is tasked with saving Grandma's Combination Animal Rescue and Orphanage. Grandma has $1M in back taxes and 30 days to pay them. I added this moral objective because the game itself is, well, in a bit more of a moral gray area i.e. to raise the money, you buy and sell drugs. 

- Basically, HustleTime is a simple market simulator.
- Each game lasts 30 days
- Each commodity has a price range and each day, the prices are randomized.
- The player starts out with $2,500 and owing $5,000 to a local mobster. Player has 7 days to pay the debt.
- That debt earns 20% interest / day
- The player earns profit by buying low and selling high.
- There's a shop to buy upgrades to increase max health + carrying capacity
- The player may get mugged while travelling around. If mugged, the player loses health and inventory.
- So there's a weapons shop where the player can arm themselves to defend against mugging.
- If the player pays off Grandma's debt, at the end of 30 days, their score = cash + bank and their score is saved.

# Other Features
- The game uses localStorage to save the player's progress every time the stats info panel is updated i.e. whenever the player travels to a new location, buys / sells any inventory, purchases an upgrade, etc.
- Visual Themes: I wanted to learn a method to apply different themes to a website, so there are four visual themes available
- The player can heal up at the for-profit hospital. I hope you brought cash!
- Every day, each commodity has a 2% chance of experiencing a price crash and a 2% chance of experiencing a price boom. These rare events can be the key to a really exceptional run.

# What else?
- The code is just a pile of functions. I did my best to provide semantic naming and to include decent commentary. I thought about how to better organize this project i.e. offloading stuff into different files, but that seemed just to present a different set of issues / tradeoffs.
- Certainly, many of the functions could be bundled into classes, and that would provide a better level of organization.
- My first attempt at changing the theming resulted only in applying inline styling to existing elements. Since my code creates new elements during runtime, that method didn't work. Thanks to Dave K. for pointing out that you can change the indicated css sheet and the browser will detect it and change immediately. Cool. The old theming method remains in the code base, deprecated.
- There's also some stuff I realized was not a great way to do things but decided just to file away that information instead of fixing it. For example, there were places where I repeated myself and the code could be refactored to be shorter.
- There were also cases where I wasn't managing the scope of variables properly. I got in the habit of just plopping every new variable I needed at the top of the script. And sure, it works, but managing the scope of the variables more carefully would also lead to better organization.
