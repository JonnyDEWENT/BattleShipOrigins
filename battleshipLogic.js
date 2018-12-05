// player point of view...
// 00  not ship, not hit yet (blue water)
// 01  ship, not guessed by enemy yet (visible ship)
// 10  not ship, guessed (red X)
// 11  ship, guessed (blown up ship pic)

var newGameRefString2;
var localGameStatus;
var userRefString2;
const NOT_A_SHIP = 0;
const HAS_A_SHIP = 1;
const MISSED = 2;
const HIT = 3;
var iCreatedThisGame = false;
var flags = ["AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BR", "IO", "VG", "BN", "BG", "BF", "MM", "BI", "CV", "KH", "CM", "CA", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CO", "KM", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "GA", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "PR", "QA", "CG", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "BS", "GM", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VA", "VE", "VN", "VI", "WF", "EH", "YE", "ZM", "ZW"];


function startGame(newGameRefString, userRefString) {
    // Setup...
    battleship.screen = 2;
    var battleArea = document.getElementById("battleArea");
    battleArea.className = "visible";
    newGameRefString2 = newGameRefString;
    userRefString2=userRefString;
    document.getElementById("playerName").innerHTML = email;
    pickAFlag();
    localGameStatus = 0;

    // Read stuff...
    var table = document.createElement("table");
    var tableHeaderRow = document.createElement("h2");
    tableHeaderRow.innerHTML = "YOUR SHIPS";
    table.appendChild(tableHeaderRow);

    var enemyTable = document.createElement("table");
    var tableHeaderRow2 = document.createElement("h2");
    tableHeaderRow2.innerHTML = "ENEMY SHIPS";
    enemyTable.appendChild(tableHeaderRow2);

    var gameNode = firebase.database().ref(newGameRefString);
    gameNode.on("value", function (snapshot) {
        var gameData = snapshot.val();
        var turnHeader = document.getElementById("turn");
        if (gameData.turn == email) {
            turnHeader.innerHTML = "ENEMY'S TURN!";
        } else {
            turnHeader.innerHTML = "YOUR TURN!";
        }
        var enemyShipsLeft = 0;
        var playerShipsLeft = 0;

        // draw player ships...   player1 = host man
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var button = document.getElementById("P" + i + j);
                var whichGrid = gameData["playerOne"] == email ? "boardOne" : "boardTwo";
                iCreatedThisGame = gameData["playerOne"] == email ? true : false;
                var pic = gameData[whichGrid][i][j];
                if (pic == NOT_A_SHIP) {
                    button.innerHTML = `<img src="./images/normal.png" width="100" height="100"/>`;
                } else if (pic == HAS_A_SHIP) {
                    button.innerHTML = `<img src="./images/ship.jpg"  width="100" height="100"/>`;
                    playerShipsLeft++;
                } else if (pic == MISSED) {
                    button.innerHTML = `<img src="./images/miss.jpg" width="100" height="100" />`;
                } else if (pic == HIT) {
                    button.innerHTML = `<img src="./images/hit.jpg"  width="100" height="100"/>`;
                }
            }
        }

        // draw enemy ships...
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var button = document.getElementById("E" + i + j);
                var whichGrid = gameData["playerOne"] == email ? "boardTwo" : "boardOne";
                var pic = gameData[whichGrid][i][j];
                if (pic == NOT_A_SHIP) {
                    button.innerHTML = `<img src="./images/normal.png" width="100" height="100"/>`;
                } else if (pic == HAS_A_SHIP) {
                    button.innerHTML = `<img src="./images/normal.png"  width="100" height="100"/>`;
                    enemyShipsLeft++;
                } else if (pic == MISSED) {
                    button.innerHTML = `<img src="./images/miss.jpg" width="100" height="100" />`;
                } else if (pic == HIT) {
                    button.innerHTML = `<img src="./images/hit.jpg"  width="100" height="100"/>`;
                }
            }
        }

        // check if a player wins...
        if (playerShipsLeft <= 0 && localGameStatus != 1) {
            localGameStatus = 1;
            gamesPlayed++;
            var updatePlayerStats = {};
            updatePlayerStats["gamesPlayed"] = gamesPlayed;
            firebase.database().ref(userRefString2).update(updatePlayerStats);
            

            // alerting player and switching screens
            alert("ENEMY wins the GAME!!!!");
            battleArea.className = "hidden";
            battleship.screen = 1;
            return;
        } else if (enemyShipsLeft <= 0 && localGameStatus != 1) {
            gamesPlayed++;
            gamesWon++;
            localGameStatus = 1;

            //updating player info
            var updatePlayerStats = {};
            updatePlayerStats["gamesPlayed"] = gamesPlayed;
            updatePlayerStats["wins"]=gamesWon;
            firebase.database().ref(userRefString2).update(updatePlayerStats);

            //updating game info
            var updateWinner = {};
            updateWinner["winner"] = email;
            updateWinner["status"] = 3;
            firebase.database().ref(newGameRefString2).update(updateWinner);

            // alerting player and switching screens
            alert("YOU win the GAME!!!");
            battleArea.className = "hidden";
            battleship.screen = 1;
            return;
        }

    });
}

// note: turn means LAST turn played!  as long as not you, not your turn!
function shootTorpedoAt(string) {

    // If not player's turn, do nothing...
    var whoseTurnIsIt = firebase.database().ref(newGameRefString2 + "/turn");
    whoseTurnIsIt.once("value", function (snapshot) {
        if (snapshot.val() == email) {
            alert("WHOA, buddy!  It's not YOUR turn yet!");
            return;
        } else {
            reallyShootIt(string);
        }
    })
}

// DON'T get rid of this function - helps with callback flow!
function reallyShootIt(string) {
    // Get the values at this enemy cell...
    var row = string.substring(1, 2);
    var col = string.substring(2, 3);
    var updates = {};
    var updateTurn = {};
    updateTurn["turn"] = email; // set to player email, as in "last turn was:email"
    var whichGrid = iCreatedThisGame ? "boardTwo" : "boardOne";
    var enemyCellNum = firebase.database().ref(newGameRefString2 + "/" + whichGrid + "/" + row + "/" + col);
    console.log(email + " shoots at: " + enemyCellNum);
    enemyCellNum.once("value", function (snapshot) {
        var num = snapshot.val();
        if (num == HAS_A_SHIP) {
            updates[col] = HIT;
        } else if (num == NOT_A_SHIP) {
            updates[col] = MISSED;
        }
        firebase.database().ref(newGameRefString2).update(updateTurn);
        firebase.database().ref(newGameRefString2 + "/" + whichGrid + "/" + row).update(updates);
    });
}

function pickAFlag(){
    var flagIndex = Math.floor(Math.random()*flags.length);

    var flagPicked = flags[flagIndex];
    var flagDiv = document.getElementById("flagDiv");
    flagPicked = `https://www.countryflags.io/${flagPicked}/flat/64.png`;
  
    var image = document.createElement("img");
    image.setAttribute("src", flagPicked);
    image.setAttribute("id", "flagImage");
    flagDiv.appendChild(image);
}