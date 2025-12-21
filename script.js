const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
});
const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 1
});
async function data() {
    try {
        const target = "https://api.coingecko.com/api/v3/global";
        let response = await fetch(target);
        let readable = await response.json();
        let marketCap = currencyFormatter.format(readable.data.total_market_cap.usd);
        let vol = currencyFormatter.format(readable.data.total_volume.usd);
        let dominance = percentFormatter.format(readable.data.market_cap_percentage.btc) + "%";
        return {
            marketCap, vol, dominance //never put a line after return directly start after return else browser would put a semicolon after return and value the n won't be reutrned
        };

    } catch (error) {
        console.error("Error fetching data:", error);
        return { error: "Failed to fetch data" };
    }
}
async function buildTopBoard() {
    let obj = await data();
    if (obj.error) {
        console.error(obj.error);
        return;
    }
    let market = document.querySelector("#market");
    market.innerHTML = "";
    const details = [
        { label: "MARKET CAP", value: obj.marketCap, trend: "↗" },
        { label: "24H VOLUME", value: obj.vol, trend: "" },
        { label: "BTC DOMINANCE", value: obj.dominance, trend: "↘" }
    ]
    details.forEach((item) => {
        const cardHtnl = `<div class="card">
             <div class="cardContent">
                  <div class="label">${item.label}</div>
                  <div class="row"><p>${item.value}<span class="trend">${item.trend}</span></p>
                  </div>
             </div>
        </div>`;
        market.innerHTML += cardHtnl;
    })
}
buildTopBoard();
async function value() {
    try {
        let val = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,cardano");
        let response = await val.json();
        return response;
    } catch (error) {
        console.error(error);
        return [];
    }
}
let val = document.querySelector("#value");
val.innerHTML = "";
async function buildValue() {
    // clear existing content to avoid duplicates on rebuild
    val.innerHTML = "";
    let arr = await value();
    arr.forEach((item) => {
        const cardHtnl = `<div class="card" style="flex: 1; min-width: 400px; margin-top:5px; margin-bottom:5px;margin-left:4px">
             <div class="cardContent">
              <div class="label" style="display: flex; flex-direction: row; gap: 4px;"><span><img src="${item.image}" style="height: 2.1rem; width: 2.1rem; border-radius: 1.06rem;"></span> ${item.name} (${item.symbol.toUpperCase()})</div>
              <div class="row" style="display: flex; flex-direction: column; gap: 2px;">
                <p>${currencyFormatter.format(item.current_price)}</p>
                <p style="display: flex; gap: 8px;"><span style="font-size:25px">${percentFormatter.format(item.price_change_percentage_24h)}%</span><span class="trend" style="font-size:25px">${item.price_change_percentage_24h > 0 ? '↗' : '↘'}</span></p>
              </div>
             </div>
        </div>`;
        val.innerHTML += cardHtnl;
    })
}
buildValue();
let mmain=document.querySelector("#main");
let msg=document.createElement("p");
msg.innerText="No matching item exists";
msg.style.color="red";
msg.style.fontSize="20px";
msg.style.display = "none";
mmain.appendChild(msg);
let search=document.querySelector("#txt");
let searchVal=document.getElementsByClassName("label");
search.addEventListener("input",()=>{
    let count=0;
   for(let i=0;i<searchVal.length;i++){
    let labelTsxt=searchVal[i].innerText.toLowerCase();
    let card=searchVal[i].closest(".card");//closest is used to find the nearest parent selector which could be either id or class or tag
    if(labelTsxt.includes(search.value.toLowerCase())){
        card.style.display="";
        count++;
    }else{
        card.style.display="none";
    }
   }
   msg.style.display=(count==0)?"block":"";
});
//for refreshing of the data 
setInterval(()=>{
    buildTopBoard();
    buildValue();
    search.dispatchEvent(new Event("input"))
},60000);
