'use strict';
import { SOUNDS } from './config.js';
import { isValidContactName, isValidEmail, isValidMessage } from './validation.js';
emailjs.init("yDBuoxhqeRfrg18BQ"); 
var modal = document.getElementById("contactModal");
var openBtn = document.getElementById("openContact");
var closeBtn = document.getElementById("closeContact");

var form = document.getElementById("contactForm");
var nameInput = document.getElementById("contact-name");
var emailInput = document.getElementById("contact-email");
var messageInput = document.getElementById("contact-message");
var errorBox = document.getElementById("contact-error");

openBtn.addEventListener("click", function(e)  {
  e.preventDefault();
  SOUNDS.open && new Audio(SOUNDS.open).play();
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", function()  {
  SOUNDS.close && new Audio(SOUNDS.close).play();
  modal.classList.add("hidden");
});

modal.addEventListener("click", function(e)  {
  if (e.target === modal) {
    modal.classList.add("hidden");
    SOUNDS.close && new Audio(SOUNDS.close).play();
  }
});

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  errorBox.textContent = ""; 

  var name = nameInput.value.trim();
  var email = emailInput.value.trim();
  var message = messageInput.value.trim();

  if (!isValidContactName(name)) {
    errorBox.textContent = "Ingresá un nombre válido (solo letras/números, mínimo 3 caracteres).";
    return;
  }
  if (!isValidEmail(email)) {
    errorBox.textContent = "Ingresá un email válido.";
    return;
  }
  if (!isValidMessage(message)) {
    errorBox.textContent = "El mensaje debe tener al menos 6 caracteres.";
    return;
  }

  var params = {
    from_name: name,
    from_email: email,
    message: message,
    to_email: "aylen12rodriguez@gmail.com" 
  };

  try {
    await emailjs.send(
      "service_lz81fpy",      
      "template_k6w39p4",     
      params
    );

    errorBox.style.color = "#4ecb71";
    errorBox.textContent = "Mensaje enviado con éxito!";

    SOUNDS.open && new Audio(SOUNDS.open).play();

    setTimeout(function() {
      modal.classList.add("hidden");
      errorBox.textContent = "";
      form.reset();
      errorBox.style.color = "";
    }, 1200);

  } catch (err) {
    console.error("EmailJS error:", err);
    errorBox.style.color = "#ff7b7b";
    errorBox.textContent = "Error al enviar el mensaje.";
  }
});