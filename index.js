const userContainer=document.querySelector("[weather-container]");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const notFound=document.querySelector(".notFound");
const forecast=document.getElementById("forecast");
const API_KEY="5ZY6XG7X7XNPRJQXS7TXM5KV7";
const day1=document.getElementById("day1");
const day2=document.getElementById("day2");
const day3=document.getElementById("day3");
const day4=document.getElementById("day4");
const day5=document.getElementById("day5");
const day1Icon=document.querySelector("[day1-icon]");
const day2Icon=document.querySelector("[day2-icon]");
const day3Icon=document.querySelector("[day3-icon]");
const day4Icon=document.querySelector("[day4-icon]");
const day5Icon=document.querySelector("[day5-icon]");
const day1Description=document.querySelector("[day-1]");
const day2Description=document.querySelector("[day-2]");
const day3Description=document.querySelector("[day-3]");
const day4Description=document.querySelector("[day-4]");
const day5Description=document.querySelector("[day-5]");
const day1Temp=document.querySelector("[day1-temp]");
const day2Temp=document.querySelector("[day2-temp]");
const day3Temp=document.querySelector("[day3-temp]");
const day4Temp=document.querySelector("[day4-temp]");
const day5Temp=document.querySelector("[day5-temp]");
const toggleBtn=document.querySelector("[toggle-btn]");
let temperature1,temperature2,temperature3,temperature4,temperature5;

const forecastContainer=document.getElementById("forecast-container");
searchForm.classList.add('active');
function renderWeatherInfo(weatherInfo){
  //fetching the elements to be written
  forecastContainer.classList.remove('active');
  const cityName=document.querySelector("[data-cityName]");
  const desc=document.querySelector("[data-weatherDescription]");
  const weatherIcon=document.querySelector("[data-weatherIcon]");
  const temp=document.querySelector("[data-temp]");
  const windSpeed=document.querySelector("[data-windSpeed]");
  const humidity=document.querySelector("[data-humidity]");
  const cloudiness=document.querySelector("[data-cloudiness]");
  const minTemp=document.querySelector("[data-minTemp]");
  const maxTemp=document.querySelector("[data-maxTemp]");
  //fetching values
  cityName.innerText=weatherInfo?.address.toUpperCase();
  desc.innerText=weatherInfo?.days[0]?.description;
  weatherIcon.src=`./assets/${weatherInfo?.days[0]?.icon}.png`;
  temp.innerText=`${weatherInfo?.days[0]?.temp} °F`;
  windSpeed.innerText=`${weatherInfo?.days[0]?.windspeed} mph`;
  humidity.innerText=`${weatherInfo?.days[0]?.humidity} %`;
  cloudiness.innerText=`${weatherInfo?.days[0]?.cloudcover} %`;
  minTemp.innerText=`${weatherInfo?.days[0]?.tempmin} °F`;
  maxTemp.innerText=`${weatherInfo?.days[0]?.tempmax} °F`;
}
const searchInput=document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName=searchInput.value;
  if(cityName.value==="")
  return;
  fetchSearchWeatherInfo(searchInput.value);
});
forecast.addEventListener("click",()=>{
  let cityName=searchInput.value;
  if(cityName.value==="")
  return;
  fetch5DaysWeather(cityName);
})
toggleBtn.addEventListener("click",()=>{
  let text=toggleBtn.innerText;
  if(text.charAt(text.length-1)==='C'){
    temperature1=fahrToCelc(temperature1);
    temperature2=fahrToCelc(temperature2);
    temperature3=fahrToCelc(temperature3);
    temperature4=fahrToCelc(temperature4);
    temperature5=fahrToCelc(temperature5);
    day1Temp.innerText="Temp: "+temperature1+" °C";
    day2Temp.innerText="Temp: "+temperature2+" °C";
    day3Temp.innerText="Temp: "+temperature3+" °C";
    day4Temp.innerText="Temp: "+temperature4+" °C";
    day5Temp.innerText="Temp: "+temperature5+" °C";
    toggleBtn.innerText="Click to see Temperature in °F"
  }
  else{
    temperature1=celcToFahr(temperature1);
    temperature2=celcToFahr(temperature2);
    temperature3=celcToFahr(temperature3);
    temperature4=celcToFahr(temperature4);
    temperature5=celcToFahr(temperature5);
    day1Temp.innerText="Temp: "+temperature1+" °F";
    day2Temp.innerText="Temp: "+temperature2+" °F";
    day3Temp.innerText="Temp: "+temperature3+" °F";
    day4Temp.innerText="Temp: "+temperature4+" °F";
    day5Temp.innerText="Temp: "+temperature5+" °F";
    toggleBtn.innerText="Click to see Temperature in °C"
  }
})
function celcToFahr( n ) {
  return ((n * 9.0 / 5.0) + 32.0).toFixed(2);
}
function fahrToCelc(n){
  return ((n - 32) * 5.0/9.0).toFixed(2);
}
async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  notFound.classList.remove("active");
  userInfoContainer.classList.remove("active");

  try{
    const response=await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays&key=${API_KEY}&contentType=json`);
    if(!response.ok){
      throw new Error("Api Error");
    }
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    loadingScreen.classList.remove("active");
    notFound.classList.add("active");
  }
}
async function fetch5DaysWeather(city){
  loadingScreen.classList.add("active");
  notFound.classList.remove("active");
  try{
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var startDate=date;
    const start=startDate.getFullYear()+"-"+(parseInt(startDate.getMonth())+1)+"-"+startDate.getDate();
    console.log(start);
    date.setDate(date.getDate() + 4);
    const end=date.getFullYear()+"-"+(parseInt(startDate.getMonth())+1)+"-"+date.getDate();
    console.log(end);
    const response=await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${start}/${end}?unitGroup=us&include=days&key=${API_KEY}&contentType=json`);
    if(!response.ok){
      throw new Error("Api Error");
    }
    const data=await response.json();
    loadingScreen.classList.remove("active");
    renderForecastedData(data);
    forecastContainer.classList.add('active');
  }
  catch(err){
    loadingScreen.classList.remove("active");
    notFound.classList.add("active");
  }
}
function renderForecastedData(data){
  day1.innerText=data?.days[0]?.datetime;
  day2.innerText=data?.days[1]?.datetime;
  day3.innerText=data?.days[2]?.datetime;
  day4.innerText=data?.days[3]?.datetime;
  day5.innerText=data?.days[4]?.datetime;
  day1Icon.src=`./assets/${data?.days[0]?.icon}.png`;
  day2Icon.src=`./assets/${data?.days[1]?.icon}.png`;
  day3Icon.src=`./assets/${data?.days[2]?.icon}.png`;
  day4Icon.src=`./assets/${data?.days[3]?.icon}.png`;
  day5Icon.src=`./assets/${data?.days[4]?.icon}.png`;
  day1Description.innerText=data?.days[0]?.description;
  day2Description.innerText=data?.days[1]?.description;
  day3Description.innerText=data?.days[2]?.description;
  day4Description.innerText=data?.days[3]?.description;
  day5Description.innerText=data?.days[4]?.description;
  day1Temp.innerText="Temp: "+data?.days[0]?.temp+" °F";
  day2Temp.innerText="Temp: "+data?.days[1]?.temp+" °F";
  day3Temp.innerText="Temp: "+data?.days[2]?.temp+" °F";
  day4Temp.innerText="Temp: "+data?.days[3]?.temp+" °F";
  day5Temp.innerText="Temp: "+data?.days[4]?.temp+" °F";
  temperature1=data?.days[0]?.temp;
  temperature2=data?.days[1]?.temp;
  temperature3=data?.days[2]?.temp;
  temperature4=data?.days[3]?.temp;
  temperature5=data?.days[4]?.temp;

  toggleBtn.classList.add("active");

}