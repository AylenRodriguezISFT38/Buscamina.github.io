function saveName(name) {
  localStorage.setItem("playerName", name);
}

function loadName() {
  return localStorage.getItem("playerName") || "";
}
