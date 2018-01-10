var express = require('express');
var router = express.Router();
var getQuotes = require('../controller/getStock');
var yahooFinance = require('yahoo-finance');
var Stock = require('../models/stock');
var randomcolor = require('randomcolor');

/* GET home page. */
router.get('/', function (req, res, next) {
  //AAPL,GOOGL
  res.render('index', {
    title: ""
  });
});

router.get('/test', (req, res, next) => {
  res.json({
    text: "Test GET"
  });
});


router.get("/stocks", (req, res, next) => {
  var query = Stock.find({}).exec();
  query
  .then((docs) => {
    if (docs.length > 0) {
      let chartData = {};
      let datasets = [];
      let stocks = [];
      let labelsCount = 0;
      for (let i = 0; i < docs.length; i++) {
        if (labelsCount === 0) {
          chartData.labels = docs[i].dates;
          labelsCount++;
        }
        let obj = {};
        obj.data = docs[i].data;
        obj.label = docs[i].symbol;
        stocks.push(docs[i].symbol)
        obj.borderColor = randomcolor();
        obj.fill = false;
        datasets.push(obj);
      }
      chartData.datasets = datasets;
      res.json({
        "SUCCESS": true,
        results: chartData,
        stocks: stocks
      });
    } else {
      res.json({
        "SUCCESS": false,
        empty: true,
        text: "No stock. Please add stock"
      });
    }
  })
  .catch((e) => {
    res.json({
      "SUCCESS": false,
      empty: false,
      text: "Opps...something went wrong"
    });
  });
});


router.post("/checkstock", (req, res, next) => {
  let symbol = req.body.stock;
  console.log(symbol);
  var query = Stock.findOne({
    symbol: symbol
  }).exec();
  query
    .then((doc) => {
      if (doc) {
        res.json({
          "SUCCESS": false,
          text: "Already present"
        });
      } else {
        getQuotes(symbol)
          .then((stock) => {
            if (stock) {
              let newStock = new Stock({
                symbol: stock.symbol,
                data: stock.data,
                dates: stock.date
              });
              newStock.save();
              res.json({
                "SUCCESS": true,
              })
            } else {
              res.json({
                "SUCCESS": false,
                text: "Invalid Stock"
              });
            }
          })
          .catch((e) => {
            res.json({
              "SUCCESS": false,
              text: "Something went wrong"
            });
          });
      }
    });

});


router.post("/deletestock", (req, res, next) => {
  console.log(req.body.stock);
  Stock.remove({
    symbol: req.body.stock
  }, (err) => {
    if (err) {
      res.json({
        "SUCCESS": false
      });
    }
    res.json({
      "SUCCESS": true
    });

  });
});

module.exports = router;