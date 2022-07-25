
const body = document.querySelector('body'),
    html = document.querySelector('html');

/* let thisTarget;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

}) */

let verificationInputs = document.querySelectorAll('.login__verification--input');
verificationInputs.forEach(thisInput => {

  thisInput.oninput = function(event) {

    if(event.inputType == 'insertText') {

      let nextElement = event.target.parentElement.nextElementSibling;

      if(nextElement.classList.contains('login__verification--label')) {
        nextElement.querySelector('input').focus();
      }

      thisInput.value = thisInput.value[thisInput.value.length-1];

    }

  }

})


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
  
      const diff = deadline - new Date(),
      seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
      
      thisTimerElem.textContent = seconds + 's';
      if(seconds == 0) {
        thisTimerElem.parentElement.classList.remove('_disabled');
      }
  
    });
  },1000)

}

timer();
