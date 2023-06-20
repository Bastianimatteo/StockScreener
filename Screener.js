array = ["UCG.MI", "ISP.MI", "ENEL.MI", "ENI.MI", "LVMH.MI", /*"STLAM.MI",*/ "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NIO", "CSIQ", "MU", "PG", "ASML", "NFLX", "QCOM", "PFE", "RIVN", "RBLX", "NVDA", "U", "BE", "FCEL", "AMD", "META", "INTC", "PARA", "PLUG", "NKLA", "T", "BYND", "BAC", "PYPL", "KO", "GS", "JPM", "CGC", "SPWR", "TSM", "NEL.OL", "RUN", "SNY", "NVS", "JNJ", "BNTX", "MRNA", "NTLA", "BIIB", "AEM", "PSA", "SBSW"];

array_crypto = ["BTC-USD", "ETH-USD", "SOL-USD", "CRO-USD", "BNB-USD", "XRP-USD", "ADA-USD"];

var xhttp = [];
var xhttp_b = []
var xhttp_c = [];
var xhttp_d = [];
var xhttp_crypto = [];

var response = [];
var response_b = []
var response_c = [];
var response_d = []
var response_crypto = [];

var data = [];
var data_b = []
var data_c = [];
var data_d = []
var data_crypto = [];

var sorted_data = [];
var sorted_data_b = []
var sorted_data_c = [];
var sorted_data_d = []

var filtered_data = [];
var filtered_data_b = []
var filtered_data_c = [];
var filtered_data_d = []

var tb = document.getElementById("tbody");
var tb_crypto = document.getElementById("tbody_crypto");
var change_position = 10;
var change_crypto_position = 2;


var mancanti = array.length;
var mancanti_b = array.length;
var mancanti_c = array.length;
var mancanti_d = array.length
var mancanti_crypto = array_crypto.length;
var err = 0; //serve per non loggare in console arr.length volte "Network error"
var full = false;

const d_left = document.getElementById("div_left").style;
const d_crypto = document.getElementById("div_crypto").style;
const d_right = document.getElementById("div_right").style;
const d_countdown = document.getElementById("div_countdown").style;
d_right.visibility = "hidden";

page_size();
countdown();

for(let i=0, j=0; i<array.length; i++)
{
    xhttp[i] = new XMLHttpRequest();
    xhttp_b[i] = new XMLHttpRequest();
    xhttp_c[i] = new XMLHttpRequest();
    xhttp_d[i] = new XMLHttpRequest();

    xhttp[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=summaryDetail");
    xhttp_b[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=price");
    xhttp_c[i].open("GET", "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=financialData")
    xhttp_d[i].open("GET", "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=defaultKeyStatistics")

    xhttp[i].send();
    xhttp_b[i].send();
    xhttp_c[i].send();
    xhttp_d[i].send();

    xhttp[i].onreadystatechange = function()
    {
        if(xhttp[i].status == 200 && xhttp[i].readyState ==4)
        {
            mancanti --;

            response[i] = JSON.parse(xhttp[i].response);
            data[i] = response[i].quoteSummary.result[0].summaryDetail;

            if(mancanti_b == 0 && mancanti == 0 && mancanti_c == 0 && mancanti_d == 0)
            {
                sorted_data = data
                sorted_data_b = data_b
                sorted_data_c = data_c
                sorted_data_d = data_d
                full = true;
                sort("change");
            }
        }
        else
        {
            if(xhttp[i].status != 200 && err==0)
            {
                alert("Network error. AGGIORNA LA PAGINA");
                err++;
            }
        }
    }

    xhttp_b[i].onreadystatechange = function()
    {
        if(xhttp_b[i].status == 200 && xhttp_b[i].readyState ==4)
        {
            mancanti_b --;

            response_b[i] = JSON.parse(xhttp_b[i].response);
            data_b[i] = response_b[i].quoteSummary.result[0].price;

            if(mancanti_b == 0 && mancanti == 0 && mancanti_c == 0 && mancanti_d == 0)
            {
                sorted_data = data
                sorted_data_b = data_b
                sorted_data_c = data_c
                sorted_data_d = data_d
                full = true;
                sort("change");
            }
        }
    }
    
    xhttp_c[i].onreadystatechange = function()
    {
        if(xhttp_c[i].status == 200 && xhttp_c[i].readyState ==4)
        {
            mancanti_c --;
            response_c[i] = JSON.parse(xhttp_c[i].response);
            data_c[i] = response_c[i].quoteSummary.result[0].financialData;
            
            if(mancanti == 0 && mancanti_b == 0 && mancanti_c == 0 && mancanti_d == 0)
            {
                sorted_data = data
                sorted_data_b = data_b
                sorted_data_c = data_c
                sorted_data_d = data_d
                full = true;
                sort("change");
            }
        }
    }

    xhttp_d[i].onreadystatechange = function()
    {
        if(xhttp_d[i].status == 200 && xhttp_d[i].readyState ==4)
        {
            mancanti_d --;
            response_d[i] = JSON.parse(xhttp_d[i].response);
            data_d[i] = response_d[i].quoteSummary.result[0].defaultKeyStatistics;
            
            if(mancanti == 0 && mancanti_b == 0 && mancanti_c == 0 && mancanti_d == 0)
            {
                sorted_data = data
                sorted_data_b = data_b
                sorted_data_c = data_c
                sorted_data_d = data_d
                full = true;
                sort("change");
            }
        }
    }
}

for(let i= 0; i<array_crypto.length; i++)
    {
        xhttp_crypto[i] = new XMLHttpRequest();
        xhttp_crypto[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array_crypto[i] + "?modules=price");
        xhttp_crypto[i].send();

        xhttp_crypto[i].onreadystatechange = function()
        {
            if(xhttp_crypto[i].status == 200 && xhttp_crypto[i].readyState ==4)
            {
                mancanti_crypto --;
                response_crypto[i] = JSON.parse(xhttp_crypto[i].response);
                data_crypto[i] = response_crypto[i].quoteSummary.result[0].price;

                if(mancanti_crypto == 0)
                {
                    table_crypto();
                }
            }
        }
    }

////////////////////////////////////////////


function table()
{      
    tb.innerHTML = "";

    for(let i=0; i<sorted_data.length; i++)
    {
        var row = tb.insertRow();

        var cell_name = row.insertCell();
        cell_name.innerHTML = sorted_data_b[i].shortName;

        var cell_price = row.insertCell();
        cell_price.innerHTML = sorted_data_c[i].currentPrice.raw.toFixed(2);

        var cell_market_cap = row.insertCell();
        if(sorted_data_b[i].marketCap)
        {
            cell_market_cap.innerHTML = (sorted_data_b[i].marketCap.raw/1000000000).toFixed(2) + " mld";  
        }
        else
        {
            cell_market_cap.innerHTML = "-";
        }

        var cell_gross_margin = row.insertCell();
        if(sorted_data_c[i].grossMargins)
        {
            cell_gross_margin.innerHTML = (sorted_data_c[i].grossMargins.raw *100).toFixed(2) + " %";
        }              
        else
        {
            cell_gross_margin.innerHTML = "-";
        }

        var cell_profit_margin = row.insertCell();
        if(sorted_data_c[i].profitMargins)
        {
            cell_profit_margin.innerHTML = (sorted_data_c[i].profitMargins.raw *100).toFixed(2) + " %";
        }              
        else
        {
            cell_profit_margin.innerHTML = "-";
        }

        var cell_roe = row.insertCell();
        if(sorted_data_c[i].returnOnEquity?.raw)
        {
            cell_roe.innerHTML = (sorted_data_c[i].returnOnEquity.raw *100).toFixed(2) + " %";
        }
        else
        {
            cell_roe.innerHTML = "-";
        }

        var cell_debtequity = row.insertCell();
        if(sorted_data_c[i].debtToEquity?.raw)
        {
            cell_debtequity.innerHTML = (sorted_data_c[i].debtToEquity.raw /100).toFixed(2);
        }
        else
        {
            cell_debtequity.innerHTML = "-";
        }

        var cell_dividend = row.insertCell();
        if(sorted_data[i].trailingAnnualDividendYield?.raw)
        {
            cell_dividend.innerHTML = (sorted_data[i].trailingAnnualDividendYield?.raw *100).toFixed(2) + " %";                
        }
        else
        {
            cell_dividend.innerHTML = "-";
        }

        var cell_pe = row.insertCell();
        if(sorted_data[i].trailingPE?.raw)
        {
            cell_pe.innerHTML = (sorted_data[i].trailingPE.raw).toFixed(2);
        }
        else
        {
            cell_pe.innerHTML = "-";
        }

        var cell_pb = row.insertCell();
        if(sorted_data_d[i].priceToBook?.raw)
        {
            cell_pb.innerHTML = (sorted_data_d[i].priceToBook.raw).toFixed(2);
        }
        else
        {
            cell_pb.innerHTML = "-";
        }


        var cell_change = row.insertCell();
        if(sorted_data_b[i].regularMarketChangePercent)
        {
            cell_change.innerHTML = (sorted_data_b[i].regularMarketChangePercent.raw *100).toFixed(2);
        }
        else
        {
            cell_change.innerHTML = "-";
        }
    }
        
    colors();
    
    var tr = tb.getElementsByTagName("tr");
    for(let i=0; i<tr.length; i++)
    {
        var td = tr[i].getElementsByTagName("td");
        td[change_position].innerHTML = td[change_position].textContent + " %";
    }

    page_size();
    d_right.visibility = "visible"; //END
}

function table_crypto()
{
    tb_crypto.innerHTML = "";

    for(let i=0; i<data_crypto.length; i++)
    {
        var row_crypto = tb_crypto.insertRow();

        var cell_name_crypto = row_crypto.insertCell();
        cell_name_crypto.innerHTML = data_crypto[i].shortName;

        var cell_price_crypto = row_crypto.insertCell();    
        data_crypto[i].regularMarketPrice.raw > 1 ? (cell_price_crypto.innerHTML = (data_crypto[i].regularMarketPrice.raw).toFixed(2)) : (cell_price_crypto.innerHTML = (data_crypto[i].regularMarketPrice.raw).toFixed(3));

        var cell_change_crypto = row_crypto.insertCell();
        cell_change_crypto.innerHTML = (data_crypto[i].regularMarketChangePercent.raw *100).toFixed(2);
    }

    colors_crypto();

    var tr = tb_crypto.getElementsByTagName("tr");
    for(let i=0; i<tr.length; i++)
    {
        var td = tr[i].getElementsByTagName("td");
        td[change_crypto_position].innerHTML = td[change_crypto_position].textContent + " %";
    }
}

function colors()
{
    var tr = tb.getElementsByTagName("tr");

    for(let i=0; i<tr.length; i++)
    {
        var td = tr[i].getElementsByTagName("td");
        if(td[change_position].innerHTML > 0)
        {
            td[change_position].style.color = "green"
        }
        else
        {
            td[change_position].style.color ="#e60000";
        }
    }
}

function colors_crypto()
{
    var tr = tb_crypto.getElementsByTagName("tr");

    for(let i=0; i<tr.length; i++)
    {
        var td = tr[i].getElementsByTagName("td");
        if(td[change_crypto_position].innerHTML > 0)
        {
            td[change_crypto_position].style.color = "green"
        }
        else
        {
            td[change_crypto_position].style.color ="#e60000";
        }
    }

}

function sort(arr)
{
    if(full == true)
    {
        switch(arr)
        {
            case "change":
                {
                    indices = Array.from(Object.keys(sorted_data_b)).sort((a, b) => ((sorted_data_b[a].regularMarketChangePercent?.raw || 0) - (sorted_data_b[b].regularMarketChangePercent?.raw || 0)));
                    break;
                }
            case "market_cap":
                {
                    indices = Array.from(Object.keys(sorted_data_b)).sort((a, b) => ((sorted_data_b[a].marketCap?.raw || 0) - (sorted_data_b[b].marketCap?.raw || 0)));
                    break;
                }
            case "gross_margin":
                {
                    indices = Array.from(Object.keys(sorted_data_c)).sort((a, b) => ((sorted_data_c[a].grossMargins?.raw || 0) - (sorted_data_c[b].grossMargins?.raw || 0)));
                    break;
                }
            case "profit_margin":
                {
                    indices = Array.from(Object.keys(sorted_data_c)).sort((a, b) => ((sorted_data_c[a].profitMargins?.raw || 0) - (sorted_data_c[b].profitMargins?.raw || 0)));
                    break;
                }
            case "debtequity":
                {
                    indices = Array.from(Object.keys(sorted_data_c)).sort((a, b) => (((sorted_data_c[a].debtToEquity?.raw || 0) - sorted_data_c[b].debtToEquity?.raw || 0)));
                    break;
                }
            case "dividend":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => ((sorted_data[a].trailingAnnualDividendYield?.raw || 0) - (sorted_data[b].trailingAnnualDividendYield?.raw || 0)));
                    break;
                }
            case "pe":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => ((sorted_data[a].trailingPE?.raw || 0) - (sorted_data[b].trailingPE?.raw || 0)));
                    break;
                }
            case "roe":
                {
                    indices = Array.from(Object.keys(sorted_data_c)).sort((a, b) => ((sorted_data_c[a].returnOnEquity?.raw || 0) - (sorted_data_c[b].returnOnEquity?.raw || 0)));
                    break;
                }
            case "pb":
                {
                    indices = Array.from(Object.keys(sorted_data_d)).sort((a, b) => ((sorted_data_d[a].priceToBook?.raw || 0) - (sorted_data_d[b].priceToBook?.raw || 0)));
                    break;
                }
        }

        let tmp = sorted_data
        let tmp_b = sorted_data_b
        let tmp_c = sorted_data_c
        let tmp_d = sorted_data_d

        sorted_data = [];
        sorted_data_b = []
        sorted_data_c = [];
        sorted_data_d = []

        sorted_data = indices.map(i => tmp[i]);
        sorted_data_b = indices.map(i => tmp_b[i])
        sorted_data_c = indices.map(i => tmp_c[i])
        sorted_data_d = indices.map(i => tmp_d[i])

        table();
    }
}

function filter()
{
    let tmp = [], tmp_b = [], tmp_c = [], tmp_d = []

    sorted_data = data
    sorted_data_b = data_b
    sorted_data_c = data_c
    sorted_Data_d = data_d

    const val_change = document.getElementById("filter_change").value;
    const val_pe = document.getElementById("filter_pe").value;
    const val_dividend = document.getElementById("filter_dividend").value;
    const val_debtequity = document.getElementById("filter_debtequity").value;
    const val_grossmargin = document.getElementById("filter_grossmargin").value;

    switch (val_change){
        case "pos":
        {
            sorted_data = []
            sorted_data_b = []
            sorted_data_c = []
            sorted_data_d = []

            for(let i=0; i<data.length; i++)
            {
                if((data_b[i].regularMarketChangePercent?.raw || 0) >= 0)
                {
                    sorted_data.push(data[i])
                    sorted_data_b.push(data_b[i]) 
                    sorted_data_c.push(data_c[i])     
                    sorted_data_d.push(data_d[i])
                }
            }
            break;
        }
        case "neg":
        {
            sorted_data = []
            sorted_data_b = []
            sorted_data_c = []
            sorted_data_d = []

            for(let i=0; i<data.length; i++)
            {
                if((data_b[i].regularMarketChangePercent?.raw || 0) < 0)
                {
                    sorted_data.push(data[i])
                    sorted_data_b.push(data_b[i]) 
                    sorted_data_c.push(data_c[i]) 
                    sorted_data_d.push(data_d[i])
                }
            }
            break;
        }
        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_b = []
    tmp_c = []
    tmp_d = []

    switch(val_pe)
    {
        case "no":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if(!(sorted_data[i].trailingPE))
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])
                    sorted_data_d.push(data_d[i])
                }
            }
            
            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }

        case "pos":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if((sorted_data[i].trailingPE?.raw || 0) != "0")
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])  
                    sorted_data_d.push(data_d[i])
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }

        case "pos2":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if((sorted_data[i].trailingPE?.raw || 0) > 0 && (sorted_data[i].trailingPE?.raw || 0) < 15)
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])  
                    sorted_data_d.push(data_d[i])
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }

        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_b = []
    tmp_c = []
    tmp_d = []

    switch(val_dividend)
    {
        case "no":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if((sorted_data[i].trailingAnnualDividendYield?.raw || 0) == "0.0")
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])
                    sorted_data_d.push(data_d[i])
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }

        case "si":
        {
            console.log("si")
            for(let i=0; i<sorted_data.length; i++)
            {
                if((sorted_data[i].trailingAnnualDividendYield?.raw || 0) != "0.0")
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])
                    sorted_data_d.push(data_d[i]) 
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }

        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_b = []
    tmp_c = []
    tmp_d = []

    switch (val_debtequity){        
        case "min":
        {
            for(let i=0; i<sorted_data_c.length; i++)
            {
                if((sorted_data_c[i].debtToEquity?.raw / 100 || 0) <= 0.5)
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])
                    sorted_data_d.push(data_d[i])
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }
        case "magg":
        {
            for(let i=0; i<sorted_data_c.length; i++)
            {
                if((sorted_data_c[i].debtToEquity?.raw / 100 || 0) > 0.5)
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i]) 
                    sorted_data_d.push(data_d[i])
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }
        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_b = []
    tmp_c = []
    tmp_d = []

    switch (val_grossmargin){
        case "pos":
        {
            for(let i=0; i<sorted_data_c.length; i++)
            {
                if((sorted_data_c[i].grossMargins?.raw || 0) >= 0)
                {
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])  
                    sorted_data_d.push(data_d[i])         
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }
        case "neg":
        {
            for(let i=0; i<sorted_data_c.length; i++)
            {
                if((sorted_data_c[i].grossMargins?.raw || 0) < 0)
                {     
                    tmp.push(sorted_data[i])
                    tmp_b.push(sorted_data_b[i])
                    tmp_c.push(sorted_data_c[i])
                    sorted_data_d.push(data_d[i])
                }
            }

            sorted_data = tmp
            sorted_data_b = tmp_b
            sorted_data_c = tmp_c
            sorted_data_d = tmp_d
            break;
        }
        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_b = []
    tmp_c = []
    tmp_d = []

    sort("change");
    table();
}

function page_size()
{
    let pageWidth = window.innerWidth;
    let screenWidth = screen.width;

    let tableHeight = document.getElementById("table").offsetHeight;
    let table_cryptoHeight = document.getElementById("table_crypto").offsetHeight;
    let max = Math.max(tableHeight, 700);

    if(screenWidth == pageWidth)  // fullscreen
    {
        d_left.width = "60%";
        d_crypto.width = "17%";
        d_right.width = "16%";

        d_left.marginLeft = "2%";
        d_crypto.marginLeft = "2%";
        d_right.marginLeft = "2%";

        d_left.marginTop = "-1";
        d_crypto.marginTop = "-1";
        d_countdown.marginTop = "-1";
        d_right.marginTop = "20";

        d_left.float = "left";
        d_crypto.float = "left";
        d_right.float = "left";

        d_crypto.height = max + "px"
    }
    else // half screen
    {
        d_left.width = "80%";
        d_crypto.width = "80%"
        d_right.width = "30%";

        d_left.margin = "auto";
        d_left.marginTop = "-1";

        d_crypto.margin = "auto";
        d_crypto.marginTop = "3%";
        d_countdown.marginTop = "3%";

        d_right.margin = "auto";
        d_right.marginTop = "3%";

        d_crypto.height = table_cryptoHeight + "px";

        max = 700;
    }

    d_left.height = tableHeight + "px";
    document.getElementById("div_right1").style.height = max + "px";
    document.getElementById("div_right2").style.height = max + "px";
}

window.onresize = function() {
    page_size();
}

async function countdown(){
    var countDownDate = new Date("Apr 27, 2024 12:44:53").getTime();

        // Update the count down every 1 second
        var x = setInterval(function() 
        {
            var now = new Date().getTime();

            var distance = countDownDate - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("timer").innerHTML = days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";

            if (distance < 0) // countdown terminato 
            {
                clearInterval(x);
                document.getElementById("timer").innerHTML = "OMMMIODDDIO IT'S TIME TO GET RICH";
            }
        }, 1000);
}
