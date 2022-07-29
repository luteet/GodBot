window.addEventListener('DOMContentLoaded', function() {


    let chart = [], chartTextColor;

    function chartFunc(arg) {

    let ctx = document.querySelectorAll('.chart-elem');
    let ctx2D = [];

    ctx.forEach(thisCtx => {
        ctx2D[ctx2D.length] = thisCtx.getContext("2d");
    })

    let width, height, gradient;
    function getGradient(ctx, chartArea) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgb(255,0,0)');
        gradient.addColorStop(0.5, 'rgb(0,0,255)');
        gradient.addColorStop(0.5, 'rgb(255,0,0)');
        gradient.addColorStop(1, 'rgb(255,0,0)');
        }

        return gradient;
    }
    /*   function gradient(startColor, lastColor) {

        ctx2D.forEach(thisCtx2D => {
        ctx2D[ctx2D.length] = thisCtx.getContext("2d");
        })

        let gradient = ctx2D.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, lastColor);

        return gradient;
    } */

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

    if(ctx.length) { 

        ctx.forEach(thisCtx => {

        const data = {
            labels: ['01.07.22', '02.07.22', '03.07.22', '04.07.22', '05.07.22', '06.07.22', '07.07.22'],
            datasets: [
            {
                label: 'Line 1',
                data: [11000, 14000, 13000, 12000] /* repeatData(10, (labels.length / 3), 0) */,
                backgroundColor: 'rgba(202, 57, 12, 0)',
                /* borderColor: [
                    'rgba(202, 57, 12, 1)'
                ], */
                borderColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
            
                    if (!chartArea) {
                    // This case happens on initial chart load
                    return;
                    }
                    return getGradient(thisCtx.getContext("2d"), chartArea);
                },
                pointRadius: 0,
                borderWidth: 1,
                cubicInterpolationMode: 'monotone',
                fill: true,
                tension: 0.4
                
            },
            {
                label: 'Line 2',
                data: [9000, 8000, 11000, 15000]/* repeatData(15, labels.length, (labels.length / 2)) */,
                backgroundColor: 'rgba(202, 57, 12, 0)',
                borderColor: [
                'rgba(27, 163, 73, 1)'
                ],
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 1,
                cubicInterpolationMode: 'monotone',
                fill: true,
                tension: 0.4
            },
            {
            label: 'Line 3',
            data: [11000, 9000, 12000, 14000]/* repeatData(35, labels.length, (labels.length / 2)) */,
            backgroundColor: 'rgba(27, 163, 73, 1)',
            borderColor: [
                'rgba(27, 163, 73, 1)'
            ],
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            fill: false,
            tension: 0.4
            },
            {
            label: 'Dashed',
            data: [10000, 12000, 14000, 13000] /* repeatData(45, labels.length, (labels.length / 2)) */,
            borderColor: [
                'rgba(202, 57, 12, 1)'
            ],
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 1,
            borderDash: [5, 5],
            cubicInterpolationMode: 'monotone',
            fill: false,
            tension: 0.4
        }
        ]
        };

        chart[chart.length] = new Chart(ctx2D[chart.length], {
            type: 'line',
            data: data,
            options: {
            responsive: true,

            crosshair: {
                line: {
                color: '#F66',  // crosshair line color
                width: 1,
                dashPattern: [3,3]        // crosshair line width
                },
                sync: {
                enabled: true,            // enable trace line syncing with other charts
                group: 1,                 // chart group
                suppressTooltips: false   // suppress tooltips when showing a synced tracer
                },
                zoom: {
                enabled: true,                                      // enable zooming
                zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
                zoomboxBorderColor: '#48F',                         // border color of zoom box
                zoomButtonText: 'Reset Zoom',                       // reset zoom button text
                zoomButtonClass: 'reset-zoom',                      // reset zoom button class
                },
                callbacks: {
                beforeZoom: () => function(start, end) {                  // called before zoom, return false to prevent zoom
                    return true;
                },
                afterZoom: () => function(start, end) {                   // called after zoom
                }
                }
            },
            
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
                    grid: {
                    display: false,
                    borderColor: 'rgba(0,0,0,0)',
                    },
                    
                },
            },
            
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

        
        
        })
        

    }
    }
})