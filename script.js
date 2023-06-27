// Testing request
const apiUrl = "https://test-ai-x60p.onrender.com/chatgpt";


let isLoading = false;

let errorMessage = null;
const key = "TSTKEE"

async function fetchCompany(company) {
    // Using fetch

    const res = await fetch(apiUrl, {
        method:"POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({company})
    })
    

    const data = await res.json();

    const message = data.message.content;

    try{
        return JSON.parse(message);
    } catch(err) {
        return message;
    }
        
}


function updateDisplay(message=null, isAI=false) {
    const display = document.getElementById("display");

    if (!message) {
        display.setAttribute('data-empty', true);
        return
    }



    if (display.hasAttribute('data-empty')) {
        display.removeAttribute('data-empty');
    }

    display.innerHTML += `
    <div class="message ${isAI ? 'message--ai': ''}">
        <span>${message}</span>
    </div>
    `

    window.scrollTo(0, document.body.scrollHeight);
}

function loadStorage() {
    const storage = window.localStorage.getItem(key);

    if (!storage) return null;
    const data = JSON.parse(storage);

    return data;
}

function saveToStorage(data) {
    window.localStorage.setItem(key, JSON.stringify(data));
}


const form = document.querySelector("form");
// const form = document.getElementById("form");



window.addEventListener('load', ()=>{
    const messages = loadStorage();

    if (!messages) updateDisplay(null);
})

form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const par = document.getElementById("user-input");
    const message = form.company.value;

    // console.log(message);

    updateDisplay(message);
    par.setAttribute('data-loading', true);
    document.getElementById("text-area").setAttribute('readonly', 'true')
    
    
    fetchCompany(message).then((res)=>{
        updateDisplay(res.founder || res, true);
        document.getElementById("text-area").value = '';
    }).catch(err=>{
        console.log(err);
        updateDisplay("Could not perform operation, please check your internet connection",true);
    })
    .finally(()=>{
        par.removeAttribute('data-loading');
        document.getElementById("text-area").removeAttribute('readonly')
    })

})