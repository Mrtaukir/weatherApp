const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector('.loading-container');
const userInfoContainer=document.querySelector(".user-info-container");

//initially variables need
let currentTab=userTab;
const API_Key="b14efdc61b0a7d35e47b55140354b890";

currentTab.classList.add('current-tab');

getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');
        if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}



userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector('[data-weatherDes]');
    const weatherIcon=document.querySelector('[data-weatherIcon]');
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}℃`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

const grantAccessButton=document.querySelector("[data-grantAccess]");

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click",()=>{
    if(navigator.geolocation){
        confirm("Are you sure to access your location")
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("allow to get geolocation");
    }
});

let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value===""){
        return;
    }
    fetchSearchWeatherInfo(searchInput.value);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        alert(`Invalid ${err}`);
    }
}








// renderWeatherInfo=((data)=>{
//         let newPara=document.createElement('p');
//         newPara.textContent=`${data?.main?.temp.toFixed(2)} ℃`;
//         document.body.appendChild(newPara);
// })
// async function fetchWeatherDetails(){
//     // let latitude=25.05;
//     // let longitude=83.6167;
//     try{
//         let city="bhabua";
//         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`);
//         const data=await response.json();
//         console.log("Weather data: -> "+data);
        
//         renderWeatherInfo(data);
//     }
//     catch(err){
//         //handle the error here
//     }
//    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// }
// async function getCustomWeatherDetails(){
//     try{
//         let latitude=25.05;
//         let longitude=83.6167;
//         let result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_Key}`);
//         let data=await result.json();
//         console.log(data);
//     }
//     catch(err){
//         console.log(`Error Found ${err}`);
//     }
// }
// function getLocation()
// {
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geolocation found");
//     }
// }
// function showPosition(position)
// {
//     let lat=position.coords.latitude;
//     let lon=position.coords.longitude;
//     console.log(lat);
//     console.log(lon);
// }

