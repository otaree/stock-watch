$(document).ready(function () {
    var lineChart;

    function addStocksCard(stocks) {
        for (var i = 0; i < stocks.length; i++) {
            var card = '<div class="card float-left stock" style="width: 22rem; height: 10rem;" <div class="card-body" data-stock="';
            card += stocks[i].replace("NASDAQ:", "") +'">';
            card += "<button class='close text-right' aria-label='Close' type='close' data-stock='"+ stocks[i].replace("NASDAQ:", "") +"'><span aria-hidden='true'>×</span></button>";
            card += '<h3 class="card-text m-3 ml-5">';
            card += stocks[i].replace("NASDAQ:", "") + "</h3>";
           
            card += ' </div></div>';
            $(".add").before(card);
        }


    }

    // generate random hex color
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function parseStockData(datas) {
        var returnObj = {};
        var datasets = [];
        for (var data in datas) {
            if (data === "dates") {
                returnObj.labels = datas[data];
            } else {
                var obj = {};
                obj.data = datas[data];
                obj.label = data.replace("NASDAQ:", "");
                obj.borderColor = getRandomColor();
                obj.fill = false;
                datasets.push(obj);
            }

        }
        returnObj.datasets = datasets;
        return returnObj;
    }

    function getStocks(data) {
        var stocks;
        $("button").prop("disabled", true);
        if (data) {
            stocks = $("canvas").data("stocks") + "," + data;
        } else {
            stocks = $("canvas").data("stocks");
        }
        

        $.ajax({
            type: "POST",
            method: 'POST',
            url: "/stocks",
            data: {
                stocks: stocks
            },
            success: function (data) {
                $("button").prop("disabled", false);
                $(".stock").remove();
                addStocksCard(stocks.split(","));
                if (data['SUCCESS']) {
                    
                    if (lineChart) {
                        lineChart.destroy();
                    }
                    lineChart = new Chart(document.getElementById("line-chart"), {
                        type: 'line',
                        data: parseStockData(data["results"]),
                        options: {
                            responsive: false,
                            title: {
                                display: true,
                                text: 'Market'
                            }
                        }
                    });
                }
            },
            error: function (e) {
                $("button").prop("disabled", false);
                alert("Oops! Something went wrong.");

            }
        });
    }

    getStocks();
   

    $(".add").click(function () {
        var stockName = $("input:text").val();
        if (stockName) {
            $.ajax({
                type: "POST",
                method: 'POST',
                url: "/checkstock",
                data: {
                    stock: stockName
                },
                success: function (data) {

                    if (data['SUCCESS']) {
                        getStocks(data.stock);
                        $(".add .card-subtitle").html("");
                    } else {
                        $(".add .card-subtitle").html('<div class="alert alert-danger float-left" role="alert">Invalid Stock</div>');
                    }

                },
                error: function (e) {
                    console.log(e);
                    alert("Oops! Something went wrong.");

                }
            });
        }

    });

    // delete the stock
    $("body").on("click", ".close", function () {
        var close = $(this);
        var stock = close.data("stock");
        $("[data-stock~='" + stock + "']").remove();
        close.remove();
    });
});