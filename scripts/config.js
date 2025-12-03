// configs popup
var configs = document.getElementsByClassName("configs")[0];
var popup = document.getElementById("popup");
var closeBtn = document.getElementsByClassName("close-btn")[0];
var soundOpen = document.getElementById("soundOpen");
var saveConfig = document.getElementById("saveConfig");

closeBtn.addEventListener("click", function() {
    soundOpen.currentTime = 0; 
    soundOpen.play();
    popup.style.visibility = "hidden";
    popup.classList.remove("show");
});

configs.addEventListener("click", function() {
    soundOpen.currentTime = 0; 
    soundOpen.play();
    popup.style.visibility = "visible";
    popup.classList.add("show");
});

saveConfig.addEventListener("click", function(e) {
    e.preventDefault();
    popup.style.visibility = "hidden";
    popup.classList.remove("show");
});

// validaciones
var validateInputs = document.getElementById("config-form");
