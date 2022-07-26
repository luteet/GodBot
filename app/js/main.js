
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

  timerElems.forEach(thisTimerElem => {

    let seconds = thisTimerElem.dataset.timer;
    seconds = Number(seconds.substring(0, thisTimerElem.dataset.timer.length - 1));

    let timerInterval = setInterval(() => {

      thisTimerElem.textContent = seconds + 's';

      if(seconds == 0) {
        clearTimeout(timerInterval);
        thisTimerElem.parentElement.classList.remove('_disabled');
      } else {
        seconds--;
      }

    },1000)

  });

}

timer();
