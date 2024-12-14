const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search-input');

// Store all countries data
let allCountries = [];
let currentSortOrder = 'asc'; // Default sort order: ascending

// Fetch all countries on page load
fetch('https://restcountries.com/v3.1/all')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    return response.json();
  })
  .then(data => {
    allCountries = data;
    displayCountries(allCountries);
  })
  .catch(error => {
    countriesContainer.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
  });

// Function to display country data in table
function displayCountries(countries) {
  countriesContainer.innerHTML = ''; // Clear current display

  if (countries.length === 0) {
    countriesContainer.innerHTML = '<tr><td colspan="6">No countries found.</td></tr>';
    return;
  }

  countries.forEach(country => {
    const row = document.createElement('tr');

    // Get country details
    const name = country.name.common;
    const flag = country.flags.svg;
    const population = country.population.toLocaleString();
    const region = country.region;
    const capital = country.capital ? country.capital[0] : 'N/A';
    const languages = Object.values(country.languages || {}).join(', ');

    // Create table row for each country
    row.innerHTML = `
      <td><img src="${flag}" alt="Flag of ${name}" width="40"></td>
      <td>${name}</td>
      <td>${population}</td>
      <td>${region}</td>
      <td>${capital}</td>
      <td>${languages}</td>
    `;

    countriesContainer.appendChild(row);
  });
}

// Search functionality
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();

  // Filter countries based on the search query
  const filteredCountries = allCountries.filter(country => {
    return country.name.common.toLowerCase().includes(query);
  });

  displayCountries(filteredCountries); // Display the filtered countries
});

// Function to sort the table
function sortTable(columnIndex) {
  const rows = Array.from(countriesContainer.rows);
  const isNumeric = columnIndex === 2; // Population column is numeric
  const isString = columnIndex === 1 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5; // Name, Region, Capital, Languages columns are string

  // Switch sort order on each column click
  currentSortOrder = (currentSortOrder === 'asc') ? 'desc' : 'asc';

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].innerText;
    const cellB = rowB.cells[columnIndex].innerText;

    let comparison = 0;

    if (isNumeric) {
      comparison = parseInt(cellA.replace(/,/g, '')) - parseInt(cellB.replace(/,/g, ''));
    } else if (isString) {
      comparison = cellA.localeCompare(cellB);
    }

    // If descending order, invert the comparison
    return currentSortOrder === 'asc' ? comparison : -comparison;
  });

  // Append sorted rows back to the table
  rows.forEach(row => countriesContainer.appendChild(row));
}
