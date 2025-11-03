// index.js
// Author: Aarti Saini
// Date: 2025-11-03
// Handles form validation, success message, and appending table rows (Task G)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const tableBody = document.querySelector("#dataTable tbody");
  const timestampInput = document.getElementById("timestamp");
  const successMsg = document.getElementById("successMsg");

  const err = {
    fullName: document.getElementById("err-fullName"),
    email: document.getElementById("err-email"),
    phone: document.getElementById("err-phone"),
    birth: document.getElementById("err-birth"),
    terms: document.getElementById("err-terms"),
  };

  // --- Helper: set timestamp automatically ---
  function setTimestamp() {
    const now = new Date();
    timestampInput.value = now.toISOString().replace("T", " ").substring(0, 19);
  }
  setTimestamp();

  // --- Helper: clear error messages ---
  function clearErrors() {
    Object.values(err).forEach((el) => (el.textContent = ""));
  }

  // --- Validation rules ---
  function validateFullName(value) {
    if (!value.trim()) return "Please enter your full name.";
    const parts = value.trim().split(/\s+/);
    if (parts.length < 2) return "Include both first and last name.";
    if (parts.some((p) => p.length < 2)) return "Each name must have at least 2 characters.";
    return "";
  }

  function validateEmail(value) {
    if (!value.trim()) return "Please enter your email.";
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
    return re.test(value) ? "" : "Please enter a valid email address.";
  }

  function validatePhone(value) {
    if (!value.trim()) return "Please enter your phone number.";
    const digits = value.replace(/[\s\-()]/g, "");
    return (/^\+358\d{6,12}$/.test(digits) || /^0\d{5,12}$/.test(digits))
      ? ""
      : "Use Finnish format (+358… or 0…).";
  }

  function validateBirth(value) {
    if (!value) return "Please select your birth date.";
    const birthDate = new Date(value);
    const now = new Date();
    if (birthDate > now) return "Birth date cannot be in the future.";

    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;

    return age < 13 ? "You must be at least 13 years old." : "";
  }

  function validateTerms(checked) {
    return checked ? "" : "You must accept the terms to continue.";
  }

  // --- Success message helper ---
  function showSuccessMessage() {
    successMsg.textContent = "✅ Entry added successfully!";
    successMsg.style.opacity = "1";
    setTimeout(() => {
      successMsg.style.opacity = "0";
    }, 2000);
  }

  // --- Form submit handler ---
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    setTimestamp();

    const values = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      birth: form.birth.value,
      terms: form.terms.checked,
    };

    const errors = {
      fullName: validateFullName(values.fullName),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      birth: validateBirth(values.birth),
      terms: validateTerms(values.terms),
    };

    let valid = true;
    for (const [key, message] of Object.entries(errors)) {
      if (message) {
        err[key].textContent = message;
        valid = false;
      }
    }

    if (!valid) return;

    // --- Add new row to the table ---
    const row = document.createElement("tr");
    [timestampInput.value, values.fullName, values.email, values.phone, values.birth, values.terms ? "Yes" : "No"]
      .forEach((text) => {
        const td = document.createElement("td");
        td.textContent = text;
        row.appendChild(td);
      });

    tableBody.appendChild(row);

    // --- Show success message ---
    showSuccessMessage();

    // --- Reset form for next entry ---
    form.reset();
    setTimestamp();
  });

  // --- Clear button handler ---
  document.getElementById("clearBtn").addEventListener("click", () => {
    clearErrors();
    setTimestamp();
  });
});
