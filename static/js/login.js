// a function to get element by id as to prevent repetition
function get(id){
    return document.getElementById(id)
}

class LoginValidation {
    //handling the cases of login validation
    constructor() {
        this.email = get('loginEmail');
        this.emailError = get('loginEmailError');
        this.password = get('loginPassword');
        this.passwordError = get('loginPasswordError');
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    checkEmail() {
        const emailValue = this.email.value.trim();  
        if (!emailValue) {
            return 'Please enter your email';
        }
        if (!this.emailRegex.test(emailValue)) {
            return 'Invalid email format';
        }
        return "";
    }

    checkPassword() {
        const passwordValue = this.password.value.trim();  
        if (!passwordValue) {
            return 'Please enter your password';
        }
        if (passwordValue.length < 8) {
            return 'Password must be at least 8 characters';
        }
        return "";
    }

    showError(element, message) {
        //showing the error messages if exists
        element.textContent = message;
    }

    clearErrors() {
        //clearing any past errors
        this.showError(this.emailError, "");
        this.showError(this.passwordError, "");
    }
}

function login() {
    const email = get('loginEmail').value;
    const password = get('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password})  
    }).then(function(response) {
        return response.json().then(function(data) {
            if (response.ok) {
                localStorage.setItem('userEmail', email);
                alert(data.message);
                handlePendingSaveData(); //helper function
                window.location.href = '/';  
            } else {
                if (data.error) {
                    alert(data.error);  
                }
            }
        });
    }).catch(function(error) {
        console.error('Error:', error);
    });
}

function handlePendingSaveData() {
    //saving the results if any calculations was done before signing up
    const pendingData = localStorage.getItem('pendingSaveData');
    if (pendingData) {
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: pendingData 
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Welcome. " + data.message);
                localStorage.removeItem('pendingSaveData'); 
            } else if (data.error) {
                alert("Error saving pending data: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

const LogInValidation = new LoginValidation();

get("loginButton").addEventListener("click", function(event) {
    event.preventDefault();  

    LogInValidation.clearErrors();

    const emailError = LogInValidation.checkEmail();
    const passwordError = LogInValidation.checkPassword();

    LogInValidation.showError(LogInValidation.emailError, emailError);
    LogInValidation.showError(LogInValidation.passwordError, passwordError);

    if (!emailError && !passwordError) {
        login();
    }
});