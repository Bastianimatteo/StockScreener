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

const modal_balance = document.getElementById("modal_balance")
modal_balance.style.visibility = "hidden"
const modal_balance_title = document.getElementById("modal_balance_title")

const td_rev1 = document.getElementById("rev1")
const td_rev2 = document.getElementById("rev2")
const td_rev3 = document.getElementById("rev3")
const td_rev4 = document.getElementById("rev4")

const td_ut1 = document.getElementById("ut1")
const td_ut2 = document.getElementById("ut2")
const td_ut3 = document.getElementById("ut3")
const td_ut4 = document.getElementById("ut4")

const td_gross1 = document.getElementById("gross1")
const td_gross2 = document.getElementById("gross2")
const td_gross3 = document.getElementById("gross3")
const td_gross4 = document.getElementById("gross4")

let retryCount = 0;

var already = []

page_size();
load()

function load(){
    data = []
    already = []
    mancanti = array.length

    for(let i=0; i<array.length; i++)
    {
        xhttp[i] = new XMLHttpRequest();

        xhttp[i].open("GET", "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" + array[i] + "?modules=price%2CsummaryDetail%2CdefaultKeyStatistics%2CfinancialData%2CincomeStatementHistory%2CbalanceSheetHistory");

        xhttp[i].send();

        xhttp[i].onreadystatechange = function()
        {
            if(xhttp[i].status == 200 && xhttp[i].readyState ==4)
            {
                if(already[i] == undefined)
                {
                    
                    already[i] =  1
                    dat = {name: "", price: null, market_cap: null, gross_margin: null, profit_margin: null, roe: null, debt_to_equity: null, dividend_yield: null, pe: null, pb: null, current_ratio: null, change: null, rev: [], ut: [], gross: [], debt: []}

                    mancanti --;

                    response = JSON.parse(xhttp[i].response);
                    var result = response.quoteSummary?.result[0]

                    const name = result?.price?.shortName || ""
                    const price = result?.price?.regularMarketPrice?.raw || 0
                    const market_cap = result?.price?.marketCap?.raw || 0
                    const change = result?.price?.regularMarketChangePercent?.raw || 0

                    const gross_margin = result?.financialData?.grossMargins?.raw || 0
                    const profit_margin = result?.financialData?.profitMargins?.raw || 0
                    const current_ratio = result?.financialData?.currentRatio?.raw || 0
                    const roe = result?.financialData?.returnOnEquity?.raw || 0
                    const debt_to_equity = result?.financialData?.debtToEquity?.raw || 0

                    const pe = result?.summaryDetail?.trailingPE?.raw || 0
                    const dividend_yield = result?.summaryDetail?.trailingAnnualDividendYield?.raw || 0

                    const pb = result?.defaultKeyStatistics?.priceToBook?.raw || 0

                    const income = result?.incomeStatementHistory?.incomeStatementHistory || 0

                    const balance = result?.balanceSheetHistory?.balanceSheetStatements || 0

                    var tmp_rev = []
                    var tmp_ut = []
                    var tmp_gross = []
                    var tmp_debt = []

                    if(income != 0)
                    {
                        for(let j = 0; j<4; j++)
                        {
                            tmp_rev.push(income[j]?.totalRevenue?.raw || 0)
                            tmp_ut.push(income[j]?.netIncome?.raw || 0)
                            tmp_gross.push(income[j]?.grossProfit?.raw || 0)
                        }
                    }

                    if(balance != 0)
                    {
                        for(let j = 0; j<4; j++)
                        {
                            tmp_debt.push(balance[j]?.longTermDebt?.raw || 0)
                        }
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
                    dat.rev = tmp_rev
                    dat.ut = tmp_ut
                    dat.gross = tmp_gross
                    dat.debt = tmp_debt

                    data.push(dat)

                    if(mancanti == 0)
                    {
                        sorted_data = data
                        full = true;
                        sort("change");
                    }
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
    if (retryCount < 20) 
    {
      console.log("Retrying request " + (i + 1))
      retryCount++
      setTimeout(() => {
        load()
      }, 1000)
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
    console.log(sorted_data[i])

    modal_balance_title.innerHTML = "<b>" + sorted_data[i].name + "</b>"

    const tbody_revenue = document.getElementById("tbody_revenue")
    tbody_revenue.innerHTML = ""

    const tbody_grossmargin = document.getElementById("tbody_grossmargin")
    tbody_grossmargin.innerHTML = ""

    const tbody_debt = document.getElementById("tbody_debt")
    tbody_debt.innerHTML = ""

    const row_revenue1 = tbody_revenue.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_revenue1.insertCell();

        j == 0 ? (cell.innerHTML = "<b>Total Revenue</b>") : (cell.innerHTML = sorted_data[i].rev[j - 1] != 0 ? 
        "<b>" + format(sorted_data[i].rev[j - 1]) + "</b>" : "-")
    }

    const row_revenue2 = tbody_revenue.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_revenue2.insertCell();

        j == 0 ? (cell.innerHTML = "Gross Margin") : (cell.innerHTML = sorted_data[i].gross[j - 1] != 0 ? 
        format(sorted_data[i].gross[j - 1]) : "-")
    }

    const row_revenue3 = tbody_revenue.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_revenue3.insertCell();

        j == 0 ? (cell.innerHTML = "<b>Net Income</b>") : (cell.innerHTML = sorted_data[i].ut[j - 1] != 0 ? 
        "<b>" + format(sorted_data[i].ut[j - 1]) + "</b>" : "-")   
    }

    const row_gross_percent = tbody_grossmargin.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_gross_percent.insertCell();
        j == 0 ? (cell.innerHTML = "Gross Margin %") : cell.innerHTML = (sorted_data[i].gross[j-1] != 0 && sorted_data[i].rev[j-1] != 0) ? ((sorted_data[i].gross[j-1] * 100) / sorted_data[i].rev[j-1]).toFixed(2) + " %" : "-"
    }

    const row_profit_percent = tbody_grossmargin.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_profit_percent.insertCell();
        j == 0 ? (cell.innerHTML = "Profit Margin %") : cell.innerHTML = (sorted_data[i].ut[j-1] != 0 && sorted_data[i].rev[j-1] != 0) ? ((sorted_data[i].ut[j-1] * 100) / sorted_data[i].rev[j-1]).toFixed(2) + " %" : "-"
    }

    const row_debt = tbody_debt.insertRow()
    for(let j = 0; j<4; j++)
    {
        var cell = row_debt.insertCell();
        cell.innerHTML = sorted_data[i].debt[j] != 0 ? format(sorted_data[i].debt[j]) : "-"
    }

    modal_balance.style.visibility = "visible"
}

function format(v)
{
    const value = Math.abs(v)
    const new_value = value > 1000000000 ? (value / 1000000000).toFixed(2) + " B" : value > 1000000 ? (value / 1000000).toFixed(2) + " M" : (value / 1000).toFixed(2) + " K"
    return new_value
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

        d_crypto.height = table_cryptoHeight + "px";

        max = 700;
    }

    d_left.height = tableHeight + "px";
}

window.onresize = function() {
    page_size();
}

window.onclick = function(event) {
    if(event.target == modal_balance)
    {
        modal_balance.style.visibility = "hidden"
    }
  }
