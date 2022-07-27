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

const headerBlocks = document.querySelectorAll('.header__select--block');

function resize() {
  headerBlocks.forEach(selectBlock => {
    
    if(selectBlock.getBoundingClientRect().x < 0) {
      selectBlock.classList.add('_left')
    }
  
  })
}

resize();

window.onresize = resize;




// =-=-=-=-=-=-=-=-=-=-=-=- <chart> -=-=-=-=-=-=-=-=-=-=-=-=

let chart, chartTextColor;

function chartFunc() {

  let ctx = document.querySelector('#statistics-chart'),
      ctx2D = ctx.getContext("2d");

  function gradient(startColor, lastColor) {
    let gradient = ctx2D.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, lastColor);

    return gradient;
  }

  function repeatLabels(labels) {
    let result = [];

    labels.forEach(function(item) {
      for(let count = 0; count < 24; count++) {
        result.push(item);
      }
    });
    
    return result;
  }

  let labels = repeatLabels(['01.07.22', '02.07.22', '03.07.22', '04.07.22', '05.07.22', '06.07.22', '07.07.22']);

  function repeatData(start, end, posStart) {
    let result = [], value = start;

    for(let count = 0; count <= end; count++) {
      
      value++;

      if(count >= posStart) {
        result.push(value);
      } else {
        result.push(NaN);
      }
      
    }

    return result;
  }

  const data = {
    labels: labels,
    datasets: [
      {
          label: 'Line 1',
          data: repeatData(10, (labels.length / 3), 0),
          backgroundColor: gradient('rgba(202, 57, 12, 1)', 'rgba(202, 57, 12, 0.05)'),
          borderColor: [
              'rgba(202, 57, 12, 1)'
          ],
          pointRadius: 0,
          borderWidth: 1,
          cubicInterpolationMode: 'monotone',
          fill: true,
          tension: 0.4
          
      },
      {
        label: 'Line 2',
        data: repeatData(15, labels.length, (labels.length / 2)),
        backgroundColor: gradient('rgba(27, 163, 73, 1)', 'rgba(27, 163, 73, 0.05)'),
        borderColor: [
          'rgba(27, 163, 73, 1)'
        ],
        pointRadius: 0,
        borderWidth: 1,
        cubicInterpolationMode: 'monotone',
        fill: true,
        tension: 0.4
    },
    {
      label: 'Line 3',
      data: repeatData(35, labels.length, (labels.length / 2)),
      backgroundColor: 'rgba(27, 163, 73, 1)',
      borderColor: [
        'rgba(27, 163, 73, 1)'
      ],
      pointRadius: 0,
      borderWidth: 1,
      cubicInterpolationMode: 'monotone',
      fill: false,
      tension: 0.4
    },
    {
      label: 'Dashed',
      data: repeatData(45, labels.length, (labels.length / 2)),
      borderColor: [
          'rgba(202, 57, 12, 1)'
      ],
      pointRadius: 0,
      
      borderWidth: 1,
      borderDash: [5, 5],
      cubicInterpolationMode: 'monotone',
      fill: false,
      tension: 0.4
  }
  ]
  };

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('chart__tooltip');
      let tooltipElBody = document.createElement('div');
      tooltipElBody.classList.add('chart__tooltip--body');
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.transition = 'all .1s ease';
  
      tooltipEl.appendChild(tooltipElBody);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };

  /* <div class="chart__tooltip">
    <div class="chart__tooltip--body">
        <h4 class="chart__tooltip--title">
            Sell ratio
        </h4>
        <span class="chart__tooltip--date">4.07.22</span>
        <strong class="chart__tooltip--price">
            Price: 21.8k
        </strong>
        <strong class="chart__tooltip--ratio">
            Loshara ratio: 52
        </strong>
    </div>
</div> */
  
  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart),
          tooltipElBody = document.createElement('div'),
          tooltipTitle = document.createElement('h4'),
          tooltipDate = document.createElement('span'),
          tooltipPrice = document.createElement('strong');
    
    tooltipElBody.classList.add('chart__tooltip--body');
    tooltipTitle.classList.add('chart__tooltip--title');
    tooltipDate.classList.add('chart__tooltip--date');
    tooltipPrice.classList.add('chart__tooltip--price');

    tooltipTitle.textContent = tooltip.dataPoints[0].dataset.label;
    tooltipPrice.textContent = `Price: ${tooltip.dataPoints[0].formattedValue}`;
    
    
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);
  
      //const tableHead = document.createElement('thead');
  
      titleLines.forEach(title => {
        tooltipDate.textContent = title;
        /* const tr = document.createElement('tr');
        tr.style.borderWidth = 0;
  
        const th = document.createElement('th');
        th.style.borderWidth = 0;
        const text = document.createTextNode(title);
  
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr); */
      });
  
      //const tableBody = document.createElement('tbody');
      console.log();
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
  
        /* const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = '2px';
        span.style.marginRight = '10px';
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.display = 'inline-block';
  
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;
  
        const td = document.createElement('td');
        td.style.borderWidth = 0;
  
        const text = document.createTextNode(body);
  
        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr); */
      });
  
      const root = tooltipEl.querySelector('.chart__tooltip--body');
  
      // Remove old children
      while (root.firstChild) {
        root.firstChild.remove();
      }
  
      // Add new children
      root.appendChild(tooltipTitle);
      root.appendChild(tooltipDate);
      root.appendChild(tooltipPrice);
      /* root.appendChild(tableBody); */
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
  };

  const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart, args, options) {
      const ul = getOrCreateLegendList(chart, options.containerID);
      ul.classList.add('chart__settings-popup--list', 'm-0', 'p-0', 'mt-3')

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove();
      }
      

      // Reuse the built-in legendItems generator
      const items = chart.options.plugins.legend.labels.generateLabels(chart);

      items.forEach(item => {
        const li = document.createElement('li'), btn = document.createElement('button');
        li.classList.add('chart__settings-popup--item')
        li.style.setProperty('--line-type', (item.lineDash.length) ? 'dashed' : 'solid');
        li.style.setProperty('--line-color', item.strokeStyle);
        btn.classList.add('chart__settings-popup--btn', '_active');
        if(item.hidden) {
          btn.classList.remove('_active');
        }

        li.onclick = () => {
          const {type} = chart.config;
          if (type === 'pie' || type === 'doughnut') {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index);
          } else {
            chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
          }
          chart.update();
        };

        btn.textContent = item.text;

        li.appendChild(btn);
        //li.appendChild(textContainer);
        ul.appendChild(li);
      });
    }
  };

  chart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      
      interaction: {
        intersect: false,
      },

      scales: {
          y: {
            grid: {
              display: false,
              borderColor: 'rgba(0,0,0,0)',
            },
            ticks: {
              color: chartTextColor,
              font: {
                size: 12,
                
              },
            }
          },
          x: {
            grid: {
              display: false,
              borderColor: 'rgba(0,0,0,0)',
            },
            ticks: {
              display: false,
            }
          },
      },
      
      pointBackgroundColor: 'rgba(0,0,0,0)',
      pointBorderColor: 'rgba(0, 0, 0, 0)',
      radius: 0,
      plugins: {
        
          htmlLegend: {
              containerID: 'legend-container',
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: externalTooltipHandler
          },
          legend: {
              display: false,
          },
          labels: {
            usePointStyle: true,
          },
          
      }
    },
    plugins: [htmlLegendPlugin]

  })
}

chartFunc();

if(localStorage.getItem('godbot-pro-theme') == 'dark') {
  chartTextColor = '#9899A6';
  if(chart) chart.update();
  
} else {
  chartTextColor = '#262628';
  if(chart) chart.update();
}

// =-=-=-=-=-=-=-=-=-=-=-=- </chart> -=-=-=-=-=-=-=-=-=-=-=-=

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



    let timerBtn = thisTarget.closest('.login__verification--btn');
    if(timerBtn) {
      if(!timerBtn.classList.contains('_disabled')) {
        timerBtn.classList.add('_disabled');
        timer();
      }
    }



    let headerThemeSwitch = thisTarget.closest('.header__theme--switch');
    if(headerThemeSwitch) {
      headerThemeSwitch.classList.toggle('_active');

      if(headerThemeSwitch.classList.contains('_active')) {

        localStorage.setItem('godbot-pro-theme', 'dark');
        body.classList.add('_dark-theme');

        chartTextColor = '#9899A6';
        if(chart) chart.update();
        
      } else if(!headerThemeSwitch.classList.contains('_active')) {

        localStorage.setItem('godbot-pro-theme', 'light');
        body.classList.remove('_dark-theme');

        chartTextColor = '#262628';
        if(chart) chart.update();

      }
    }



    let headerSelectSelected = thisTarget.closest('.header__select--selected')
    if(headerSelectSelected) {

      if(headerSelectSelected.classList.contains('_active')) {
        document.querySelectorAll('.header__select--selected._active').forEach(thisSelected => {
          thisSelected.classList.remove('_active')
        })
      } else {
        document.querySelectorAll('.header__select--selected._active').forEach(thisSelected => {
          thisSelected.classList.remove('_active')
        })
        headerSelectSelected.classList.add('_active');
      }
     
    } else if(!thisTarget.closest('.header__select')) {
      document.querySelectorAll('.header__select--selected._active').forEach(thisSelected => {
        thisSelected.classList.remove('_active')
      })
    }



    let headerProfileSettingsOpen = thisTarget.closest('.header__profile--settings-open'),
        headerProfileSettings = document.querySelector('.header__profile--settings');
    if(headerProfileSettingsOpen) {
      event.preventDefault();

      headerProfileSettings.classList.add('_active');

    } else if(!thisTarget.closest('.header__profile--settings') || !thisTarget.closest('.header__profile--settings-open') || thisTarget.closest('.header__profile--settings-close')) {
      headerProfileSettings.classList.remove('_active');
    }

    /* let headerProfileSettingsClose = thisTarget.closest('.header__profile--settings-close');
    if(headerProfileSettingsClose) {
      event.preventDefault();

      headerProfileSettings.classList.add('_active');

    } */


    let chartSettingsLink = thisTarget.closest('.chart__settings--link');
    if(chartSettingsLink) {
      event.preventDefault();

      let chartWrapper = document.querySelector('.chart__wrapper'),
          chartPopup = chartWrapper.parentElement.querySelector('.chart__settings-popup');

      chartPopup.classList.add('_active');
      chartWrapper.classList.add('_blur');

    } else if((!thisTarget.closest('.chart__settings-popup') && !thisTarget.closest('.chart__settings-popup--btn')) || thisTarget.closest('.chart__settings-popup--close')) {

      
      let chartWrapper = document.querySelector('.chart__wrapper'),
          chartPopup = chartWrapper.parentElement.querySelector('.chart__settings-popup');

      chartPopup.classList.remove('_active');
      chartWrapper.classList.remove('_blur');

    }
})

let verificationInputs = document.querySelectorAll('.login__verification--input');
verificationInputs.forEach(thisInput => {

  thisInput.oninput = function(event) {
    
    if(event.inputType == 'insertText') {

      let nextElement = event.target.parentElement.nextElementSibling,
          form = event.target.closest('form');

      thisInput.value = thisInput.value[thisInput.value.length-1].replace(/\D/g,'').substr(0,9);

      if(nextElement.classList.contains('login__verification--label') && thisInput.value) {
        nextElement.querySelector('input').focus();
      }

      

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

    thisTimerElem.style.display = 'block';
    thisTimerElem.nextElementSibling.style.display = 'none';

    let seconds = thisTimerElem.dataset.timer;
    seconds = Number(seconds.substring(0, thisTimerElem.dataset.timer.length - 1));

    function timerFunc() {
      thisTimerElem.textContent = seconds + 's';

      if(seconds == 0) {
        clearTimeout(timerInterval);
        thisTimerElem.parentElement.classList.remove('_disabled');
        thisTimerElem.style.display = 'none';
        thisTimerElem.nextElementSibling.style.display = 'block';
      } else {
        seconds--;
      }
    }

    timerFunc();

    let timerInterval = setInterval(timerFunc, 1000)

  });

}

timer();

// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

let loginSlider = new Swiper('.login__slider', {
  
    spaceBetween: 30,
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }

}); 

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=
