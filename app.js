
var battleship;



function authenticate(ship){
    battleship = ship;
    const txtEmail = document.getElementById("email");
    const txtPassword = document.getElementById("password");
    const btnLogin = document.getElementById("btnLogIn");
    const btnSignup = document.getElementById("btnSignUp");
    const btnSignout = document.getElementById("btnLogOut");
    

    //Add login 
    btnLogin.addEventListener('click', e=>{
        const email = txtEmail.value;
        const password = txtPassword.value;

        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email,password);
        

        promise
        .then(() => {
            switchToLobby(email);
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
    const btnNewGame=document.getElementById("btnNewGame");
    btnNewGame.addEventListener('click', startNewGame());
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
    playerTwo = "";
    boardOne = createEmptyBoard();
    boardTwo = createEmptyBoard();
    messageOne = "";
    messageTwo = "";
    status = 1;
    winner = "";

    let newGame = gameRef.push();
    newGame.set({playerOne: playerOne, playerTwo: playerTwo, boardOne: boardOne, boardTwo: boardTwo, messageOne: messageOne, messageTwo: messageTwo,
                    status: status, winner: winner});
    
}