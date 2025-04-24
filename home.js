document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Login successful (demo)");
    window.location.href = "index.html";
  });
  
  document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Registration successful (demo)");
    window.location.href = "login.html";
  });
  