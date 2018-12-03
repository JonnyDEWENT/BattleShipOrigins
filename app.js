
var battleship;
const profilePicNums = 4;
var email;

var currentGameNode;
var playerProfileNode;

function findPlayerProfile(email) {
    node_profiles.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var object = childSnapshot.val();
            let iterateProfileEmail = object.email;
            if (iterateProfileEmail == email) {
                // alert("Match found! email = " + email + ", matched email = " + iterateProfileEmail);
                // playerProfileNode = object;
                // console.log("playerProfileNode: " + playerProfileNode.email);
                return object;
            }
        })
    });
}

function authenticate(ship) {
    battleship = ship;
    const txtEmail = document.getElementById("email");
    const txtPassword = document.getElementById("password");
    const btnLogin = document.getElementById("btnLogIn");
    const btnSignup = document.getElementById("btnSignUp");
    const btnSignout = document.getElementById("btnLogOut");

    //Add login 
    btnLogin.addEventListener('click', () => {
        email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {



                // starCountRef.on('value', function (snapshot) {
                //     updateStarCount(postElement, snapshot.val());
                // });


                // find playerprofile info...
                node_profiles.on("value", function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var object = childSnapshot.val();
                        let iterateProfileEmail = object.email;
                        if (iterateProfileEmail == email) {
                            alert("Match found! email = " + email + ", matched email = " + iterateProfileEmail);
                            playerProfileNode = object;
                            console.log("playerProfileNode: " + playerProfileNode.email);
                            return true;
                        }
                    })
                });

                // alert("Find profile result = " + findPlayerProfile(email).email);
                switchToLobby(email);
            })
            .then(() => {
                addNewGameButtonClickListener();
            })
            .catch(e => {
                console.log(e.message);
                alert(e.message);
                alert("Oops!  That login did not work!  Try again!");
            });
    });


    btnSignout.addEventListener('click', e => {
        firebase.auth().signOut();
        alert("You've been signed out!");
    });


    btnSignup.addEventListener('click', e => {
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .then(() => {

                // create new player profile in database...
                playerProfileNode = node_profiles.push();
                playerProfileNode.set({
                    email: email,
                    playerName: "PlayerName",
                    friends: [],
                    stats: {},
                    openInvitations: []
                })
            })
            .then(() => {
                switchToLobby(email);
                addNewGameButtonClickListener();
            })
            .catch(e => {
                console.log(e.message);
                alert(e.message);
            })
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            btnSignout.classList.remove('hide');
        }
        else {
            console.log('not logged in');
        }
    });
}

function switchToLobby(email) {
    battleship.screen = 1;
    battleship.username = email;
    battleship.playerProfileNode = playerProfileNode;

    playerProfileNode.once("value")
        .then(function (snapshot) {
            let key = snapshot.key;
            let object = snapshot.val();
            alert("lobby switch email = " + key + ", other = " + object.email);
        })


    // alert("switch: " + playerProfileNode.email);

};

// alert("selected profile: " + playerProfileNode.key);

// set playerProfile here to match profile in list!

// then, populate their profile info from there!

// populateGameTables();
// var profilePicture = document.getElementById("profilepic");
// profilePicture.src=battleship.userPicNum;


function addNewGameButtonClickListener() {
    var profilePicNum = Math.floor(Math.random() * profilePicNums);
    battleship.userPicNum = battleship.profilepics[profilePicNum];
    const btnNewGame = document.getElementById("btnNewGame");
    btnNewGame.addEventListener('click', startNewGame);
    console.log(Object.assign({}, battleship.games));
    populateGameTables();
}

function createEmptyBoard() {
    var board = [];
    for (var x = 0; x < 10; x++) {
        board[x] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return board;
}


function startNewGame() {
    // setup
    playerOne = battleship.username;
    playerTwo = "                  ";
    boardOne = createEmptyBoard();
    boardTwo = createEmptyBoard();
    messageOne = "";
    messageTwo = "";
    status = 1;
    winner = "";

    currentGameNode = node_matches.push();
    alert(currentGameNode);
    // alert(playerProfile);
    currentGameNode.set({
        player: playerProfileNode,
        opponent: null,
        gameNumber: currentGameNode.path.pieces_[1],
        playerOne: playerOne,
        playerTwo: playerTwo,
        boardOne: boardOne,
        boardTwo: boardTwo,
        messageOne: messageOne,
        messageTwo: messageTwo,
        status: status,
        winner: winner
    });

    // switch to UI


}

function populateGameTables() {
    if (battleship != null) {
        var table = document.getElementById("availableGamesTable");

        node_matches.on("child_added", function (snapshot) {

            if (!document.getElementById(snapshot.key)) {
                var values = snapshot.val();

                // battleship.games.push(values);
                if (values.status == 1) {
                    battleship.availableGames.push(values);
                }

                else if (values.status == 2) {
                    battleship.gamesInProgress.push(values);
                }

                else if (values.status == 3) {
                    battleship.pastGames.push(values);
                }

                var games = Object.assign({}, battleship.availableGames);


            }
        });


        node_matches.on("child_changed", function (snapshot) {

            if (!document.getElementById(snapshot.key)) {
                var values = snapshot.val();

                // battleship.games.push(values);
                if (values.status == 1) {
                    battleship.availableGames.push(values);
                }

                else if (values.status == 2) {
                    battleship.gamesInProgress.push(values);
                    removeFromAvailable(values.gameNumber, battleship.availableGames);

                }

                else if (values.status == 3) {
                    battleship.pastGames.push(values);
                    removeFromAvailable(values.gameNumber, battleship.gamesInProgress);
                }

                var games = Object.assign({}, battleship.availableGames);


            }
        });


        node_matches.on("child_removed", function (snapshot) {

            if (!document.getElementById(snapshot.key)) {
                var values = snapshot.val();

                // battleship.games.push(values);
                if (values.status == 1) {
                    battleship.availableGames.push(values);
                }

                else if (values.status == 2) {
                    battleship.gamesInProgress.push(values);
                }

                else if (values.status == 3) {
                    battleship.pastGames.push(values);
                }

                var games = Object.assign({}, battleship.availableGames);


            }
        });
    }
}

function removeFromAvailable(key, array) {
    var arr = array;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].gameNumber === key) {
            arr.splice(i, 1);
        }
    }
}

function drawGameTables() {


    console.log(battleship.games);

}

function addPlayerTwo(theGame) {
    var path = 'games/' + theGame.innerText;
    path = path.replace("\"", "");
    var tempRef = node_matches.child(theGame.textContent.replace("\"", ""));



    var postData = {
        playerTwo: email,
        status: 2

    };

    var updates = {};
    var myGame = theGame.innerText;
    updates['/games/' + myGame + '/playerTwo'] = email;
    updates['/games/' + myGame + '/status'] = 2;

    return firebase.database().ref().update(updates);

}