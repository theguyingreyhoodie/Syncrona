const BASE = "http://localhost:5000/api/auth";

async function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(BASE + "/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email,password})
    });

    const data = await res.json();

    if(res.ok){
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href="dashboard.html";
    } else {
        alert(data.msg);
    }
}