const toggleBtn = document.querySelector(".navbar-toggler");
const menu = document.querySelector(".navbar-collapse");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("show");
});

menu.addEventListener("click", () => {
  menu.classList.toggle("show");
});
