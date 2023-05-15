async function login() {
    let msgDOM2 = document.getElementById("msg2");
    msgDOM2.textContent = "";

    let msgDOM1 = document.getElementById("msg1");
    msgDOM1.textContent = "";
    try {
        let name = document.getElementById("name").value;
        let pass = document.getElementById("password").value;
        let result = await requestLogin(name,pass);
        if (result.err) {
            msgDOM1.textContent = "An error occurred";
        } else if (!result.successful) {
            msgDOM1.textContent = "Wrong username or password";    
        } else {
            msgDOM2.textContent = "Login successful!";    
            // checkGame already loads the correct page
            let result=await checkGame();  
            if (result.err) msgDOM1.textContent = "An error occurred";
        }
    } catch (err) {
        console.log(err);
        msgDOM1.textContent = "An error occurred";
    }
}