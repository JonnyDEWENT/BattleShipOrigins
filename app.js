function authenticate(){
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

        promise.catch(e => console.log(e.message));

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