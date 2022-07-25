
const body = document.querySelector('body'),
    html = document.querySelector('html');



/* let thisTarget;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

}) */


/*
<div class="timer" data-timer-year="" data-timer-month="" data-timer-day="" data-timer-hour="" data-timer-minute="">
  <span class="timer-days"><span class="timer-days-value"></span></d>
  <span class="timer-hours"><span class="timer-hours-value"></span></span>
  <span class="timer-minutes"><span class="timer-minutes-value"></span></span>
  <span class="timer-seconds"><span class="timer-seconds-value"></span></span>
</div>
*/

function timer() {
  const timerElems = document.querySelectorAll('._timer');

  let deadline, thisDate = new Date();

  setInterval(() => {
    timerElems.forEach(thisTimerElem => {

      deadline = new Date(
  
      thisDate.getFullYear(),
      thisDate.getMonth(),
      thisDate.getDate(),
      thisDate.getHours(),
      thisDate.getMinutes(),
      thisDate.getSeconds() + Number(thisTimerElem.dataset.timer.substring(0, thisTimerElem.dataset.timer.length - 1)) + 1);
        
      
        
      const day = thisTimerElem.querySelector('.timer-days-value'),
      hour = thisTimerElem.querySelector('.timer-hours-value'),
      minute = thisTimerElem.querySelector('.timer-minutes-value'),
      second = thisTimerElem.querySelector('.timer-seconds-value');
  
      const diff = deadline - new Date(),
      days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0,
      hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0,
      minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0,
      seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

      
      thisTimerElem.textContent = seconds + 's';
      if(seconds == 0) {
        thisTimerElem.parentElement.classList.remove('_disabled');
      }
  
      /* if(day) day.textContent = days.toString();
      hour.textContent = hours.toString();
      minute.textContent = minutes.toString();
      second.textContent = seconds.toString(); */
  
    });
  },1000)

}

timer();


// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=
/*
let slider = new Swiper('.__slider', {
  
    spaceBetween: 30,
    slidesPerView: 1,
    centeredSlides: false,

    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      992: {
        slidesPerView: 3,
        centeredSlides: true,
    
      },
      600: {
        slidesPerView: 2,
        centeredSlides: false,
      },
    }
}); 
*/
// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=


/* 
// =-=-=-=-=-=-=-=-=-=-=-=- <Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

wow = new WOW({
mobile:       false,
})
wow.init();

// =-=-=-=-=-=-=-=-=-=-=-=- </Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

*/
