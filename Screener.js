array = ["UCG.MI", "ISP.MI", "ENEL.MI", "ENI.MI", "LVMH.MI", /*"STLAM.MI",*/ "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NIO", "CSIQ", "MU", "PG", "ASML", "NFLX", "QCOM", "PFE", "RIVN", "RBLX", "NVDA", "U", "BE", "FCEL", "AMD", "META", "INTC", "PARA", "PLUG", "NKLA", "T", "BYND", "BAC", "PYPL", "KO", "GS", "JPM", "CGC", "SPWR", "TSM", "NEL.OL", "RUN", "SNY", "NVS", "JNJ", "BNTX", "MRNA", "NTLA", "BIIB"];

array_crypto = ["BTC-USD", "ETH-USD", "CRO-USD", "BNB-USD", "XRP-USD", "ADA-USD"];

var xhttp = [];
var xhttp_base = []
var xhttp_financial = [];
var xhttp_crypto = [];

var response = [];
var response_base = []
var response_financial = [];
var response_crypto = [];

var data = [];
var data_base = []
var data_financial = [];
var data_crypto = [];

var sorted_data = [];
var sorted_data_base = []
var sorted_data_financial = [];

var filtered_data = [];
var filtered_data_base = []
var filtered_data_financial = [];

var tb = document.getElementById("tbody");
var tb_crypto = document.getElementById("tbody_crypto");
var change_position = 10;
var change_crypto_position = 2;


var mancanti = array.length;
var mancanti_base = array.length;
var mancanti_financial = array.length;
var mancanti_crypto = array_crypto.length;
var err = 0; //serve per non loggare in console arr.length volte "Network error"
var full = false;

const d_left = document.getElementById("div_left").style;
const d_crypto = document.getElementById("div_crypto").style;
const d_right = document.getElementById("div_right").style;
d_right.visibility = "hidden";

page_size();

for(let i=0, j=0; i<array.length; i++)
{
    xhttp[i] = new XMLHttpRequest();
    xhttp_base[i] = new XMLHttpRequest();
    xhttp_financial[i] = new XMLHttpRequest();


    xhttp[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=summaryDetail");
    xhttp_base[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=price");
    xhttp_financial[i].open("GET", "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=financialData")

    xhttp[i].send();
    xhttp_base[i].send();
    xhttp_financial[i].send();

    xhttp[i].onreadystatechange = function()
    {
        if(xhttp[i].status == 200 && xhttp[i].readyState ==4)
        {
            mancanti --;

            response[i] = JSON.parse(xhttp[i].response);
            data[i] = response[i].quoteSummary.result[0].summaryDetail;

            if(mancanti_base == 0 && mancanti == 0 && mancanti_financial == 0)
            {
                sorted_data = data
                sorted_data_base = data_base
                sorted_data_financial = data_financial
                full = true;
                sort("change");
            }
        }
        else
        {
            if(xhttp[i].status != 200 && err==0)
            {
                alert("Network error summaryDetail");
                err++;
            }
        }
    }

    xhttp_base[i].onreadystatechange = function()
    {
        if(xhttp_base[i].status == 200 && xhttp_base[i].readyState ==4)
        {
            mancanti_base --;

            response_base[i] = JSON.parse(xhttp_base[i].response);
            data_base[i] = response_base[i].quoteSummary.result[0].price;

            if(mancanti_base == 0 && mancanti == 0 && mancanti_financial == 0)
            {
                sorted_data = data
                sorted_data_base = data_base
                sorted_data_financial = data_financial
                full = true;
                sort("change");
            }
        }
    }
    
    xhttp_financial[i].onreadystatechange = function()
    {
        if(xhttp_financial[i].status == 200 && xhttp_financial[i].readyState ==4)
        {
            mancanti_financial --;
            response_financial[i] = JSON.parse(xhttp_financial[i].response);
            data_financial[i] = response_financial[i].quoteSummary.result[0].financialData;
            
            if(mancanti == 0 && mancanti_base == 0 && mancanti_financial == 0)
            {
                sorted_data = data
                sorted_data_base = data_base
                sorted_data_financial = data_financial
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
        cell_name.innerHTML = sorted_data_base[i].shortName;

        var cell_price = row.insertCell();
        cell_price.innerHTML = sorted_data_financial[i].currentPrice.raw.toFixed(2);

        var cell_market_cap = row.insertCell();
        if(sorted_data_base[i].marketCap)
        {
            cell_market_cap.innerHTML = (sorted_data_base[i].marketCap.raw/1000000000).toFixed(2) + " mld";  
        }
        else
        {
            cell_market_cap.innerHTML = "-";
        }

        var cell_gross_margin = row.insertCell();
        if(sorted_data_financial[i].grossMargins)
        {
            cell_gross_margin.innerHTML = (sorted_data_financial[i].grossMargins.raw *100).toFixed(2) + " %";
        }              
        else
        {
            cell_gross_margin.innerHTML = "-";
        }

        var cell_profit_margin = row.insertCell();
        if(sorted_data_financial[i].profitMargins)
        {
            cell_profit_margin.innerHTML = (sorted_data_financial[i].profitMargins.raw *100).toFixed(2) + " %";
        }              
        else
        {
            cell_profit_margin.innerHTML = "-";
        }

        var cell_roe = row.insertCell();
        if(sorted_data_financial[i].returnOnEquity?.raw)
        {
            cell_roe.innerHTML = (sorted_data_financial[i].returnOnEquity.raw *100).toFixed(2) + " %";
        }
        else
        {
            cell_roe.innerHTML = "-";
        }

        var cell_debtequity = row.insertCell();
        if(sorted_data_financial[i].debtToEquity?.raw)
        {
            cell_debtequity.innerHTML = (sorted_data_financial[i].debtToEquity.raw /100).toFixed(2);
        }
        else
        {
            cell_debtequity.innerHTML = "-";
        }

        var cell_dividend = row.insertCell();
        if(sorted_data[i].trailingAnnualDividendYield?.raw)
        {
            cell_dividend.innerHTML = (sorted_data[i].dividendYield.raw *100).toFixed(2) + " %";                
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
        if(sorted_data[i].priceToBook)
        {
            cell_pb.innerHTML = (sorted_data[i].priceToBook.raw).toFixed(2);
        }
        else
        {
            cell_pb.innerHTML = "-";
        }


        var cell_change = row.insertCell();
        if(sorted_data_base[i].regularMarketChangePercent)
        {
            cell_change.innerHTML = (sorted_data_base[i].regularMarketChangePercent.raw *100).toFixed(2);
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
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => (sorted_data[a].regularMarketChangePercent - sorted_data[b].regularMarketChangePercent));
                    break;
                }
            case "market_cap":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => (sorted_data[a].marketCap - sorted_data[b].marketCap));
                    break;
                }
            case "gross_margin":
                {
                    indices = Array.from(Object.keys(sorted_data_financial)).sort((a, b) => (sorted_data_financial[a].grossMargins.raw - sorted_data_financial[b].grossMargins.raw));
                    break;
                }
            case "profit_margin":
                {
                    indices = Array.from(Object.keys(sorted_data_financial)).sort((a, b) => (sorted_data_financial[a].profitMargins.raw - sorted_data_financial[b].profitMargins.raw));
                    break;
                }
            case "debtequity":
                {
                    indices = Array.from(Object.keys(sorted_data_financial)).sort((a, b) => (sorted_data_financial[a].debtToEquity.raw - sorted_data_financial[b].debtToEquity.raw));
                    break;
                }
            case "dividend":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => (sorted_data[a].trailingAnnualDividendYield - sorted_data[b].trailingAnnualDividendYield));
                    break;
                }
            case "pe":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => (sorted_data[a].trailingPE - sorted_data[b].trailingPE));
                    break;
                }
            case "roe":
                {
                    indices = Array.from(Object.keys(sorted_data_financial)).sort((a, b) => (sorted_data_financial[a].returnOnEquity.raw - sorted_data_financial[b].returnOnEquity.raw));
                    break;
                }
            case "pb":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => (sorted_data[a].priceToBook - sorted_data[b].priceToBook));
                    break;
                }
        }

        let tmp = sorted_data
        let tmp_financial = sorted_data_financial

        sorted_data = [];
        sorted_data_financial = [];

        sorted_data = indices.map(i => tmp[i]);
        sorted_data_financial = indices.map(i => tmp_financial[i]);

        table();
    }
}

function filter()
{
    let tmp = [], tmp_fin= []

    sorted_data = data
    sorted_data_financial = data_financial

    const val_change = document.getElementById("filter_change").value;
    const val_pe = document.getElementById("filter_pe").value;
    const val_dividend = document.getElementById("filter_dividend").value;
    const val_debtequity = document.getElementById("filter_debtequity").value;
    const val_grossmargin = document.getElementById("filter_grossmargin").value;

    switch (val_change){
        case "pos":
        {
            sorted_data = []
            sorted_data_financial = []

            for(let i=0; i<data.length; i++)
            {
                if(data[i].regularMarketChangePercent >= 0)
                {
                    sorted_data.push(data[i])
                    sorted_data_financial.push(data_financial[i])     
                }
            }
            break;
        }
        case "neg":
        {
            sorted_data = []
            sorted_data_financial = []

            for(let i=0; i<data.length; i++)
            {
                if(data[i].regularMarketChangePercent < 0)
                {
                    sorted_data.push(data[i])
                    sorted_data_financial.push(data_financial[i]) 
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
    tmp_fin = []

    switch(val_pe)
    {
        case "no":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if(sorted_data[i].trailingPE == "0")
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])
                }
            }
            break;
        }

        case "pos":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if(sorted_data[i].trailingPE != "0")
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])  
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }

        case "pos2":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if(sorted_data[i].trailingPE > 0 && sorted_data[i].trailingPE < 15)
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])  
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }

        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_fin = []

    switch(val_dividend)
    {
        case "no":
        {
            for(let i=0; i<sorted_data.length; i++)
            {
                if(sorted_data[i].trailingAnnualDividendYield == "0.0")
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }

        case "si":
        {
            console.log("si")
            for(let i=0; i<sorted_data.length; i++)
            {
                if(sorted_data[i].trailingAnnualDividendYield != "0.0")
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i]) 
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }

        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_fin = []

    switch (val_debtequity){
        case "min":
        {
            for(let i=0; i<sorted_data_financial.length; i++)
            {
                if(sorted_data_financial[i].debtToEquity.raw <= 0.5)
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }
        case "magg":
        {
            for(let i=0; i<sorted_data_financial.length; i++)
            {
                if(sorted_data_financial[i].debtToEquity > 0.5)
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i]) 
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }
        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_fin = []

    switch (val_grossmargin){
        case "pos":
        {
            for(let i=0; i<sorted_data_financial.length; i++)
            {
                if(sorted_data_financial[i].grossMargins.raw >= 0)
                {
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])           
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }
        case "neg":
        {
            for(let i=0; i<sorted_data_financial.length; i++)
            {
                if(sorted_data_financial[i].grossMargins.raw < 0)
                {     
                    tmp.push(sorted_data[i])
                    tmp_fin.push(sorted_data_financial[i])
                }
            }

            sorted_data = tmp
            sorted_data_financial = tmp_fin
            break;
        }
        case "empty":
        {
            break;
        }
    }

    tmp = []
    tmp_fin = []

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
        d_right.marginTop = "20"

        d_left.float = "left";
        d_crypto.float = "left"
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
