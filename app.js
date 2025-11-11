    // --- Selekcja elementów DOM (bez rzutowania typów) ---
    const searchForm = document.getElementById('search-form');
    const capitalInput = document.getElementById('capital-input');
    const resultsBody = document.getElementById('countries-tbody');
    const errorMessageEl = document.getElementById('error-message');

    // --- Obsługa formularza ---
    searchForm.addEventListener('submit', handleSearch);

    /**
     * Główna funkcja obsługująca wyszukiwanie.
     */
    async function handleSearch(event) {
        // Zapobiegamy domyślnemu odświeżeniu strony
        event.preventDefault();

        const capitalName = capitalInput.value.trim();

        // Czyszczenie poprzedniego stanu
        resultsBody.innerHTML = '';
        errorMessageEl.textContent = '';

        // --- Obsługa pustego pola ---
        if (!capitalName) {
            errorMessageEl.textContent = 'Proszę wpisać nazwę stolicy.';
            return;
        }

        // --- Budowanie adresu i pobieranie danych ---
        const API_URL = `https://restcountries.com/v3.1/capital/${capitalName}`;

        try {
            const response = await fetch(API_URL);

            // --- Sprawdzenie odpowiedzi (np. 404) ---
            if (!response.ok) {
                if (response.status === 404) {
                    errorMessageEl.textContent = 'Nie znaleziono kraju dla podanej stolicy.';
                } else {
                    errorMessageEl.textContent = `Wystąpił błąd: ${response.status} ${response.statusText}`;
                }
                return; // Przerwij dalsze wykonywanie
            }

            // --- Przetwarzanie JSON ---
            const data = await response.json();

            // --- Wstawianie wyników ---
            renderCountries(data);

        } catch (error) {
            // --- Obsługa błędów sieciowych ---
            console.error('Błąd pobierania danych:', error);

            let message = 'Wystąpił nieznany błąd.';
            // Sprawdzenie 'instanceof Error' jest nadal dobrą praktyką
            if (error instanceof Error) {
                message = `Błąd sieci lub połączenia: ${error.message}`;
            }
            errorMessageEl.textContent = message;
        }
    }

    /**
     * Renderuje listę krajów w tabeli HTML.
     * @param {Array} countries Tablica obiektów Country pobrana z API
     */
    function renderCountries(countries) {
        // Upewniamy się, że tabela jest pusta
        resultsBody.innerHTML = '';

        if (countries.length === 0) {
            errorMessageEl.textContent = 'Brak danych do wyświetlenia.';
            return;
        }

        // --- Dodawanie wierszy w pętli ---
        countries.forEach(country => {
            const row = document.createElement('tr');

            // --- Bezpieczny dostęp do danych ---
            const capitalName = country.capital?.[0] ?? 'Brak';
            const subregionName = country.subregion ?? 'Brak';

            // Formatowanie populacji dla czytelności
            const populationFormatted = country.population.toLocaleString('pl-PL');

            row.innerHTML = `
                <td>${country.name.common}</td>
                <td>${capitalName}</td>
                <td>${populationFormatted}</td>
                <td>${country.region}</td>
                <td>${subregionName}</td>
            `;

            resultsBody.appendChild(row);
        });
    }