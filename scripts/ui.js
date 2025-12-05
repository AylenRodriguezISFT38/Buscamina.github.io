var faceIcon = document.getElementById("face-icon");

function setFaceHappy() {
  faceIcon.src = "icons/happiness.png";
}

function setFaceSurprised() {
  faceIcon.src = "icons/surprised.png";
}

function setFaceDead() {
  faceIcon.src = "icons/dead.png";
}

function showResultModal(title, msg) {
  var modal = document.getElementById("result-modal");
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-message").textContent = msg;
  modal.classList.remove("hidden");
}
