# 🌍 Country Explorer

A web app that combines three public APIs to explore countries around the world — weather, exchange rates, and geographic data in one place.

**[Live Demo](https://country-explorer-chi-self.vercel.app/)**

---

## Features

- **Browse** — search and filter 250+ countries by name, capital, or region
- **Country Detail** — population, area, currency, languages, live weather, and exchange rates
- **Compare** — pick two countries and compare them side by side
- **Visited** — mark countries as visited, persisted across sessions

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## APIs

| API | Usage |
|-----|-------|
| [REST Countries](https://restcountries.com/) | Country data — name, flag, capital, population, area, currencies |
| [Open-Meteo](https://open-meteo.com/) | Current weather at the country's coordinates |
| [ExchangeRate API](https://exchangerate-api.com/) | Live exchange rates relative to USD |

All APIs are free and require no API key.

## Getting Started

```bash
git clone https://github.com/mauArtavia/country-explorer.git
cd country-explorer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  components/       # SearchBar, CountryCard, RegionFilter
  pages/            # Home, CountryDetail, Compare, Visited
  hooks/            # useCountry, useWeather, useExchange, useVisited
  services/         # api.js — all external API calls
```

## Deploy

Deployed on [Vercel](https://vercel.com/). Every push to `main` triggers an automatic redeploy.