// API Key
const API_KEY = "1d71b1b6d76660beead8a91d68efb2d0";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");
const weatherDisplay = document.getElementById("weatherDisplay");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

// Weather Display Elements
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
};

// Toggle theme
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};

// Show error message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  weatherDisplay.classList.remove("show");

  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
};

// Hide error message
const hideError = () => {
  errorMessage.classList.remove("show");
};

// Show loading state
const showLoading = () => {
  loading.classList.add("show");
  weatherDisplay.classList.remove("show");
  hideError();
};

// Hide loading state
const hideLoading = () => {
  loading.classList.remove("show");
};

// Fetch weather data
const fetchWeatherData = async (city) => {
  showLoading();

  try {
    const response = await fetch(
      `${API_BASE_URL}?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "City not found. Please check the spelling and try again."
        );
      } else if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please check your API configuration."
        );
      } else {
        throw new Error(
          "Failed to fetch weather data. Please try again later."
        );
      }
    }

    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    hideLoading();

    if (error.message.includes("Failed to fetch")) {
      showError("Network error. Please check your internet connection.");
    } else {
      showError(error.message);
    }
  }
};

// Display weather data
const displayWeatherData = (data) => {
  hideLoading();
  hideError();

  // Update city name
  cityName.textContent = `${data.name}, ${data.sys.country}`;

  // Update temperature
  temperature.textContent = `${Math.round(data.main.temp)}°C`;

  // Update weather icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  weatherIcon.alt = data.weather[0].description;

  // Update weather description
  weatherDescription.textContent = data.weather[0].description;

  // Update additional details
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;

  // Show weather display
  weatherDisplay.classList.add("show");
};

// Handle search
const handleSearch = () => {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  fetchWeatherData(city);
};

// Event Listeners
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

themeToggle.addEventListener("click", toggleTheme);

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Check if API key is set
  if (API_KEY === "YOUR_API_KEY_HERE") {
    showError("Please add your OpenWeatherMap API key to use this app.");
  }
});
