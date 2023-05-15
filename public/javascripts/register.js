async function register() {
    let msgDOM1 = document.getElementById("msg1");
    let msgDOM2 = document.getElementById("msg2");
    msgDOM1.textContent = "";
    msgDOM2.textContent = "";
    try {
        let name = document.getElementById("name").value;
        let pass = document.getElementById("password").value;
        let res = await requestRegister(name, pass);
        if (res.successful) {
            msgDOM2.textContent = "Account created. Go to login page";
            let countdownElement = document.getElementById('countdown');
            
            let totalTime = 0.3;
            
            let timerId = setInterval(updateTimer, 100);
            
            function updateTimer() {
    
              totalTime -= 0.1;

              countdownElement.textContent = totalTime;
            
             
              if (totalTime <= 0) {
                clearInterval(timerId);
                
                window.location.pathname = "index.html";
              }
            }
            
            } else {
                msgDOM1.textContent = "Was not able to register";
            }
        } catch (err) {
            console.log(err);
            msgDOM1.textContent = "An error occurred";
        }
    }