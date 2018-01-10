new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
        labels: ['Jan 03 17',
            'Jan 13 17',
            'Jan 23 17',
            'Feb 02 17'
        ],
        datasets: [{
            data: [811.44,
                813.43,
                813.74,
                828.96,
                830.43,
                829.41,
                829.9,
                830.38,
                834.65,
                830.18,
                829.81,
                833,
                829.24,
                845.54,
                851.52,
                858.79,
                861,
                867,
                837.23,
                823.07,
                824,
                824.56
            ],
            label: 'NASDAQ:GOOGL',
            borderColor: "#3e95cd",
            fill: false
        }, {
            data: [116.33,
                116.51,
                116.86,
                118.16,
                119.43,
                119.38,
                119.93,
                119.3,
                119.62,
                120.24,
                120.5,
                120.09,
                120.45,
                120.81,
                120.1,
                122.1,
                122.44,
                122.35,
                121.63,
                121.39,
                130.49,
                129.39
            ],
            label: 'NASDAQ:AAPL',
            borderColor: "#8e5ea2",
            fill: false
        }, ]
    },
    options: {
        responsive: false,
        title: {
            display: true,
            text: 'Market'
        }
    }
});