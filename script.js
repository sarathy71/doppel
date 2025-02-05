const API_URL = "https://hello-world-service-6uymma27bq-uc.a.run.app/";

async function fetchStockData() {
    try {
        console.log("Fetching data from API...");
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Data received:", data);
        populateTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("loading").innerText = `Failed to load data: ${error.message}`;
    }
}

function populateTable(data) {
    const tableBody = document.querySelector("#stock-table tbody");
    const loadingText = document.getElementById("loading");
    tableBody.innerHTML = "";  // Clear previous data

    if (!Array.isArray(data) || data.length === 0) {
        loadingText.innerText = "No data available.";
        return;
    }

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.symbol}</td>
                <td>${item.end}</td>
                <td>${item.price_pc}</td>
                <td>${item.price_ft_pc}</td>
                <td>${item.volume_pc}</td>
                <td>${item.vol_ft_pc}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    loadingText.style.display = "none"; // Hide loading text after data loads
}

// Auto-load data when the page loads
document.addEventListener("DOMContentLoaded", fetchStockData);
