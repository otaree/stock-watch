$(document).ready(function () {
    var lineChart;

    function addStocksCard(stocks) {
        for (var i = 0; i < stocks.length; i++) {
            var card = '<div class="card float-left stock mr-3" style="width: 22rem; height: 10rem;" <div class="card-body" data-stock="';
            card += stocks[i] + '">';
            card += "<button class='close text-right' aria-label='Close' type='close' data-stock='" + stocks[i] + "'><span aria-hidden='true'>×</span></button>";
            card += '<h3 class="card-text m-3 ml-5">';
            card += stocks[i] + "</h3>";

            card += ' </div></div>';
            $(".add").before(card);
        }


    }

    function getStocks() {
        $('.alertStock').remove();
        $("button").prop("disabled", true);
        $.get("/stocks", function (data, status) {
            $("button").prop("disabled", false);
            if (data['SUCCESS']) {
                $(".stock").remove();
                addStocksCard(data.stocks);
                if (lineChart) {
                    lineChart.destroy();
                }
                lineChart = new Chart(document.getElementById("line-chart"), {
                    type: 'line',
                    data: data["results"],
                    options: {
                        responsive: false,
                        title: {
                            display: true,
                            text: 'Market'
                        }
                    }
                });
            } else {
                if (data.empty) {
                    if (lineChart) {
                        lineChart.destroy();
                    }
                }
                $('h1').after('<div class="alert alert-warning alertStock" role="alert">' + data.text + '</div>')
            }
        });
    }

    getStocks();

    $(".add_button").click(function () {
        var stockName = $("input:text").val();
        var add = $("button");
        if (stockName) {
            add.prop("disabled", true);
            $.ajax({
                type: "POST",
                method: 'POST',
                url: "/checkstock",
                data: {
                    stock: stockName
                },
                success: function (data) {
                    add.prop("disabled", false);
                    if (data['SUCCESS']) {
                        getStocks();
                        $(".add .card-subtitle").html("");
                    } else {
                        $(".add .card-subtitle").html('<div class="alert alert-danger float-left" role="alert">' + data.text + '</div>');
                    }

                },
                error: function (e) {
                    add.prop("disabled", false);
                    alert("Oops! Something went wrong.");

                }
            });
        }

    });

    // delete the stock
    $("body").on("click", ".close", function () {
        var close = $(this);
        var stock = close.data("stock");
        close.prop("disabled", true);
        $.ajax({
            type: "POST",
            method: 'POST',
            url: "/deletestock",
            data: {
                stock: stock
            },
            success: function (data) {
                close.prop("disabled", false);
                if (data['SUCCESS']) {
                    $("[data-stock~='" + stock + "']").remove();
                    getStocks();
                } else {
                    alert("Oops! Something went wrong.");
                }

            },
            error: function (e) {
                close.prop("disabled", false);
                alert("Oops! Something went wrong.");

            }
        });
    });
});