const API_URL = "https://hello-world-service-6uymma27bq-uc.a.run.app/";
let currentSortColumn = "";
let currentSortOrder = "asc";

// Function to populate dropdowns dynamically
function populateDropdowns() {
    const endDateN = document.getElementById("endDateN");

    // Populate N dropdown (0-10, where 0 means today)
    for (let i = 0; i <= 10; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        endDateN.appendChild(option);
    }

    // Set default filter to "Last 0 Day(s)" (Today)
    endDateN.value = "0";
    document.getElementById("endDateM").value = "day";
}

// Function to fetch data with filters and sorting
async function fetchStockData(filters = {}, sortColumn = "", sortOrder = "") {
    try {
        let url = API_URL + "?";
        Object.keys(filters).forEach((key, index) => {
            if (filters[key]) {
                url += `${index > 0 ? "&" : ""}${key}=${filters[key]}`;
            }
        });

        // Add sorting parameters
        if (sortColumn) {
            url += `&sort_by=${sortColumn}&order=${sortOrder}`;
        }

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
        end_date_n: document.getElementById("endDateN").value,
        end_date_m: document.getElementById("endDateM").value,
        price_pc: document.getElementById("priceFilter").value,
        price_ft_pc: document.getElementById("priceFtFilter").value,
        volume_pc: document.getElementById("volumeFilter").value,
        vol_ft_pc: document.getElementById("volumeFtFilter").value
    };

    fetchStockData(filters, currentSortColumn, currentSortOrder);
}

// Function to clear filters and reset to 'Last 0 Day(s)'
function clearFilters() {
    document.getElementById("endDateN").value = "0";
    document.getElementById("endDateM").value = "day";
    document.getElementById("priceFilter").value = "";
    document.getElementById("priceFtFilter").value = "";
    document.getElementById("volumeFilter").value = "";
    document.getElementById("volumeFtFilter").value = "";

    currentSortColumn = "";
    currentSortOrder = "asc";

    fetchStockData();
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
                <td>${item.end_date ? item.end_date : "N/A"}</td>  <!-- Fix reference to end_date -->
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
