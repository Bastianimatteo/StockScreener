array = ["UCG.MI", "ISP.MI", "ENEL.MI", "ENI.MI", "LVMH.MI", "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "JNJ", "NIO", "CSIQ", "MU", "PG", "ASML", "NVS", "NFLX", "QCOM", "SNY", "PFE", "RIVN", "RBLX", "NVDA", "U", "BE", "FCEL", "AMD", "BNTX", "META", "INTC", "PARA", "PLUG", "NKLA", "MRNA", "T", "BYND", "BAC", "PYPL", "KO", "GS", "JPM", "CGC", "SPWR", "TSM"];

var xhttp = [];
var xhttp_financial = [];

var data = [];
var data_financial = [];
var tb = document.getElementById("tbody");
var change_position = 10;

var v_name, v_currency, v_price, v_pe, v_pb, v_market_cap, v_dividend, v_gross_margin, v_roe, v_debtequity, v_change;

var nome = [];
var currency = [];
var price = [];
var pe = [];
var market_cap = [];
var dividend = [];
var change = [];
var gross_margin = [];
var debtequity = [];
var roe = [];
var pb = [];

var sorted_name = [];
var sorted_currency = [];
var sorted_price = [];
var sorted_pe = [];
var sorted_market_cap = [];
var sorted_dividend = [];
var sorted_change = [];
var sorted_gross_margin = [];
var sorted_debtequity = [];
var sorted_roe = [];
var sorted_pb = [];

var now_name = [];
var now_currency = [];
var now_price = [];
var now_pe = [];
var now_market_cap = [];
var now_dividend = [];
var now_change = [];
var now_gross_margin = [];
var now_debtequity = [];
var now_roe = [];
var now_pb = [];

var mancanti = array.length;
var mancanti_financial = array.length;
var err = 0; //serve per non loggare in console arr.length volte "Network error"
var full = false;

const d_left = document.getElementById("div_left").style;
const d_right = document.getElementById("div_right").style;
d_right.visibility = "hidden";

page_size();

for(let i=0, j=0; i<array.length; i++)
{
    xhttp[i] = new XMLHttpRequest();
    xhttp_financial[i] = new XMLHttpRequest();

    xhttp[i].open("GET", "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + array[i]);
    xhttp_financial[i].open("GET", "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=financialData")

    xhttp[i].send();
    xhttp_financial[i].send();

    xhttp[i].onreadystatechange = function()
    {
        if(xhttp[i].status == 200 && xhttp[i].readyState ==4)
        {
            mancanti --;

            data[i] = JSON.parse(xhttp[i].response);

            v_name = data[i].quoteResponse.result[0].longName;
            if(v_name.length > 35)
            {
                v_name = data[i].quoteResponse.result[0].shortName;
            }

            if(data[i].quoteResponse.result[0].currency)
            {
                v_currency = data[i].quoteResponse.result[0].currency;
            }
            else
            {
                v_currency = "EUR";
            }

            v_price = data[i].quoteResponse.result[0].regularMarketPrice;

            if(data[i].quoteResponse.result[0].trailingPE)
            {
                v_pe = data[i].quoteResponse.result[0].trailingPE;
            }   
            else
            {
                v_pe = 0;
            }

            if(data[i].quoteResponse.result[0].priceToBook)
            {
                v_pb = data[i].quoteResponse.result[0].priceToBook;
            }
            else
            {
                v_pb = 0;
            }

            if(data[i].quoteResponse.result[0].marketCap)
            {
                v_market_cap = data[i].quoteResponse.result[0].marketCap;
            }
            else
            {
                v_market_cap = 0;
            }

            if(data[i].quoteResponse.result[0].trailingAnnualDividendYield)
            {
                v_dividend = (data[i].quoteResponse.result[0].
                trailingAnnualDividendYield)*100;
            }
            else
            {
                v_dividend = "0";
            }

            v_change = data[i].quoteResponse.result[0].regularMarketChangePercent;

            add(i, v_name, v_currency, v_price, v_pe, v_pb, v_market_cap, v_dividend, v_change);

            if(mancanti == 0 && mancanti_financial == 0)
            {
                full = true;
                sort("change");
                table();
            }
        }
        else
        {
            if(xhttp[i].status != 200 && err==0)
            {
                alert("Network error");
                err++;
            }
        }
    }
    
    xhttp_financial[i].onreadystatechange = function()
    {
        if(xhttp_financial[i].status == 200 && xhttp_financial[i].readyState ==4)
        {
            mancanti_financial --;
            data_financial[i] = JSON.parse(xhttp_financial[i].response);

            if(data_financial[i].quoteSummary.result[0].financialData.grossMargins)
            {
                v_gross_margin = (data_financial[i].quoteSummary.result[0].financialData.grossMargins.raw)*100;
            }
            else
            {
                v_gross_margin = 0;
            }

            if(data_financial[i].quoteSummary.result[0].financialData.debtToEquity.raw)
            {
                v_debtequity = (data_financial[i].quoteSummary.result[0].financialData.debtToEquity.raw)/100;
            }   
            else
            {
                v_debtequity = 0;
            }

            if(data_financial[i].quoteSummary.result[0].financialData.returnOnEquity.raw)
            { 
                v_roe = (data_financial[i].quoteSummary.result[0].financialData.returnOnEquity.raw)*100;
            }
            else
            {
                v_roe = 0;
            }

            add_financial(i, v_gross_margin, v_debtequity, v_roe);
            
            if(mancanti == 0 && mancanti_financial == 0)
            {
                full = true;
                sort("change");
                table();
            }
        }
    }
}

////////////////////////////////////////////

function add(i, v_name, v_currency, v_price, v_pe, v_pb, v_market_cap, v_dividend, v_change)
{
    nome[i] = v_name;
    currency[i] = v_currency;
    price[i] = v_price;
    pe[i] = v_pe;
    pb[i] = v_pb;
    market_cap[i] = v_market_cap;
    dividend[i] = v_dividend;
    change[i] = v_change;

    now_name[i] = v_name
    now_currency[i] = v_currency;
    now_price[i] = v_price;
    now_pe[i] = v_pe;
    now_pb[i] = v_pb;
    now_market_cap[i] = v_market_cap;
    now_dividend[i] = v_dividend;
    now_change[i] = v_change;
}

function add_financial(i, v_gross_margin, v_debtequity, v_roe)
{
    gross_margin[i] = v_gross_margin;
    debtequity[i] = v_debtequity;
    roe[i] = v_roe;

    now_gross_margin[i] = v_gross_margin;
    now_debtequity[i] = v_debtequity;
    now_roe[i] = v_roe;
}

function table()
{      
    tb.innerHTML = "";

    for(let i=0; i<now_name.length; i++)
    {
        var row = tb.insertRow();

        var cell_name = row.insertCell();
        cell_name.innerHTML = sorted_name[i];

        var cell_currency = row.insertCell();
        cell_currency.innerHTML = sorted_currency[i];

        var cell_price = row.insertCell();
        cell_price.innerHTML = sorted_price[i].toFixed(2);

        var cell_market_cap = row.insertCell();
        if(sorted_market_cap[i] != 0)
        {
            cell_market_cap.innerHTML = (sorted_market_cap[i]/1000000000).toFixed(2) + " mld";  
        }              
        else
        {
            cell_market_cap.innerHTML = "-";
        }

        var cell_gross_margin = row.insertCell();
        if(sorted_gross_margin[i] != 0)
        {
            cell_gross_margin.innerHTML = sorted_gross_margin[i].toFixed(2) + " %";
        }              
        else
        {
            cell_gross_margin.innerHTML = "-";
        }

        var cell_roe = row.insertCell();
        cell_roe.innerHTML = sorted_roe[i].toFixed(2) + " %";

        var cell_debtequity = row.insertCell();

        if(sorted_debtequity[i] != 0)
        {
            cell_debtequity.innerHTML = (sorted_debtequity[i]).toFixed(2);  
        }
        else
        {
            cell_debtequity.innerHTML = "-";
        }

        var cell_dividend = row.insertCell();
        if(sorted_dividend[i] != 0)
        {
            cell_dividend.innerHTML = sorted_dividend[i].toFixed(2) + " %";                
        }
        else
        {
            cell_dividend.innerHTML = "-";
        }

        var cell_pe = row.insertCell();
        if(sorted_pe[i] != 0)
        {
            cell_pe.innerHTML = sorted_pe[i].toFixed(2);
        }
        else
        {
            cell_pe.innerHTML = "-";
        }

        var cell_pb = row.insertCell();
        cell_pb.innerHTML = sorted_pb[i].toFixed(2);

        var cell_change = row.insertCell();
        cell_change.innerHTML = sorted_change[i].toFixed(2);
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

function sort(arr)
{
    if(full == true)
    {
        empty_sorted();

        switch(arr)
        {
            case "change":
                {
                    indices = Array.from(now_change.keys()).sort((a, b) => (now_change[a] - now_change[b]));
                    break;
                }
            case "currency":
                {
                    indices = Array.from(now_currency.keys()).sort((a, b) => (now_currency[a] - now_currency[b]));
                    break;
                }
            case "market_cap":
                {
                    indices = Array.from(now_market_cap.keys()).sort((a, b) => (now_market_cap[a] - now_market_cap[b]));
                    break;
                }
            case "gross_margin":
                {
                    indices = Array.from(now_gross_margin.keys()).sort((a, b) => (now_gross_margin[a] - now_gross_margin[b]));
                    break;
                }
            case "debtequity":
                {
                    indices = Array.from(now_debtequity.keys()).sort((a, b) => (now_debtequity[a] - now_debtequity[b]));
                    break;
                }
            case "dividend":
                {
                    indices = Array.from(now_dividend.keys()).sort((a, b) => (now_dividend[a] - now_dividend[b]));
                    break;
                }
            case "pe":
                {
                    indices = Array.from(now_pe.keys()).sort((a, b) => (now_pe[a] - now_pe[b]));
                    break;
                }
            case "roe":
                {
                    indices = Array.from(now_roe.keys()).sort((a, b) => (now_roe[a] - now_roe[b]));
                    break;
                }
            case "pb":
                {
                    indices = Array.from(now_pb.keys()).sort((a,b) => (now_pb[a] - now_pb[b]));
                    break;
                }
        }

        sorted_name = indices.map(i => now_name[i]);
        sorted_currency = indices.map(i => now_currency[i]);
        sorted_price = indices.map(i => now_price[i]);
        sorted_market_cap = indices.map(i => now_market_cap[i]);
        sorted_gross_margin = indices.map(i => now_gross_margin[i]);
        sorted_roe = indices.map(i => now_roe[i]);
        sorted_debtequity = indices.map(i => now_debtequity[i]);
        sorted_pe = indices.map(i => now_pe[i]);
        sorted_pb = indices.map(i => now_pb[i]);
        sorted_dividend = indices.map(i => now_dividend[i]);
        sorted_change = indices.map(i => now_change[i]);

        var tb = document.getElementById("tbody");
        tb.innerHTML = "";
        
        table();
    }
}

function empty_sorted()
{
    sorted_name = [];
    sorted_currency = [];
    sorted_price = [];
    sorted_pe = [];
    sorted_pb = [];
    sorted_market_cap = [];
    sorted_dividend = [];
    sorted_change = [];
    sorted_gross_margin = [];
    sorted_debtequity = [];
    sorted_roe = [];
}

function empty_now()
{
    now_name = [];
    now_currency = [];
    now_price = [];
    now_pe = [];
    now_pb = [];
    now_market_cap = [];
    now_dividend = [];
    now_change = [];
    now_gross_margin = [];
    now_debtequity = [];
    now_roe = [];
}

function now_sorted()
{
    now_name = sorted_name;
    now_currency = sorted_currency;
    now_price = sorted_price;
    now_market_cap = sorted_market_cap;
    now_gross_margin = sorted_gross_margin;
    now_roe = sorted_roe;
    now_debtequity = sorted_debtequity;
    now_dividend = sorted_dividend;
    now_pe = sorted_pe;
    now_pb = sorted_pb;
    now_change = sorted_change;
}

function now_sorted_ij(i, j)
{
    now_name[j] = nome[i];
    now_currency[j] = currency[i];
    now_price[j] = price[i];
    now_market_cap[j] = market_cap[i];
    now_gross_margin[j] = gross_margin[i];
    now_roe[j] = roe[i];
    now_debtequity[j] = debtequity[i];
    now_dividend[j] = dividend[i];
    now_pe[j] = pe[i];
    now_pb[j] = pb[i];
    now_change[j] = change[i];
}

function sorted_now_ij(i, j)
{
    sorted_name[j] = now_name[i];
    sorted_currency[j] = now_currency[i];
    sorted_price[j] = now_price[i];
    sorted_market_cap[j] = now_market_cap[i];
    sorted_gross_margin[j] = now_gross_margin[i];
    sorted_roe[j] = now_roe[i];
    sorted_debtequity[j] = now_debtequity[i];
    sorted_dividend[j] = now_dividend[i];
    sorted_pe[j] = now_pe[i];
    sorted_pb[j] = now_pb[i];
    sorted_change[j] = now_change[i];
}

function filter()
{
    const val_change = document.getElementById("filter_change").value;
    const val_pe = document.getElementById("filter_pe").value;
    const val_dividend = document.getElementById("filter_dividend").value;
    const val_currency = document.getElementById("filter_currency").value;
    const val_debtequity = document.getElementById("filter_debtequity").value;
    const val_grossmargin = document.getElementById("filter_grossmargin").value;

    now_name = nome;
    now_currency = currency;
    now_price = price;
    now_pe = pe;
    now_pb = pb;
    now_market_cap = market_cap;
    now_gross_margin = gross_margin;
    now_roe = roe;
    now_debtequity = debtequity;
    now_dividend = dividend;
    now_change = change;

    switch (val_change){
        case "pos":
        {
            empty_now();
            for(let i=0, j=-1; i<nome.length; i++)
            {
                if(change[i] >= 0)
                {
                    j++;
                    now_sorted_ij(i,j);
                }
            }
            break;
        }
        case "neg":
        {
            empty_now();
            for(let i=0, j=-1; i<nome.length; i++)
            {
                if(change[i] < 0)
                {
                    j++;
                    now_sorted_ij(i,j);
                }
            }
            break;
        }
        case "empty":
        {
            break;
        }
    }

    empty_sorted();

    switch(val_pe)
    {
        case "no":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_pe[i] == "0")
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "pos":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_pe[i] != "0")
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "pos2":
        {
            for(let i=0, j= -1; i<now_pe.length; i++)
            {
                if(now_pe[i] > 0 && now_pe[i] < 15)
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "empty":
        {
            break;
        }
    }

    empty_sorted();

    switch(val_dividend)
    {
        case "no":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_dividend[i] == "0")
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "si":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_dividend[i] != "0")
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "empty":
        {
            break;
        }
    }

    empty_sorted();

    switch(val_currency)
    {
        case "EUR":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_currency[i] == "EUR")
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "USD":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_currency[i] == "USD")
                {
                    j++;
                    sorted_now_ij(i, j);
                }
            }

            now_sorted();
            break;
        }

        case "empty":
        {
            break;
        }
    }

    empty_sorted();

    switch (val_debtequity){
        case "min":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_debtequity[i] <= 0.5)
                {
                    j++;
                    sorted_now_ij(i,j);
                }
            }
            now_sorted();
            break;
        }
        case "magg":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_debtequity[i] > 0.5)
                {
                    j++;
                    sorted_now_ij(i,j);
                }
            }
            now_sorted();
            break;
        }
        case "empty":
        {
            break;
        }
    }

    empty_sorted();

    switch (val_grossmargin){
        case "pos":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_gross_margin[i] >= 0)
                {
                    j++;
                    sorted_now_ij(i,j);
                }
            }
            now_sorted();
            break;
        }
        case "neg":
        {
            for(let i=0, j=-1; i<now_name.length; i++)
            {
                if(now_gross_margin[i] < 0)
                {
                    j++;
                    sorted_now_ij(i,j);
                }
            }
            now_sorted();
            break;
        }
        case "empty":
        {
            break;
        }
    }

    empty_sorted();

    sort("change");
    table();
}

function page_size()
{
    let pageWidth = window.innerWidth;
    let screenWidth = screen.width;

    let tableHeight = document.getElementById("table").offsetHeight;
    let min = Math.max(tableHeight, 700);

    if(screenWidth == pageWidth)  // fullscreen
    {
        d_left.width = "60%";
        d_right.width = "25%";

        d_left.marginLeft = "10%";
        d_right.marginLeft = "3%";

        d_left.float = "left";
        d_right.float = "right";

        d_left.marginTop = "-1";
        d_right.marginTop = "20 px"

    }
    else // half screen
    {
        d_left.width = "80%";
        d_right.width = "50%";

        d_left.margin = "auto";
        d_right.margin = "auto";

        d_left.marginTop = "-1";

        min = 700;
    }

    d_left.height = tableHeight + "px";
    document.getElementById("div_right1").style.height = min + "px";
    document.getElementById("div_right2").style.height = min + "px";
    document.getElementById("div_right3").style.height = min + "px";
}

window.onresize = function() {
    page_size();
};
