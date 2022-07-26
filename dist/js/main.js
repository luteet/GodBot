
const body = document.querySelector('body'),
    html = document.querySelector('html');

function validate(email, event) {
  let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  let address = email.value;
  if(reg.test(address) == false) {
      event.preventDefault();
      email.classList.add('_error');
      email.onblur = function () {
        email.classList.remove('_error');
      }
      return false;
  }
}

let thisTarget;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

    let submitBtn = thisTarget.closest('.login__form--submit');
    if(submitBtn) {
      
      if(submitBtn.classList.contains('_disabled')) {

        event.preventDefault();

      } else {

        let form = submitBtn.closest('form'),
        emailInput = form.querySelector('.email-input');

        if(emailInput) validate(emailInput, event);

      }
      

    }

})

/* let emailInputs = document.querySelectorAll('.email-input');

emailInputs.forEach(thisInput => {
  thisInput.oninput = function(event) {

  }
}) */




let verificationInputs = document.querySelectorAll('.login__verification--input');
verificationInputs.forEach(thisInput => {

  thisInput.oninput = function(event) {
    
    if(event.inputType == 'insertText') {

      let nextElement = event.target.parentElement.nextElementSibling,
          form = event.target.closest('form');

      if(nextElement.classList.contains('login__verification--label')) {
        nextElement.querySelector('input').focus();
      }

      thisInput.value = thisInput.value[thisInput.value.length-1];

      if(checkInput()) {
        form.querySelector('.login__form--submit').classList.add('_disabled')
      } else {
        form.querySelector('.login__form--submit').classList.remove('_disabled')
      }

    }

  }

  thisInput.addEventListener('keydown', function(event) {

    if(event.key == 'Backspace' || event.key == 'Delete') {
      event.preventDefault();
      event.target.value = '';

      let prevElement = event.target.parentElement.previousElementSibling,
      form = event.target.closest('form');
      
      if(prevElement) {
        if(prevElement.classList.contains('login__verification--label') && !event.target.value) {
          prevElement.querySelector('input').focus();
        }
      } else {
        event.target.value = '';
      }
      
      if(checkInput()) {
        form.querySelector('.login__form--submit').classList.add('_disabled')
      } else {
        form.querySelector('.login__form--submit').classList.remove('_disabled')
      }
      
    }
    
  })

})

function checkInput() {
  for(let index = 0; index < verificationInputs.length; index++) {
    if(!verificationInputs[index].value) {
      return true;
    }
  }
}

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
        thisTimerElem.style.display = 'none';
        thisTimerElem.nextElementSibling.style.display = 'block';
      } else {
        seconds--;
      }

    },1000)

  });

}

timer();
