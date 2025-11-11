const searchForm = document.getElementById('search-form');
const capitalInput = document.getElementById('capital-input');
const resultsBody = document.getElementById('countries-tbody');
const errorMessageEl = document.getElementById('error-message');

searchForm.addEventListener('submit', handleSearch);

async function handleSearch(event) {
    event.preventDefault();

    const capitalName = capitalInput.value.trim();

    resultsBody.innerHTML = '';
    errorMessageEl.textContent = '';

    if (!capitalName) {
        errorMessageEl.textContent = 'Proszę wpisać nazwę stolicy.';
        return;
    }

    const API_URL = `https://restcountries.com/v3.1/capital/${capitalName}`;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            if (response.status === 404) {
                errorMessageEl.textContent = 'Nie znaleziono kraju dla podanej stolicy.';
            } else {
                errorMessageEl.textContent = `Wystąpił błąd: ${response.status} ${response.statusText}`;
            }
            return;
        }

        const data = await response.json();

        renderCountries(data, capitalName);

    } catch (error) {
        console.error('Błąd pobierania danych:', error);

        let message = 'Wystąpił nieznany błąd.';
        if (error instanceof Error) {
            message = `Błąd sieci lub połączenia: ${error.message}`;
        }
        errorMessageEl.textContent = message;
    }
}

function renderCountries(countries, query) {
    resultsBody.innerHTML = '';

    if (countries.length === 0) {
        errorMessageEl.textContent = 'Brak danych do wyświetlenia.';
        return;
    }

    const regex = new RegExp(query, 'gi');

    countries.forEach(country => {
        const row = document.createElement('tr');

        const capitalName = country.capital?.[0] ?? 'Brak';
        const subregionName = country.subregion ?? 'Brak';
        const populationFormatted = country.population.toLocaleString('pl-PL');

        const highlightedCapital = capitalName.replace(regex, '<span class="highlight">$&</span>');

        row.innerHTML = `
            <td>${country.name.common}</td>
            <td>${highlightedCapital}</td>
            <td>${populationFormatted}</td>
            <td>${country.region}</td>
            <td>${subregionName}</td>
        `;

        resultsBody.appendChild(row);
    });
}