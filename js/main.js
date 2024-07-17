const API_KEY = 'f5c0821f15c3b6ce16b96855622fb7a6';


const form = document.querySelector("#form");
const input = document.querySelector(".form__input");



// работаем с формой
form.addEventListener("submit", submitHandler);

// функция для формы 
async function submitHandler(event) {

    event.preventDefault();

    if (!input.value.trim()) {
        return;
        
    }

    let city = await getGeo(input.value.trim());

    if(city.length === 0){
        alert("Введите корректный город");
        input.value = "";
        return;

    }

    let weather = await getWeather(city[0].lat, city[0].lon);



    // проверяем данные
    console.log(city);
    console.log(city[0].name);
    console.log("погода: " + weather.main.temp);
    console.log("влажность: " + weather.main.humidity);
    console.log("ветер: " + weather.wind.speed);
    console.log(weather.weather[0].main);
    console.log(weather)

    // добавляем в объект все полученные данные 
    const weatherData = {
        name: city[0].name,
        temp: Math.round(weather.main.temp),
        description: weather.weather[0].description,
        humidity: weather.main.humidity,
        speed: Math.round(weather.wind.speed),
        main: weather.weather[0].main,
        country: city[0].country,
    }

    renderWeatherData(weatherData);

    input.value = "";
}

// получаем локацию 
async function getGeo(name) {

    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;

    const response = await fetch(geoUrl);
    const data = await response.json();

    return data;
}

// получаем погоду
async function getWeather(lat, lon) {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(weatherUrl);
    const data = await response.json();


    return data;
}


// Рендерим страницу
function renderWeatherData(data) {

    let info = document.querySelector("#info");
    let text = ` <section class="info">
            <div class="weather__info">

                <img class="weather__img" 
                    ${data.main == "Thunderstorm" && 'src="./img/weather/thunderstorm.png"'}
                    ${data.main == "Drizzle" && 'src="./img/weather/drizzle.png"'}
                    ${data.main == "Rain" && 'src="./img/weather/rain.png"'}
                    ${data.main == "Snow" && 'src="./img/weather/snow.png"'}
                    ${data.main == "Clear" && 'src="./img/weather/clear.png"'}
                    ${data.main == "Clouds" && 'src="./img/weather/clouds.png"'}

                alt="${data.main}">
                
                <div class="weather__temp">${data.temp}°<small>c</small></div>
                <div class="temp__info">${data.main}</div>
                <div class="temp__description">${data.description}</div>
                <div class="weather__city">${data.name}</div>
                <div class="weather__country">${data.country}</div>

            </div>

            <section class="weather__details">

                <section class="details">
                    <img class="details__img" src="./img/ui/humidity.svg" alt="humidity">
                    <div class="details__info">
                        <div class="details__value">${data.humidity}%</div>
                        <div class="details__title">Humidity</div>
                    </div>
                </section>

                <section class="details">
                    <img class="details__img" src="./img/ui/wind-speed.svg" alt="humidity">

                    <div class="details__info">
                        <div class="details__value">${data.speed} km/h</div>
                        <div class="details__title">Wind Speed</div>
                    </div>
                </section>

            </section>
        </section> `;

    info.innerHTML = text;

}


// получаем местоположение

window.addEventListener("load", requestGeoPosition);

function requestGeoPosition() {
    navigator.geolocation.getCurrentPosition(async function (position) {

        const geoRequest = `http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`;
        const geoResponse = await fetch(geoRequest);
        const geoData = await geoResponse.json();

        const weatherData = await getWeather(position.coords.latitude, position.coords.longitude)

        console.log(geoData);
        console.log(weatherData);

        const requestData = {
            country: geoData[0].country,
            name: geoData[0].name,
            temp: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            speed: Math.round(weatherData.wind.speed),
            main: weatherData.weather[0].main,
        }

        renderWeatherData(requestData)

    }, function (error) {
        console.log(error.message); // выводит сообщение об ошибке
    });
}




