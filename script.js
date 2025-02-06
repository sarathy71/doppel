const API_URL = "https://hello-world-service-6uymma27bq-uc.a.run.app/";
let currentSortColumn = "";
let currentSortOrder = "asc";

// Function to populate dropdowns dynamically
function populateDropdowns() {
    const endDateN = document.getElementById("endDateN");
    
    // Populate N dropdown (1-10)
    for (let i = 1; i <= 10; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        endDateN.appendChild(option);
    }
    
    // Set default filter to "Last 1 Day(s)"
    endDateN.value = "1";
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

// Function to clear filters and reset to 'All'
function clearFilters() {
    document.getElementById("endDateN").value = "1";
    document.getElementById("endDateM").value = "day";
    document.getElementById("priceFilter").value = "";
    document.getElementById("priceFtFilter").value = "";
    document.getElementById("volumeFilter").value = "";
    document.getElementById("volumeFtFilter").value = "";

    currentSortColumn = "";
    currentSortOrder = "asc";

    fetchStockData();
}

// Auto-load data and populate dropdowns
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
    fetchStockData();
});
