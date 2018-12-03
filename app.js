
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
    var gamesPlayed = 0;
    var wins = 0;
    var myUid = uid;
    newUser.set({email: email, gamesPlayed: 0, wins: 0, user_id: myUid});
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
    console.log("UID: " + auth);
    const db = firebase.database();
    const events = db.ref('users');
    const query = events.orderByChild('user_id').equalTo(auth).limitToFirst(1);
    query.on('value',snap => {
        console.log(snap.val());
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
    for (var x = 0; x < 10; x++){
        board[x] = [0,0,0,0,0,0,0,0,0,0];
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
    turn = 0;

    let newGame = gameRef.push();
    newGame.set({gameNumber: newGame.path.pieces_[1], playerOne: playerOne, playerTwo: playerTwo, boardOne: boardOne, boardTwo: boardTwo, messageOne: messageOne, messageTwo: messageTwo,
                    status: status, winner: winner});
    startGame(newGame);
    
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

    // return firebase.database().ref().update(updates);
    firebase.database().ref().update(updates);
    startGame(myGame);

}