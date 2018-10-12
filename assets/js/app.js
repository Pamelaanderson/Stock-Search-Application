$(document).ready(function () {

    //creating an array of stocks to display
    const stocksList = ['GOOG', 'MSFT', 'AMZN', 'TSLA', 'FB', 'MSFT'];

    //diplayStockInfor re-renders the HTML to display appropriate content
    const displayStockInfo = function () {

        // grab stock symbol from btn clicked and adds to queryURL
        const stock = $(this).attr('data-name');
        const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,logo&range=1m&last=10`;

        //creating ajax call for stock btn being clicked
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            //storing name, logo, price, and symbol
            const companyName = response.quote.companyName;
            const companyLogo = response.logo.url;
            const stockPrice = response.quote.latestPrice;
            const stockSymbol = response.quote.symbol;

            //creating the div to hold each of the stock information 
            const divBody = $('<div>');
            divBody.addClass('card');
            const divContent = $('<div>');
            divContent.addClass('card-body');

            // creating an element to display the stock information 
            const nameHolder = $('<p>').text(`Company Name: ${companyName}`);
            const logoHolder = $(`<img src = "${companyLogo}">`);
            const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);
            const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);

            //create the button id to add info to the stock information
            const additional = $(`<button id ='addinfo'></button> <br>`)

            // appending each stock info to our divContenet
            divContent.append(nameHolder); divContent.append(logoHolder);
            divContent.append(priceHolder);
            divContent.append(symbolHolder);

            divContent.append(additional);

            // Now we have to append the divcotent to the new divBody in our html( these are from the previous append step of each stock info) instead of appending each one
            divBody.append(divContent);
            $('#info').append(divBody);

            //creating an eleemtn to display the news information with each stock
            const newsBody = $('<div>');
            newsBody.addClass('card');
            const newsContent = $('<div>');
            newsContent.addClass('card-body');

            //storing the news 
            const companyNews = response.news;

            //looping through the news array to grab the headlines- 
            for (let i = 0; i < companyNews.length; i++) {
                const headline = response.news[i].headline;
                const url = response.news[i].url;
                newsContent.append(`<p> <a href = "${url}" target="_blank"> ${headline} </a> </p>`);
            }
            // the top news div appended to the newsbody to show
            $('#news').append(`<h5 class="card-header">Top News</h5>`);
            newsBody.append(newsContent);
            $('#news').append(newsBody);

            //function to rerender the list
            const additionalInfo = function () {

                const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/company`;
                //Bonus: display the ceo and addition information if time persists 
                //I did not get to complete this step by adding more of the buisness information because of time and struggling with how to do it
                $.ajax({
                    url: queryURL,
                    method: 'GET'
                }).then(function (response) {

                })
            }
        });
        // deleting the info and news prior to adding new or they'll repeat
        $('#info').empty();
        $('#news').empty();
    };

    // function for displaying stock data
    const render = function () {

        // Deleting the stocks prior to adding new stocks
        $('#buttons').empty();

        //looping through the array of stocks
        for (let i = 0; i < stocksList.length; i++) {

            //generating buttons for each stock in array
            const button = $('<button>');

            // Adding a class of stock-btn to our button
            button.addClass('btn btn-outline-secondary ticker');

            // Adding a data-attribute
            button.attr('data-name', stocksList[i]);

            // providing the initial button text
            button.text(stocksList[i]);

            //adding the button to the buttons div
            $('#buttons').append(button);
        }
    }


    //function that handles events where one button is clicked
    const addButton = function (event) {

        event.preventDefault();

        const validationList = [];
        const URL = `https://api.iextrading.com/1.0/ref-data/symbols`;

        $.ajax({
            url: URL,
            method: 'GET'
        }).then(function (response) {

            // loops through the array list
            for (let i = 0; i < response.length; i++) {

                // adds stocks
                validationList.push(response[i].symbol);

                // This line will grab the text from the input box
                const stock = $('#stockName').val().trim();

                // validating to make sure only valid stock symbols are accepted
                if (validationList.includes(stock) && !stocksList.includes(stock)) {

                    stocksList.push(stock);

                    // Deletes the contents of the input
                    $('#stockName').val('');

                    render();
                }

            }

        })

    }

    //Event listeners
    $('#add').on('click', addButton);
    $('#buttons').on('click', '.ticker', displayStockInfo);

    //calling teh renderButtons function to display the initial buttons
    render();
})