
var battleship;
const profilePicNums = 4;
var email;
var uid;
var newUser = 0;


function authenticate(ship){
    battleship = ship;
    const txtEmail = document.getElementById("email");
    const txtPassword = document.getElementById("password");
    const btnLogin = document.getElementById("btnLogIn");
    const btnSignup = document.getElementById("btnSignUp");
    const btnSignout = document.getElementById("btnLogOut");
   
    

    //Add login 
    btnLogin.addEventListener('click', e=>{
        email = txtEmail.value;
        const password = txtPassword.value;

        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email,password);
        

        promise
        .then(() => {
            switchToLobby(email);
            promise
            .then(() => {
            addNewGameButtonClickListener();
           
            })
            .catch(e => console.log(e.message));
        })
        .catch(e => console.log(e.message));

    });

    btnSignout.addEventListener('click', e => {
        firebase.auth().signOut();
        switchToSignIn();

    });

    
    btnSignup.addEventListener('click', e=> {
        const email = txtEmail.value;
        const password = txtPassword.value;

        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email,password);
        

        promise
        .then(() => {
            newUser = 1;
            switchToLobby(email);
            addNewGameButtonClickListener();
        })
        .catch(e => console.log(e.message));
    });

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
                console.log(firebaseUser);
                uid = firebaseUser.uid;
                btnSignout.classList.remove('hide');

            }
            else {
                console.log('not logged in');
            }
        });
   

}

function switchToLobby(email){
    battleship.screen = 1;
    battleship.username = email;

    if (newUser > 0) {
    let newUser = userRef.child(uid);
    var gamesPlayed = 2;
    var wins = 1;
    var myUid = uid;
    newUser.set({email: email, gamesPlayed: gamesPlayed, wins: wins, user_id: myUid});
    }

    getUserData(uid);
   

    // populateGameTables();
    // var profilePicture = document.getElementById("profilepic");
    // profilePicture.src=battleship.userPicNum;
}

function switchToSignIn(){
    battleship.screen = 0;
}

function getUserData(auth){
    console.log(auth);
    const db = firebase.database();
    const user = db.ref('/users/' + auth);
    // const query = events.orderByChild('user_id').equalTo(auth).limitToFirst(1);
    user.on('value',snap => {
        var value = snap.val();
        battleship.gamesPlayed = value.gamesPlayed;
        battleship.gamesWon = value.wins;
    });
}

function addNewGameButtonClickListener(){
    var profilePicNum = Math.floor(Math.random()*profilePicNums);
    battleship.userPicNum = battleship.profilepics[profilePicNum];
    const btnNewGame=document.getElementById("btnNewGame");
    btnNewGame.addEventListener('click', startNewGame);
    console.log(Object.assign({}, battleship.games));
    populateGameTables();
}

function createEmptyBoard(){
    var board = [];
    for (var x = 0; x < 5; x++){
        board[x] = [0,0,0,0,0];
        var shipLocation = Math.floor(Math.random() * 5)
        board[x][shipLocation] = 1;
    }

    return board;
}


    function randomizeMyBoard(board){
        var spots = [];
        for(var i = 0; i < 7; i++){
            var shipLocation = Math.floor(Math.random() * 100);
            if (!spots.includes[shipLocation]){
                spots[i] = shipLocation;
                var x = shipLocation % 10;
                var y = shipLocation / 10;
                    board[x][y] = 1;
            }
            else {
                i--;
            }
    
        }
        return board;
    }



function startNewGame(){
    playerOne = battleship.username;
    playerTwo = "                  ";
    boardOne = createEmptyBoard();
    boardTwo = createEmptyBoard();  
    messageOne = "";
    messageTwo = "";
    status = 1;
    winner = "";
    turn = email;

    let newGame = gameRef.push();
    let gameKey = newGame.key;
    console.log("This is the game key " + gameKey + "\nPlayer key: " + uid);

    newGameRefString = "/games/" + gameKey;
    userRefString = "/users/"+ uid;

    console.log("This is the game key full path " + newGameRefString + "\nPlayer key full path: " + userRefString);


    newGame.set({gameNumber: newGame.path.pieces_[1], playerOne: playerOne, playerTwo: playerTwo, boardOne: boardOne, boardTwo: boardTwo, messageOne: messageOne, messageTwo: messageTwo,
                    status: status, winner: winner, turn: turn});


        /* RYAN THIS IS THE ENTRY POINT TO YOUR BATTLESHIP GAME CODE. PASSING GAME REF STRING AND USER REFSTRING. FEEL FREE TO CHANGE THE FUNCTION NAME TO MATCH YOUR
        STARTING FUNCTION NAME IN YOU CODE */
    startGame(newGameRefString,userRefString);

    /*********************************END OF YOUR EDIT AREA :) ******************************************************************************************/

    // updating lobby screen user data display after game
    getUserData(uid);
    
}

function populateGameTables(){
    if (battleship != null){
    var table = document.getElementById("availableGamesTable");

    gameRef.on("child_added", function(snapshot) {

        if (!document.getElementById(snapshot.key)){
            var values = snapshot.val();
            
            // battleship.games.push(values);
            if (values.status == 1){
            battleship.availableGames.push(values);
            }

            else if (values.status == 2){
                battleship.gamesInProgress.push(values);
                }

            else if (values.status == 3){
                battleship.pastGames.push(values);
                }
            
            var games = Object.assign({},battleship.availableGames);
            
            
        }
    });


    gameRef.on("child_changed", function(snapshot) {

        if (!document.getElementById(snapshot.key)){
            var values = snapshot.val();
            
            // battleship.games.push(values);
            if (values.status == 1){
            battleship.availableGames.push(values);
            }

            else if (values.status == 2){
                battleship.gamesInProgress.push(values);
                removeFromAvailable(values.gameNumber,battleship.availableGames);
                
                }

            else if (values.status == 3){
                battleship.pastGames.push(values);
                removeFromAvailable(values.gameNumber,battleship.gamesInProgress);
                }
            
            var games = Object.assign({},battleship.availableGames);
            
            
        }
    });


    gameRef.on("child_removed", function(snapshot) {
 
        if (!document.getElementById(snapshot.key)){
            var values = snapshot.val();
            
            // battleship.games.push(values);
            if (values.status == 1){
            battleship.availableGames.push(values);
            }

            else if (values.status == 2){
                battleship.gamesInProgress.push(values);
                }

            else if (values.status == 3){
                battleship.pastGames.push(values);
                }
            
            var games = Object.assign({},battleship.availableGames);
            
            
        }
    });
}
}

function removeFromAvailable(key,array){
    var arr = array;
    for (var i=0; i < arr.length; i++){
        if(arr[i].gameNumber === key){
            arr.splice(i,1);
        }
    }
}

function drawGameTables(){
    

    console.log(battleship.games);
    
}

function addPlayerTwo(theGame){
  var path = 'games/'+theGame.innerText;
  path = path.replace("\"","");
    var tempRef = gameRef.child(theGame.textContent.replace("\"",""));



    var postData = {
        playerTwo: email,
         status: 2

      };
    
    var updates = {};
    var myGame = theGame.innerText;
    
    updates['/games/' + myGame + '/playerTwo'] = email;
    updates['/games/' + myGame + '/status'] = 2; 
    newGameRefString = '/games/' + myGame
    userRefString = "/users/"+ uid;

    // return firebase.database().ref().update(updates);
    firebase.database().ref().update(updates);
    
        /* RYAN THIS IS THE ENTRY POINT TO YOUR BATTLESHIP GAME CODE. PASSING GAME REF STRING AND USER REFSTRING. FEEL FREE TO CHANGE THE FUNCTION NAME TO MATCH YOUR
        STARTING FUNCTION NAME IN YOUR CODE */
        startGame(newGameRefString,userRefString);

        /*********************************END OF YOUR EDIT AREA :) ******************************************************************************************/
    
        // updating lobby screen user data display after game
        getUserData(uid);

}