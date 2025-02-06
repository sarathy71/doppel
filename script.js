const API_URL = "https://hello-world-service-6uymma27bq-uc.a.run.app/";

// Predefined filter values
const filterValues = [65, 70, 75, 80, 85, 90, 95];

// Function to populate dropdowns
function populateDropdowns() {
    const dropdowns = ["priceFilter", "priceFtFilter", "volumeFilter", "volumeFtFilter"];
    dropdowns.forEach(id => {
        const select = document.getElementById(id);
        filterValues.forEach(value => {
            let option = document.createElement("option");
            option.value = value;
            option.textContent = `>${value}`;
            select.appendChild(option);
        });
    });
}

// Function to fetch data with filters
async function fetchStockData(filters = {}) {
    try {
        let url = API_URL + "?";
        Object.keys(filters).forEach((key, index) => {
            if (filters[key]) {
                url += `${index > 0 ? "&" : ""}${key}=${filters[key]}`;
            }
        });

        console.log("Fetching data from API with URL:", url);
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Data received:", data);
        populateTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("loading").innerText = `Failed to load data: ${error.message}`;
    }
}

// Function to apply filters
function applyFilters() {
    const filters = {
        price_pc: document.getElementById("priceFilter").value,
        price_ft_pc: document.getElementById("priceFtFilter").value,
        volume_pc: document.getElementById("volumeFilter").value,
        vol_ft_pc: document.getElementById("volumeFtFilter").value
    };

    fetchStockData(filters);
}

// Function to populate table
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

// Auto-load data and populate dropdowns
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
    fetchStockData();
});
