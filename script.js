'use strict';

const btnSearch = document.querySelector('.btn-search');
const countryInput = document.getElementById('countryInput');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, isNeighbor = false) {
  const countryElement = document.createElement('article');
  countryElement.classList.add('country');

  if (isNeighbor) {
    countryElement.classList.add('neighbour');
  }

  const html = `
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <p class="country__row"><span>🏢</span> Capital: ${data.capital[0]}</p>
      <p class="country__row country__region"><span>🌍</span> Region: ${data.region}</p>
      <p class="country__row"><span>🌍</span> Subregion: ${data.subregion}</p>
      <p class="country__row"><span>👫</span> Population: ${data.population}</p>
    </div>
  `;

  countryElement.innerHTML = html;
  countriesContainer.appendChild(countryElement);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => {
      // NEIGHBOR
      renderCountry(data[0]);
      console.log(data[0]);
      const neighbor = data[0].borders[0];
      if (neighbor) {
        return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
      }
    })
    .then(response => {
      if (response && !response.ok)
        throw new Error(`Neighbor not found (${response.status})`);
      if (response) {
        return response.json();
      }
    })
    .then(data => renderCountry(data[0], true))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    });
};

btnSearch.addEventListener('click', () => {
  const countryName = countryInput.value;
  if (countryName.trim() !== '') {
    countriesContainer.innerHTML = ''; // Clear previous results
    getCountryData(countryName);
  }
});

countryInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    const countryName = countryInput.value;
    if (countryName.trim() !== '') {
      countriesContainer.innerHTML = ''; // Clear previous results
      getCountryData(countryName);
    }
  }
});
