const body = document.querySelector('body'),
    html = document.querySelector('html'),
    menu = document.querySelectorAll('._burger, .header__nav, body'),
    burger = document.querySelector('._burger'),
    header = document.querySelector('.header');

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
let customPromptCheck = true;

function resize() {
  headerBlocks.forEach(selectBlock => {
    
    if(selectBlock.getBoundingClientRect().x < 0) {
      selectBlock.classList.add('_left')
    }
  
  })

  let prompt = document.querySelector('.custom-prompt-message'),
      customPrompt = document.querySelector('.сustom-prompt');
  
  if(prompt && customPrompt && customPromptCheck) {
    prompt.classList.remove('_visbile');
    customPromptCheck = false;
    setTimeout(() => {
      prompt.remove();
      customPrompt.classList.remove('_active');
      customPromptCheck = true;
    },200)
  }
}

resize();

window.onresize = resize;


// =-=-=-=-=-=-=-=-=-=-=-=- <chart> -=-=-=-=-=-=-=-=-=-=-=-=

let chart = [], chartTextColor, pageBg;

if(localStorage.getItem('godbot-pro-theme') == 'dark') {

  body.classList.add('_dark-theme');

  chartTextColor = '#9899A6';
  pageBg = 'rgba(0, 0, 0, 0)';
  
} else {

  body.classList.remove('_dark-theme');

  chartTextColor = '#262628';
  pageBg = '#FFFFFF';

}

let width, height, gradient;
function getGradient(ctx, chartArea, startColor, endColor) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {

        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.7, endColor);
        gradient.addColorStop(1, startColor);

    }

    return gradient;
}

function chartFunc(arg) {

  let ctx = document.querySelector(arg.id);
  let ctx2D = ctx.getContext("2d");

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

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('chart__tooltip');
      let tooltipElBody = document.createElement('div');
      tooltipElBody.classList.add('chart__tooltip--body');
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.transition = 'all .2s ease';
  
      tooltipEl.appendChild(tooltipElBody);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart),
          tooltipElBody = document.createElement('div'),
          tooltipTitle = document.createElement('h4'),
          tooltipDate = document.createElement('span'),
          tooltipPrice = document.createElement('strong');
    tooltipEl.style.setProperty('--line-height', 0 + 'px')
    
    tooltipElBody.classList.add('chart__tooltip--body');
    tooltipTitle.classList.add('chart__tooltip--title');
    tooltipDate.classList.add('chart__tooltip--date');
    tooltipPrice.classList.add('chart__tooltip--price');

    tooltipTitle.textContent = tooltip.dataPoints[0].dataset.label;
    tooltipPrice.textContent = `Price: ${tooltip.dataPoints[0].formattedValue}`;
    
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);

      titleLines.forEach(title => {
        tooltipDate.textContent = title;
      });
      
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
      });
  
      const root = tooltipEl.querySelector('.chart__tooltip--body');
  
      while (root.firstChild) {
        root.firstChild.remove();
      }

      root.appendChild(tooltipTitle);
      root.appendChild(tooltipDate);
      root.appendChild(tooltipPrice);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
    
    let resultHeight = 0;
    
    if(tooltipEl.closest('.chart-crosshair')) {
      let parent = tooltipEl.closest('.chart-crosshair'),
          canvas = parent.querySelectorAll('canvas');

      canvas.forEach(canvas => {        
        resultHeight += canvas.offsetHeight;
      })
    }

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    //tooltipEl.style.setProperty('--line-height', tooltipEl.style.setProperty('--line-height', chart.chartArea.height - tooltip.caretY + tooltipEl.offsetHeight + 70 + 'px') + 'px')
    if(resultHeight) tooltipEl.style.setProperty('--line-height', chart.chartArea.height - tooltip.caretY + tooltipEl.offsetHeight + 70 + 'px')
    
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
    id: arg.htmlLegendId,
    afterUpdate(chart, args, options) {
      
      const ul = getOrCreateLegendList(chart, arg.legendContainer);
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

  const logo = new Image();
  logo.src = '../img/chart-logo.svg';

  const chartLogo = {
    id: 'custom_canvas_background_image',
    beforeDraw: (chart) => {
      if (logo.complete) {
        
        const ctx = chart.ctx;
        const {top, left, width, height} = chart.chartArea;
        logo.width = width/2;
        logo.height = logo.width/11;
        const x = left + width / 2 - logo.width / 2;
        const y = top + height / 2 - logo.height / 2;
        ctx.drawImage(logo, x, y, logo.width, logo.height);
      } else {
        logo.onload = () => chart.draw();
      }
    }
  };

  const chartBgColor = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = pageBg;
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };


  chart[chart.length] = new Chart(ctx2D, {
    type: 'line',
    data: arg.data,
    options: {
      responsive: true,

      layout: arg.layout,
      
      interaction: {
        intersect: false,
      },

      scales: {
          y: {
            grid: {
              display: true,
              color: '#AFCDEB',
              borderDash: [5,5],
              borderColor: 'rgba(0,0,0,0)',
            },
            title: arg.yTitle,
            ticks: {
              color: chartTextColor,
              font: {
                family: "'Montserrat', sans-serif",
                size: 12,
              },
              callback: function (value) {
                if(value >= 1000) {
                  return (value / 1000).toFixed(0) + "K";
                } else {
                  return value;
                }
              }
            }
          },
          
          x: {
            ticks: {
              color: chartTextColor,
              font: {
                family: "'Montserrat', sans-serif",
                size: (arg.hideLabels) ? 0 : 12,
              },
            },
            grid: {
              display: false,
              
              borderColor: 'rgba(0,0,0,0)',
            },
            
          },
      },
      
      plugins: {
        
          htmlLegend: {
              containerID: arg.legendContainer,
          },

          tooltip: {
            enabled: false,
            position: 'nearest',
            external: externalTooltipHandler
          },

          legend: {
              display: (arg.legend) ? arg.legend : false,
          },

          labels: {
            display: false,
            usePointStyle: true,
          },
          
      }
    },
    plugins: (arg.legendContainer && arg.htmlLegendId) ? [htmlLegendPlugin, chartLogo, chartBgColor] : [chartLogo, chartBgColor],

  })

  /* chart[chart.length].afterEvent('mousemove', function (param) {
    console.log(param)
  }) */
    
}

let chartBar = [];

function barChart(arg) {
  let ctx = document.querySelector(arg.id);
  let ctx2D = ctx.getContext("2d");

  chartBar[chartBar.length] = new Chart(ctx2D, 
    {
      type: 'bar',
      data: arg.data,
      options: {
        legend: {
          display: false
        },

        layout: arg.layout,
        
        /* responsive: true, */

        plugins: {
          tooltip: {
            enabled: false,
            mode: 'interpolate',
            intersect: false
          },
          labels: {
            display: false,
          },
          legend: {
            display: false,
            labels: {
                display: false,
                /* color: 'rgb(255, 99, 132, 0)' */
            }
          }
        },
        scales: {
          x: {
            display: false,
            stacked: true,
            /* ticks: {
              font: {
                size: 0,
              },
            }, */
            grid: {
              display: false,
              borderColor: 'rgba(0,0,0,0)',
            },
          },
          y: {
            /* display: false, */
            stacked: true,
            grid: {
              display: false,
              borderColor: 'rgba(0,0,0,0)',
            },
            ticks: {
              color: 'rgba(0,0,0,0)'
            },
            /* ticks: {
              color: chartTextColor,
              font: {
                size: 12,
              },
              callback: function (value) {
                if(value >= 1000) {
                  return (value / 1000).toFixed(0) + "K";
                } else {
                  return value;
                }
              }
            } */
          }
        }
      }
    })
}

function counstructBarChart(arg) {

  const block = document.querySelector(arg.id),
        chartId = arg.chartId;

  if(block) {

    let widthChart, paddingLeft, lengthLabels;
    chart.forEach(chart => {
      if(chart.canvas.id == chartId) {

        lengthLabels = chart.data.labels.length;
        widthChart = chart.chartArea.width + chart.chartArea.left;
        paddingLeft = chart.chartArea.left;

      }
    })

    let data = arg.data, items = [], wrapper = document.createElement('div');
    wrapper.classList.add('chart-bar');

    for(let index = 0; index < data.length; index++) {
      items.push(`
      <div class="chart-bar-item">
        <div class="chart-bar-item-plus">
            <div class="chart-bar-item-value" style="height: ${data[index][0]}%;"></div>
        </div>
        <div class="chart-bar-item-minus">
            <div class="chart-bar-item-value" style="height: ${data[index][1]}%"></div>
        </div>
      </div>`)
    }

    items.forEach(item => {
      wrapper.insertAdjacentHTML("beforeEnd", item);
    })

    block.append(wrapper);

    let item = document.querySelectorAll('.chart-bar-item');
    
    wrapper.style.width = widthChart + widthChart/lengthLabels + 'px'
    wrapper.style.paddingLeft = paddingLeft + 'px';
    wrapper.style.transform = `translateX(-${item[0].offsetWidth/2}px)`;

    window.onresize = function() {
      chart.forEach(chart => {
        if(chart.canvas.id == chartId) {
          widthChart = chart.chartArea.width + chart.chartArea.left,
          paddingLeft = chart.chartArea.left;
        }
      })

      wrapper.style.width = widthChart + widthChart/lengthLabels + 'px'
      wrapper.style.paddingLeft = paddingLeft + 'px';
      wrapper.style.transform = `translateX(-${item[0].offsetWidth/2}px)`;
    }

    if(arg.title) {
      block.insertAdjacentHTML("afterbegin", `<div class="chart-bar-title">${arg.title}</div>`);
      
    }

  }

}

// =-=-=-=-=-=-=-=-=-=-=-=- </chart> -=-=-=-=-=-=-=-=-=-=-=-=

let thisTarget, traderNavCheck = true;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

    if (thisTarget.closest('._burger')) {
      menu.forEach(elem => {
          elem.classList.toggle('_active')
      })
    }


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
        pageBg = 'rgba(0, 0, 0, 0)';

        if(chart.length)  {
          chart.forEach(chart => {
            chart.options.scales.y.ticks.color = chartTextColor;
            chart.options.scales.x.ticks.color = chartTextColor;
            chart.update();
          })
        }
        
      } else if(!headerThemeSwitch.classList.contains('_active')) {

        localStorage.setItem('godbot-pro-theme', 'light');
        body.classList.remove('_dark-theme');

        chartTextColor = '#262628';
        pageBg = '#FFFFFF';

        if(chart.length)  {
          chart.forEach(chart => {
            chart.options.scales.y.ticks.color = chartTextColor;
            chart.options.scales.x.ticks.color = chartTextColor;
            chart.update();
          })
        }

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



    let chartSettingsLink = thisTarget.closest('.chart__settings--link');
    if(chartSettingsLink) {
      event.preventDefault();

      let chartWrapper = document.querySelector('.chart__wrapper'),
          chartPopup = chartWrapper.parentElement.querySelector('.chart__settings-popup');

      chartPopup.classList.add('_active');
      chartWrapper.classList.add('_blur');

    } else if((!thisTarget.closest('.chart__settings-popup') && !thisTarget.closest('.chart__settings-popup--btn')) || thisTarget.closest('.chart__settings-popup--close')) {

      
      let chartWrapper = document.querySelector('.chart__wrapper'),
          chartPopup = (chartWrapper) ? chartWrapper.parentElement.querySelector('.chart__settings-popup') : false;

      if(chartPopup) {
        chartPopup.classList.remove('_active');
        chartWrapper.classList.remove('_blur');
      }
      
    }



    let traderTabNavLink = thisTarget.closest('.trader__tab-nav--link');
    if(traderTabNavLink) {
      event.preventDefault();

      if(traderNavCheck) {

        let parent = traderTabNavLink.parentElement,
            tabWrapper = document.querySelector('.tab-wrapper'),
            idBlock = traderTabNavLink.getAttribute('href');

        if(!parent.classList.contains('_active') && traderNavCheck) {
          traderNavCheck = false;
      
          document.querySelectorAll('.trader__tab-nav--item').forEach(traderTabItem => {
            traderTabItem.classList.remove('_prev');
            traderTabItem.classList.remove('_active');
            traderTabItem.classList.remove('_next');
          })
  
          parent.classList.add('_active');
          
          let next = parent.nextElementSibling,
              prev = parent.previousElementSibling;
  
          if(prev) prev.classList.add('_prev');
          if(next) next.classList.add('_next');

          document.querySelectorAll('.tab-block').forEach(tabBlock => {
            tabBlock.classList.remove('_visible')
            tabWrapper.style.minHeight = tabWrapper.offsetHeight + 'px';
            setTimeout(() => {
              tabBlock.classList.remove('_active');
            },200)
          })

          let tabBlockActive = document.querySelector(idBlock);
          
          setTimeout(() => {
            tabBlockActive.classList.add('_active');
            tabWrapper.style.minHeight = 0 + 'px';
            setTimeout(() => {
              tabBlockActive.classList.add('_visible');
              traderNavCheck = true;
            },100)
          },200)
          
        }

      }
      
    }
})

/* function createCustomPrompt(elem) {
  let prompt = document.createElement('div'),
      promptBody = document.createElement('div'),
      text = elem.dataset.сustomPromptText,
      pos = elem.getBoundingClientRect();

  prompt.classList.add('custom-prompt-message');
  promptBody.classList.add('custom-prompt-message-body');

  prompt.append(promptBody);  

  document.body.append(prompt);
  promptBody.textContent = text;
  
  prompt.style.left = (pos.left - (prompt.offsetWidth / 2) + (elem.offsetWidth / 2)) + 'px';
  prompt.style.top = (pos.top + elem.ownerDocument.defaultView.pageYOffset - prompt.offsetHeight) + 'px';

  if((prompt.getBoundingClientRect().left + prompt.offsetWidth + 50) > body.offsetWidth) {
    prompt.classList.add('_right-pos');
  }

  setTimeout(() => {
    prompt.classList.add('_visible');
  },100)

} */

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

/* const customPrompt = document.querySelectorAll('.сustom-prompt');
customPrompt.forEach(customPrompt => {

  customPrompt.addEventListener('mouseover', function(event) {

    let customPromptTarget = event.target.closest('.сustom-prompt');
    if(customPromptTarget) {
      if(!customPromptTarget.classList.contains('_active')) {
        customPromptTarget.classList.add('_active');

        createCustomPrompt(customPromptTarget);
  
      }
      
    }
    
  });

  customPrompt.addEventListener('mouseout', function(event) {

    let customPromptTarget = event.target.closest('.сustom-prompt');
    if(customPromptTarget) {
      if(customPromptTarget.classList.contains('_active')) {
        customPromptTarget.classList.remove('_active');
  
        let prompt = document.querySelector('.custom-prompt-message');
        prompt.classList.remove('_visible');
        setTimeout(() => {
          prompt.remove();
        },200)
        
  
      }
      
    }
    
  });

}) */


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
