document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";
    const tableBody = document.querySelector("#stock-table tbody");
    const headers = document.querySelectorAll("th[data-column]");
    const searchBar = document.getElementById("search-bar");
  
    let stockData = [];
  
    // 獲取 API 數據
    async function fetchStockData() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        stockData = data;
        // 預設按成交量降序排序
        stockData.sort((a, b) => (b.TradeVolume || 0) - (a.TradeVolume || 0));
        renderTable(stockData);
      } catch (error) {
        console.error("無法獲取股票數據：", error);
      }
    }
  
    // 渲染表格
    function renderTable(data) {
      tableBody.innerHTML = data.map(stock => `
        <tr>
          <td>${stock.Code}</td>
          <td>${stock.Name}</td>
          <td>${stock.TradeVolume}</td>
          <td>${stock.OpeningPrice}</td>
          <td>${stock.HighestPrice}</td>
          <td>${stock.LowestPrice}</td>
          <td>${stock.ClosingPrice}</td>
          <td>${stock.Change}</td>
        </tr>
      `).join("");
    }
  
    // 動態排序函數
    function sortTable(column, order) {
      const sortedData = [...stockData].sort((a, b) => {
        const aValue = a[column] || 0;
        const bValue = b[column] || 0;
        return order === "asc" 
          ? (typeof aValue === "number" ? aValue - bValue : aValue.localeCompare(bValue))
          : (typeof bValue === "number" ? bValue - aValue : bValue.localeCompare(aValue));
      });
      renderTable(sortedData);
    }
  
    // 點擊表頭切換排序
    headers.forEach(header => {
      header.addEventListener("click", () => {
        const column = header.dataset.column;
        const currentOrder = header.dataset.order;
        const newOrder = currentOrder === "asc" ? "desc" : "asc";
        header.dataset.order = newOrder;
        sortTable(column, newOrder);
      });
    });
  
    // 搜索功能
    searchBar.addEventListener("input", e => {
      const filter = e.target.value.toLowerCase();
      const filteredData = stockData.filter(stock => 
        stock.Code.toLowerCase().includes(filter) || stock.Name.toLowerCase().includes(filter)
      );
      renderTable(filteredData);
    });
  
    // 初始化數據加載
    fetchStockData();
  });
  