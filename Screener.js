array = ["UCG.MI", "ISP.MI", "ENEL.MI", "ENI.MI", "LVMH.MI", "FBK.MI", "STLAM.MI", 
"AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NIO", "MU", "ASML", "NFLX", "QCOM", "RIVN", "RBLX", "NVDA", "U", "AMD", "META", "INTC", "PARA", "PYPL",
"PLUG", "NKLA", "BLDP", "BE", "FCEL", "SPWR", "NEL.OL", "RUN", "CSIQ", "ENPH", "DQ", "FSLR", 
"BYND", "BAC", "KO", "GS", "JPM", "CGC", "TSM", 
"PFE", "SNY", "NVS", "JNJ", "BNTX", "MRNA", "NTLA", "BIIB", "GSK", "ROG.SW", "PG", 
"AEM", "PSA", "SBSW", "BTI", "OGI", "VZ"];

array_crypto = ["BTC-USD", "ETH-USD", "SOL-USD", "CRO-USD", "BNB-USD", "XRP-USD", "ADA-USD"];

var xhttp = [];
var xhttp_crypto = [];

var response
var response_crypto = [];

var data = [];
var dat = {name: "", price: null, market_cap: null, gross_margin: null, profit_margin: null, roe: null, debt_to_equity: null, dividend_yield: null, pe: null, pb: null, current_ratio: null, change: null}
var data_crypto = [];

var sorted_data = []

var tb = document.getElementById("tbody");
var tb_crypto = document.getElementById("tbody_crypto");

var mancanti = array.length;
var mancanti_crypto = array_crypto.length;
var full = false;

const d_left = document.getElementById("div_left").style;
const d_crypto = document.getElementById("div_crypto").style;
const d_countdown = document.getElementById("div_countdown").style;

const modal_balance = document.getElementById("modal_balance")
modal_balance.style.visibility = "hidden"
const modal_balance_title = document.getElementById("modal_balance_title")

const tr_rev1 = document.getElementById("rev1")
const tr_rev2 = document.getElementById("rev2")
const tr_rev3 = document.getElementById("rev3")
const tr_rev4 = document.getElementById("rev4")

const tr_ut1 = document.getElementById("ut1")
const tr_ut2 = document.getElementById("ut2")
const tr_ut3 = document.getElementById("ut3")
const tr_ut4 = document.getElementById("ut4")

const tr_gross1 = document.getElementById("gross1")
const tr_gross2 = document.getElementById("gross2")
const tr_gross3 = document.getElementById("gross3")
const tr_gross4 = document.getElementById("gross4")

let retryCount = 0;
const maxRetries = 20;
const retryDelay = 500;

page_size();
countdown();
load()

function load(){
    data = []

    for(let i=0; i<array.length; i++)
    {
        xhttp[i] = new XMLHttpRequest();

        xhttp[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=price%2CsummaryDetail%2CdefaultKeyStatistics%2CfinancialData%2CincomeStatementHistory");

        xhttp[i].send();

        xhttp[i].onreadystatechange = function()
        {
            if(xhttp[i].status == 200 && xhttp[i].readyState ==4)
            {
                dat = {name: "", price: null, market_cap: null, gross_margin: null, profit_margin: null, roe: null, debt_to_equity: null, dividend_yield: null, pe: null, pb: null, current_ratio: null, change: null, rev1: null, rev2: null, rev3: null, rev4: null, ut1: null, ut2: null, ut3: null, ut4: null, gross1: null, gross2: null, gross3: null, gross4: null}

                mancanti --;

                response = JSON.parse(xhttp[i].response);

                const name = response.quoteSummary?.result[0]?.price?.shortName || ""
                const price = response.quoteSummary?.result[0]?.price?.regularMarketPrice?.raw || 0
                const market_cap = response.quoteSummary?.result[0]?.price?.marketCap?.raw || 0
                const change = response.quoteSummary?.result[0]?.price?.regularMarketChangePercent?.raw || 0

                const gross_margin = response.quoteSummary?.result[0]?.financialData?.grossMargins?.raw || 0
                const profit_margin = response.quoteSummary?.result[0]?.financialData?.profitMargins?.raw || 0
                const current_ratio = response.quoteSummary?.result[0]?.financialData?.currentRatio?.raw || 0
                const roe = response.quoteSummary?.result[0]?.financialData?.returnOnEquity?.raw || 0
                const debt_to_equity = response.quoteSummary?.result[0]?.financialData?.debtToEquity?.raw || 0

                const pe = response.quoteSummary?.result[0]?.summaryDetail?.trailingPE?.raw || 0
                const dividend_yield = response.quoteSummary?.result[0]?.summaryDetail?.trailingAnnualDividendYield?.raw || 0

                const pb = response.quoteSummary?.result[0]?.defaultKeyStatistics?.priceToBook?.raw || 0

                const income = response.quoteSummary?.result[0]?.incomeStatementHistory?.incomeStatementHistory || 0

                var rev1 = 0
                var rev2 = 0
                var rev3 = 0
                var rev4 = 0
                var ut1 = 0
                var ut2 = 0
                var ut3 = 0
                var ut4 = 0

                if(income != 0)
                {
                    rev1 = income[0]?.totalRevenue?.fmt || 0
                    rev2 = income[1]?.totalRevenue?.fmt || 0
                    rev3 = income[2]?.totalRevenue?.fmt || 0
                    rev4 = income[3]?.totalRevenue?.fmt || 0

                    ut1 = income[0]?.netIncome?.fmt || 0
                    ut2 = income[1]?.netIncome?.fmt || 0
                    ut3 = income[2]?.netIncome?.fmt || 0
                    ut4 = income[3]?.netIncome?.fmt || 0

                    gross1 = income[0]?.grossProfit?.fmt || 0
                    gross2 = income[1]?.grossProfit?.fmt || 0
                    gross3 = income[2]?.grossProfit?.fmt || 0
                    gross4 = income[3]?.grossProfit?.fmt || 0
                }

                dat.name = name
                dat.price = price.toFixed(2)
                dat.market_cap = (market_cap / 1000000000).toFixed(2)
                dat.change = (change * 100).toFixed(2)
                dat.gross_margin = (gross_margin * 100).toFixed(2)
                dat.profit_margin = (profit_margin * 100).toFixed(2)
                dat.current_ratio = current_ratio.toFixed(2)
                dat.roe = (roe * 100).toFixed(2)
                dat.debt_to_equity = (debt_to_equity / 100).toFixed(2)
                dat.pe = (pe).toFixed(2)
                dat.dividend_yield = (dividend_yield * 100).toFixed(2)
                dat.pb = (pb).toFixed(2)
                dat.rev1 = rev1
                dat.rev2 = rev2
                dat.rev3 = rev3
                dat.rev4 = rev4
                dat.ut1 = ut1
                dat.ut2 = ut2
                dat.ut3 = ut3
                dat.ut4 = ut4
                dat.gross1 = gross1
                dat.gross2 = gross2
                dat.gross3 = gross3
                dat.gross4 = gross4

                data.push(dat)

                if(mancanti == 0)
                {
                    sorted_data = data
                    full = true;
                    sort("change");
                }
            }
            else
            {
                if(xhttp[i].status != 200)
                {
                    retryRequest(i)
                }
            }
        }
    }
}

function retryRequest(i) 
{
    if (retryCount < maxRetries) 
    {
      console.log("Retrying request " + (i + 1))
      retryCount++
      setTimeout(() => {
        load()
      }, retryDelay)
    } 
    else 
    {
        //alert("Network error. AGGIORNA LA PAGINA");
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
        cell_name.innerHTML = sorted_data[i].name

        var cell_market_cap = row.insertCell();
        if(sorted_data[i].market_cap)
        {
            cell_market_cap.innerHTML = sorted_data[i].market_cap + " mld";
        }
        else
        {
            cell_market_cap.innerHTML = "-";
        }

        var cell_gross_margin = row.insertCell();
        if(sorted_data[i].gross_margin != 0)
        {
            cell_gross_margin.innerHTML = sorted_data[i].gross_margin + " %";
        }              
        else
        {
            cell_gross_margin.innerHTML = "-";
        }

        var cell_profit_margin = row.insertCell();
        if(sorted_data[i].profit_margin != 0)
        {
            cell_profit_margin.innerHTML = sorted_data[i].profit_margin + " %";
        }              
        else
        {
            cell_profit_margin.innerHTML = "-";
        }

        var cell_roe = row.insertCell();
        if(sorted_data[i].roe != 0)
        {
            cell_roe.innerHTML = sorted_data[i].roe + " %";
        }
        else
        {
            cell_roe.innerHTML = "-";
        }

        var cell_debtequity = row.insertCell();
        if(sorted_data[i].debt_to_equity != 0)
        {
            cell_debtequity.innerHTML = sorted_data[i].debt_to_equity
        }
        else
        {
            cell_debtequity.innerHTML = "-";
        }

        var cell_currentratio = row.insertCell();
        if(sorted_data[i].current_ratio != 0)
        {
            cell_currentratio.innerHTML = sorted_data[i].current_ratio
        }
        else
        {
            cell_debtequity.innerHTML = "-";
        }


        var cell_dividend = row.insertCell();
        if(sorted_data[i].dividend_yield != 0)
        {
            cell_dividend.innerHTML = sorted_data[i].dividend_yield + " %"              
        }
        else
        {
            cell_dividend.innerHTML = "-";
        }

        var cell_pe = row.insertCell();
        if(sorted_data[i].pe != 0)
        {
            cell_pe.innerHTML = sorted_data[i].pe
        }
        else
        {
            cell_pe.innerHTML = "-";
        }

        var cell_pb = row.insertCell();
        if(sorted_data[i].pb != 0)
        {
            cell_pb.innerHTML = sorted_data[i].pb
        }
        else
        {
            cell_pb.innerHTML = "-";
        }

        var cell_cashflow = row.insertCell();
        cell_cashflow.innerHTML = "<button onClick='showModal(" + i + ")'>open</button>"

        var cell_change = row.insertCell();
        if(sorted_data[i].change)
        {
            cell_change.innerHTML = sorted_data[i].change + " %"
        }
        else
        {
            cell_change.innerHTML = "-";
        }
    }
        
    colors();

    page_size();
}

function showModal(i)
{
    modal_balance_title.innerHTML = "<b>" + sorted_data[i].name + "</b>"

    tr_rev1.innerHTML = sorted_data[i].rev1 != 0 ? sorted_data[i].rev1 : "-"
    tr_rev2.innerHTML = sorted_data[i].rev2 != 0 ? sorted_data[i].rev2 : "-"
    tr_rev3.innerHTML = sorted_data[i].rev3 != 0 ? sorted_data[i].rev3 : "-"
    tr_rev4.innerHTML = sorted_data[i].rev4 != 0 ? sorted_data[i].rev4 : "-"

    tr_ut1.innerHTML = sorted_data[i].ut1 != 0 ? sorted_data[i].ut1 : "-"
    tr_ut2.innerHTML = sorted_data[i].ut2 != 0 ? sorted_data[i].ut2 : "-"
    tr_ut3.innerHTML = sorted_data[i].ut3 != 0 ? sorted_data[i].ut3 : "-"
    tr_ut4.innerHTML = sorted_data[i].ut4 != 0 ? sorted_data[i].ut4 : "-"

    tr_gross1.innerHTML = sorted_data[i].gross1 != 0 ? sorted_data[i].gross1 : "-"
    tr_gross2.innerHTML = sorted_data[i].gross2 != 0 ? sorted_data[i].gross2 : "-"
    tr_gross3.innerHTML = sorted_data[i].gross3 != 0 ? sorted_data[i].gross3 : "-"
    tr_gross4.innerHTML = sorted_data[i].gross4 != 0 ? sorted_data[i].gross4 : "-"

    modal_balance.style.visibility = "visible"
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
        td[2].innerHTML = td[2].textContent + " %";
    }
}

function colors()
{
    var tr = tb.getElementsByTagName("tr");

    for(let i=0; i<tr.length; i++)
    {
        var td = tr[i].getElementsByTagName("td");

        if(sorted_data[i].gross_margin < 0)
        {
            td[2].style.color = "#e60000"
        }
        if(sorted_data[i].gross_margin > 50)
        {
            td[2].style.color = "green"
        }

        if(sorted_data[i].profit_margin < 0)
        {
            td[3].style.color = "#e60000"
        }
        if(sorted_data[i].profit_margin > 30)
        {
            td[3].style.color = "green"
        }

        if(sorted_data[i].roe < 0)
        {
            td[4].style.color = "#e60000"
        }

        if(sorted_data[i].debt_to_equity > 1)
        {
            td[5].style.color = "#e60000"
        }

        if(sorted_data[i].current_ratio < 1)
        {
            td[6].style.color = "#e60000"
        }

        if(sorted_data[i].change > 0)
        {
            td[11].style.color = "green"
        }
        else
        {
            td[11].style.color ="#e60000";
        }
    }
}

function colors_crypto()
{
    var tr = tb_crypto.getElementsByTagName("tr");

    for(let i=0; i<tr.length; i++)
    {
        var td = tr[i].getElementsByTagName("td");
        if(td[2].innerHTML > 0)
        {
            td[2].style.color = "green"
        }
        else
        {
            td[2].style.color ="#e60000";
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
                    indices = Array.from(Object.keys(data)).sort((a, b) => ((sorted_data[a].change) - (sorted_data[b].change)));
                    break;
                }
            case "market_cap":
                {
                    indices = Array.from(Object.keys(data)).sort((a, b) => ((sorted_data[a].market_cap) - (sorted_data[b].market_cap)));
                    break;
                }
            case "gross_margin":
                {
                    indices = Array.from(Object.keys(data)).sort((a, b) => ((sorted_data[a].gross_margin) - (sorted_data[b].gross_margin)));
                    break;
                }
            case "profit_margin":
                {
                    indices = Array.from(Object.keys(data)).sort((a, b) => ((sorted_data[a].profit_margin) - (sorted_data[b].profit_margin)));
                    break;
                }
            case "debtequity":
                {
                    indices = Array.from(Object.keys(data)).sort((a, b) => (((sorted_data[a].debt_to_equity) - (sorted_data[b].debt_to_equity))));
                    break;
                }
            case "current_ratio":
            {
                indices = Array.from(Object.keys(data)).sort((a, b) => (((sorted_data[a].current_ratio) - (sorted_data[b].current_ratio))));
                break;
            }
            case "dividend":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => ((sorted_data[a].dividend_yield) - (sorted_data[b].dividend_yield)));
                    break;
                }
            case "pe":
                {
                    indices = Array.from(Object.keys(sorted_data)).sort((a, b) => ((sorted_data[a].pe) - (sorted_data[b].pe)));
                    break;
                }
            case "roe":
                {
                    indices = Array.from(Object.keys(data)).sort((a, b) => ((sorted_data[a].roe) - (sorted_data[b].roe)));
                    break;
                }
            case "pb":
                {
                    indices = Array.from(Object.keys(data)).sort((a, b) => ((sorted_data[a].pb) - (sorted_data[b].pb)));
                    break;
                }
        }

        let tmp = sorted_data

        sorted_data = [];

        sorted_data = indices.map(i => tmp[i])

        table();
    }
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
        d_left.width = "75%";
        d_crypto.width = "17%";

        d_left.marginLeft = "2%";
        d_crypto.marginLeft = "3%";

        d_left.marginTop = "-1";
        d_crypto.marginTop = "-1";
        d_countdown.marginTop = "-1";

        d_left.float = "left";
        d_crypto.float = "left";

        d_crypto.height = max + "px"
    }
    else // half screen
    {
        d_left.width = "80%";
        d_crypto.width = "80%"

        d_left.margin = "auto";
        d_left.marginTop = "-1";

        d_crypto.margin = "auto";
        d_crypto.marginTop = "3%";
        d_countdown.marginTop = "3%";

        d_crypto.height = table_cryptoHeight + "px";

        max = 700;
    }

    d_left.height = tableHeight + "px";
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

window.onclick = function(event) {
    if(event.target == modal_balance)
    {
        modal_balance.style.visibility = "hidden"
    }
  }
