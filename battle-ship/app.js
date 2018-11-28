
var battleship;
const profilePicNums = 4;
var email;

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

    });

    
    btnSignup.addEventListener('click', e=> {
        const email = txtEmail.value;
        const password = txtPassword.value;

        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email,password);
        

        promise
        .then(() => {
            switchToLobby(email);
            addNewGameButtonClickListener();
        })
        .catch(e => console.log(e.message));
    });

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
                console.log(firebaseUser);
                btnSignout.classList.remove('hide');
            }
            else {
                console.log('not logged in');
            }
        });
   

}

function switchToLobby(email){
    battleship.login = 1;
    battleship.username = email;

    // populateGameTables();
    // var profilePicture = document.getElementById("profilepic");
    // profilePicture.src=battleship.userPicNum;
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

    let newGame = gameRef.push();
    newGame.set({gameNumber: newGame.path.pieces_[1], playerOne: playerOne, playerTwo: playerTwo, boardOne: boardOne, boardTwo: boardTwo, messageOne: messageOne, messageTwo: messageTwo,
                    status: status, winner: winner});
    
}

function populateGameTables(){
    if (battleship != null){
    var table = document.getElementById("availableGamesTable");
    battleship.games=[];
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
}
}

function drawGameTables(){
    

    console.log(battleship.games);
    
}

function addPlayerTwo(theGame){
  var path = "games/"+theGame.innerText;
    firebase.database().ref().child(path).update({playerTwo: email, status: 2});
    // newGame.playerTwo = auth.email;
    // newGame.update({playerTwo: email, status: 2});
}