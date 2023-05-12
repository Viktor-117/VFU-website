import Swiper from "swiper";
import "swiper/css";
console.log(Swiper);

const id = document.querySelector(".swiper");

const swiper = new Swiper(id, {
  loop: true,
  speed: 10000,
  spaceBetween: 10,
  slidesPerView: 2,
  autoplay: {
    delay: 0,
  },
});
