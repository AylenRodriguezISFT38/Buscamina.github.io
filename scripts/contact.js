'use strict';
import { SOUNDS } from './config.js';
import { isValidContactName, isValidEmail, isValidMessage } from './validation.js';

const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openContact");
const closeBtn = document.getElementById("closeContact");

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const messageInput = document.getElementById("contact-message");
const errorBox = document.getElementById("contact-error");

openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  SOUNDS.open && new Audio(SOUNDS.open).play();
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  SOUNDS.close && new Audio(SOUNDS.close).play();
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    SOUNDS.close && new Audio(SOUNDS.close).play();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = ""; 

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

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

  const params = {
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

    setTimeout(() => {
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
