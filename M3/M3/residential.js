// Fetch agent data from the API
fetch('http://99.79.77.144:3000/api/agents')
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
        // Select the <tbody> element inside the table with ID "agents-table"
        const tableBody = document.querySelector('#agents-table tbody');

        // Filter agents with a rating of 95 or higher and loop through them
        data
            .filter(agent => parseFloat(agent.rating) >= 95)
            .forEach(agent => {
                // Create a new table row
                const row = document.createElement('tr');

                // Fill the row with agent data using template literals
                row.innerHTML = `
                    <td>${agent.first_name || ''}</td>
                    <td>${agent.last_name || ''}</td>
                    <td>${agent.email || ''}</td>
                    <td>${agent.region || ''}</td>
                    <td>${agent.rating || ''}</td>
                    <td>${agent.fee || ''}</td>
                `;

                // Add the row to the table body
                tableBody.appendChild(row);
            });
    })
    .catch(error => {
        // Log any errors that occur while fetching the data
        console.error('Error fetching agents:', error);
    });


// Object to keep track of sort direction for each column
let sortDirection = {};

// Function to sort the table by column index `n`
function sortTable(n) {
    const table = document.getElementById("agents-table");
    const tbody = table.querySelector("tbody");

    // Toggle sort direction for the column
    sortDirection[n] = !sortDirection[n];
    const dir = sortDirection[n] ? 1 : -1; // 1 for ascending, -1 for descending

    // Convert rows into an array and sort them based on column `n`
    const sortedRows = Array.from(tbody.rows).sort((a, b) => {
        // Get text content of the nth cell in both rows, in lowercase
        const x = a.cells[n].innerText.toLowerCase();
        const y = b.cells[n].innerText.toLowerCase();

        // Compare and sort based on direction
        return x > y ? dir : x < y ? -dir : 0;
    });

    // Append sorted rows back to the tbody (reorders the rows visually)
    sortedRows.forEach(row => tbody.appendChild(row));

}
function filterRegion(region) {
    const rows = document.querySelectorAll("#agents-table tbody tr");

    rows.forEach(row => {
        const regionCell = row.cells[3]; // Region is the 4th column
        const regionText = regionCell ? regionCell.textContent.trim() : "";

        row.style.display = (region === "all" || regionText === region) ? "" : "none";
    });
}


