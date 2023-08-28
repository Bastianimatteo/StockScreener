array = ["UCG.MI", "ISP.MI", "ENEL.MI", "ENI.MI", "LVMH.MI", "FBK.MI", "STLAM.MI", 
"AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "TM", "RACE", "GM", "NIO", "MU", "ASML", "NFLX", "QCOM", "RIVN", "RBLX", "NVDA", "U", "AMD", "META", "INTC", "PARA", "PYPL",
"PLUG", "NKLA", "BLDP", "BE", "FCEL", "SPWR", "NEL.OL", "RUN", "CSIQ", "ENPH", "DQ", "FSLR", "SEDG", "JKS", "0916.HK",
"BYND", "BAC", "KO", "GS", "JPM", "CGC", "TSM", 
"PFE", "SNY", "NVS", "JNJ", "BNTX", "MRNA", "NTLA", "BIIB", "GSK", "ROG.SW", "CRSP", "LLY", "MRK", "AZN", "ABBV", "PG", 
"AEM", "PSA", "SBSW", "BTI", "OGI", "TLRY", "CRON", "VZ", "RYAAY", "BA", "AIR.PA"];

var xhttp = [];

var response

var data = [];
var dat = {name: "", price: null, market_cap: null, gross_margin: null, profit_margin: null, roe: null, debt_to_equity: null, dividend_yield: null, pe: null, pb: null, current_ratio: null, change: null, rev: [], net: [], gross: [], profit: [], debt: [], debtequity: [], roe1: [], roa1: []}

var sorted_data = []

var tb = document.getElementById("tbody");

var mancanti = array.length;
var full = false;

const modal_balance = document.getElementById("modal_balance")
modal_balance.style.visibility = "hidden"
const modal_balance_title = document.getElementById("modal_balance_title")

let retryCount = 0;

var already = []

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
                    dat = {name: "", price: null, market_cap: null, gross_margin: null, profit_margin: null, roe: null, debt_to_equity: null, dividend_yield: null, pe: null, pb: null, current_ratio: null, change: null, rev: [], net: [], gross: [], profit: [], debt: [], debtequity: [], roe1: [], roa1: []}

                    mancanti --;

                    response = JSON.parse(xhttp[i].response);
                    var result = response.quoteSummary?.result[0]

                    const income = result?.incomeStatementHistory?.incomeStatementHistory || 0
                    const balance = result?.balanceSheetHistory?.balanceSheetStatements || 0

                    var tmp_rev = []
                    var tmp_net = []
                    var tmp_gross = []
                    var tmp_debt = []
                    var tmp_equity = []
                    var tmp_invest = []

                    if(income != 0)
                    {
                        for(let j = 0; j<4; j++)
                        {
                            tmp_rev.push(income[j]?.totalRevenue?.raw || 0)
                            tmp_net.push(income[j]?.netIncome?.raw || 0)
                            tmp_gross.push(income[j]?.grossProfit?.raw || 0)
                        }
                    }

                    if(balance != 0)
                    {
                        for(let j = 0; j<4; j++)
                        {
                            tmp_debt.push(balance[j]?.longTermDebt?.raw || 0)
                            tmp_equity.push(balance[j]?.totalStockholderEquity?.raw || 0)
                            tmp_invest.push(balance[j]?.totalAssets?.raw || 0)
                        }
                    }

                    var arr_gross = calc_gross(tmp_gross, tmp_rev)
                    var arr_profit = calc_profit(tmp_net, tmp_rev)
                    var arr_debtequity = calc_debtequity(tmp_debt, tmp_equity)
                    var arr_roe = calc_roe(tmp_net, tmp_equity)
                    var arr_roa = calc_roa(tmp_net, tmp_invest)

                    const name = result?.price?.shortName || ""
                    const price = result?.price?.regularMarketPrice?.raw || 0
                    const market_cap = result?.price?.marketCap?.raw || 0
                    const change = result?.price?.regularMarketChangePercent?.raw || 0
                    const current_ratio = result?.financialData?.currentRatio?.raw || 0
                    const pb = result?.defaultKeyStatistics?.priceToBook?.raw || 0
                    const dividend_yield = result?.summaryDetail?.trailingAnnualDividendYield?.raw || 0
                    const gross_margin = result?.financialData?.grossMargins?.raw || 0
                    const profit_margin = result?.financialData?.profitMargins?.raw || 0
                    const pe = result?.summaryDetail?.trailingPE?.raw || 0
                    const roe = result?.financialData?.returnOnEquity?.raw || 0
                    const debt_to_equity = result?.financialData?.debtToEquity?.raw || 0

                    dat.name = name
                    dat.price = price.toFixed(2)
                    dat.market_cap = (market_cap / 1000000000).toFixed(2)
                    dat.change = (change * 100).toFixed(2)
                    dat.gross_margin = gross_margin != 0 ? (gross_margin * 100).toFixed(2) : arr_gross[0]
                    dat.profit_margin = profit_margin != 0 ? (profit_margin * 100).toFixed(2) : arr_profit[0]
                    dat.current_ratio = current_ratio.toFixed(2)
                    dat.roe = roe != 0 ? (roe * 100).toFixed(2) : arr_roe[0]
                    dat.debt_to_equity = debt_to_equity != 0 ? (debt_to_equity / 100).toFixed(2) : arr_debtequity[0]
                    dat.pe = (pe).toFixed(2)
                    dat.dividend_yield = (dividend_yield * 100).toFixed(2)
                    dat.pb = (pb).toFixed(2)

                    dat.rev = tmp_rev
                    dat.net = tmp_net
                    dat.gross = arr_gross
                    dat.profit = arr_profit
                    dat.debt = tmp_debt
                    dat.debtequity = arr_debtequity
                    dat.roe1 = arr_roe
                    dat.roa1 = arr_roa

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
      retryCount++
      setTimeout(() => {
        load()
      }, 500)
    } 
    else 
    {
        //alert("Network error. AGGIORNA LA PAGINA");
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
        cell_roe.innerHTML = sorted_data[i].roe != 0 ? sorted_data[i].roe + " %" : "-"        

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
            cell_currentratio.innerHTML = "-";
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

    const tbody_returns = document.getElementById("tbody_returns")
    tbody_returns.innerHTML = ""

    const row_revenue = tbody_revenue.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_revenue.insertCell();
        j == 0 ? (cell.innerHTML = "Total Revenue") : (cell.innerHTML = sorted_data[i].rev[j - 1] != 0 ? 
        format(sorted_data[i].rev[j - 1]) : "-")
    }

    const row_net = tbody_revenue.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_net.insertCell();
        j == 0 ? (cell.innerHTML = "Net Income") : (cell.innerHTML = sorted_data[i].net[j - 1] != 0 ? 
        format(sorted_data[i].net[j - 1]) : "-")   
    }

    const row_gross_percent = tbody_grossmargin.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_gross_percent.insertCell();
        j == 0 ? (cell.innerHTML = "<b>Gross Margin %</b>") : cell.innerHTML = (sorted_data[i].gross[j-1] != 0) ? sorted_data[i].gross[j-1] + " %" : "-"
    }

    const row_profit_percent = tbody_grossmargin.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_profit_percent.insertCell();
        j == 0 ? (cell.innerHTML = "<b>Net Profit Margin %</b>") : cell.innerHTML = (sorted_data[i].profit[j-1] != 0) ? (sorted_data[i].profit[j-1]) + " %" : "-"
    }

    const row_debt = tbody_debt.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_debt.insertCell();
        j == 0 ? (cell.innerHTML = "Long Term Debt") : cell.innerHTML = sorted_data[i].debt[j-1] != 0 ? format(sorted_data[i].debt[j-1]) : "-"
    }

    const row_debtequity = tbody_debt.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_debtequity.insertCell();
        j == 0 ? (cell.innerHTML = "<b>Debt/Equity</b>") : cell.innerHTML = (sorted_data[i].debtequity[j-1] != 0) ? (sorted_data[i].debtequity[j-1] ) : "-"
    }

    const row_roe = tbody_returns.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_roe.insertCell();
        j == 0 ? (cell.innerHTML = "<b>ROE</b>") : cell.innerHTML = (sorted_data[i].roe1[j-1] != 0) ? (sorted_data[i].roe1[j-1]) + " %" : "-"
    }

    const row_roa = tbody_returns.insertRow()
    for(let j = 0; j<5; j++)
    {
        var cell = row_roa.insertCell();
        j == 0 ? (cell.innerHTML = "<b>ROA</b>") : cell.innerHTML = (sorted_data[i].roa1[j-1] != 0) ? (sorted_data[i].roa1[j-1]) + " %" : "-"
    }

    modal_balance.style.visibility = "visible"
}

function format(value)
{
    const new_value = Math.abs(value) > 1000000000 ? (value / 1000000000).toFixed(2) + " B" : Math.abs(value) > 1000000 ? (value / 1000000).toFixed(2) + " M" : (value / 1000).toFixed(2) + " K"
    return new_value
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
        if(sorted_data[i].roe > 30)
        {
            td[4].style.color = "green"
        }

        if(sorted_data[i].debt_to_equity > 1)
        {
            td[5].style.color = "#e60000"
        }

        if(sorted_data[i].current_ratio != 0 && sorted_data[i].current_ratio < 1)
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

window.onclick = function(event) {
    if(event.target == modal_balance)
    {
        modal_balance.style.visibility = "hidden"
    }
  }

function calc_gross(gross, rev)
{
    var a = []
    for(var i = 0; i<4; i++)
    {
        a[i] = (gross[i] != 0 && rev[i] != 0) ? gross[i] != rev[i] ? ((gross[i] * 100) / rev[i]).toFixed(2) : 0 : 0
    }
    return a
}

function calc_profit(net, rev)
{
    var a = []
    for(var i = 0; i<4; i++)
    {
        a[i] = (net[i] != 0 && rev[i] != 0) ? ((net[i] * 100) / rev[i]).toFixed(2) : 0
    }
    return a
}

function calc_debtequity(debt, equity)
{
    var a = []
    for(var i = 0; i<4; i++)
    {
        a[i] = (debt[i] != 0 && equity[i] != 0) ? (debt[i] / equity[i]).toFixed(2) : 0
    }
    return a
}

function calc_roe(net, equity)
{
    var a = []
    for(var i = 0; i<4; i++)
    {
        a[i] = (net[i] != 0 && equity[i] != 0) ? (net[i] / equity[i] * 100).toFixed(2) : 0
    }
    return a
}

function calc_roa(net, invest)
{
    var a = []
    for(var i = 0; i<4; i++)
    {
        a[i] = (net[i] != 0 && invest[i] != 0) ? (net[i] / invest[i] * 100).toFixed(2) : 0
    }
    return a
}
