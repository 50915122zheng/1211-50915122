document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON";
  const tableBody = document.querySelector("#air-quality-table tbody");
  const searchBar = document.getElementById("search-bar");
  const headers = document.querySelectorAll("th[data-column]");

  let airQualityData = [];

  // 獲取空氣品質資料
  async function fetchAirQualityData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP 錯誤：${response.status}`);
        const result = await response.json();

        // 確認返回的數據
        console.log(result); // 打印 API 返回的完整數據
        if (result.records && result.records.length > 0) {
            console.log(result.records[0]); // 打印第一筆資料，檢查結構

            airQualityData = result.records.map(record => ({
                SiteName: record.sitename || "未提供",
                County: record.county || "未提供",
                AQI: record.aqi || "N/A",
                Status: record.status || "未提供",
                PM25: record["pm2.5"] || "N/A",
                PM10: record.pm10 || "N/A",
                WindSpeed: record.wind_speed || "N/A",
                PublishTime: record.publish_time || "未提供"
            }));

            renderTable(airQualityData);
        } else {
            tableBody.innerHTML = "<tr><td colspan='8'>無有效數據</td></tr>";
        }
    } catch (error) {
        console.error("無法獲取空氣品質數據：", error);
        tableBody.innerHTML = "<tr><td colspan='8'>獲取數據時發生錯誤</td></tr>";
    }
}

  // 資料預處理：統一處理空值
  function preprocessData(data) {
      return data.map(record => ({
          SiteName: record.SiteName || "未提供",
          County: record.County || "未提供",
          AQI: record.AQI || "N/A",
          Status: record.Status || "未提供",
          PM25: record["PM2.5"] || "N/A",
          PM10: record.PM10 || "N/A",
          WindSpeed: record.WindSpeed || "N/A",
          PublishTime: record.PublishTime || "未提供"
      }));
  }

  // 渲染表格
  function renderTable(data) {
      tableBody.innerHTML = data.map(record => `
          <tr>
              <td>${record.SiteName}</td>
              <td>${record.County}</td>
              <td>${record.AQI}</td>
              <td>${record.Status}</td>
              <td>${record.PM25}</td>
              <td>${record.PM10}</td>
              <td>${record.WindSpeed}</td>
              <td>${record.PublishTime}</td>
          </tr>
      `).join("");
  }

  // 搜尋功能
  searchBar.addEventListener("input", e => {
      const filter = e.target.value.toLowerCase();
      const filteredData = airQualityData.filter(record =>
          record.SiteName?.toLowerCase().includes(filter) ||
          record.County?.toLowerCase().includes(filter)
      );
      renderTable(filteredData);
  });

  // 排序功能
  headers.forEach(header => {
      header.addEventListener("click", () => {
          const column = header.dataset.column;
          const order = header.dataset.order;

          // 排序數據
          const sortedData = [...airQualityData].sort((a, b) => {
              const aValue = a[column] || "";
              const bValue = b[column] || "";
              return order === "asc"
                  ? aValue.localeCompare(bValue, undefined, { numeric: true })
                  : bValue.localeCompare(aValue, undefined, { numeric: true });
          });

          // 更新排序方向
          header.dataset.order = order === "asc" ? "desc" : "asc";

          // 重新渲染表格
          renderTable(sortedData);
      });
  });

  // 初始資料加載
  fetchAirQualityData();
});
