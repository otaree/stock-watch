var yahooFinance = require('yahoo-finance');
let date = require('date-and-time');



// Now we will define our date comparison functions. These are callbacks
// that we will be providing to the array sort method below.
var date_sort_asc = function (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // ASCENDING order. As you can see, JavaScript's native comparison operators
    // can be used to compare dates. This was news to me.
    date1 = new Date(date1);
    date2 = new Date(date2);
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  };

function parseQuotes(quotes, symbol) {
    if (quotes.length === 0) {
        return null;
    } else {
        let returnObj = {};
        let data = [];
        let date = [];
        for (let i = 0; i < quotes.length; i++) {
            if(quotes[i].close) {
                data.unshift(quotes[i].close);
                date.unshift(quotes[i].date);
            }
          
        }
        returnObj.symbol = symbol;
        returnObj.data = data;
        returnObj.date = date
        //returnObj.date = date.sort(date_sort_asc);
        return returnObj;
    }

}

function formatDate(result) {
    if (result) {
        let arr = [];
        for(let i = 0; i < result.date.length; i++) {
            arr.push(date.format(result.date[i], 'MMM YY'))
        }
        result.date = arr;
        return result;
    } else {
        return null;
    }
 
}



function getStock(symbol) {
    symbol = symbol.toUpperCase();
    return new Promise((resolve, reject) => {
        yahooFinance.historical({
            symbol: symbol,
            from: '2017-01-01',
            to: '2018-01-02',
            period: 'm'
            // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
          })
          .then((quotes) => {
                return parseQuotes(quotes,symbol);           
          })
          .then((quotes) => {
              resolve(formatDate(quotes));
          })
          .catch((e) => {
              reject(e);
          });
    });
}


module.exports = getStock;
/*
getStock(symbol)
.then((stock) => {
    if (stock) {
        let newStock = new Stock({
            symbol: stock.symbol,
            data: stock.data,
            dates: stock.date
        });
        return newStock.save();
    } else {
        return null;
    }
})
.then(console.log)
.catch(console.log);


.then((datas) => {
    let stock = new Stock({
        symbol: datas.symbol,
        data: datas.data,
        dates: datas.date
    });
    return stock.save();
})
.then(console.log)
.catch(console.log);
*/
