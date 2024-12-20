import { getCityList } from '../city.mjs';
import { getCityData } from '../weather.mjs';
import { getPhotoUrl } from '../photo.mjs';
import { Chart, registerables } from 'chart.js';

const datalist = document.querySelector("datalist");
const input = document.querySelector("input");
const submit = document.querySelector("button");
const refreshButton = document.getElementById("search-refresh");

const container = document.createElement("div");
container.className = "container";
container.style.display = "flex";
container.style.gap = "25px";
container.style.flexDirection = "column";
document.body.appendChild(container);

let choice = "";

input.addEventListener("keyup", async () => {
    const input =  document.querySelector("input");
    const submit = document.querySelector("button");

    const city = await getCityList(input.value);

    for (let count = 0; count < city.length; count++){
        const option = document.createElement("option");
        option.value = city[count];
        datalist.appendChild(option);
    }

    for (let count = 0; count < city.length; count++){
        if(input.value !== city[count]){
            input.style.border = "1px solid red";
            submit.style.display = "none";
        } else {
            input.style.border = "1px solid green";
            count = city.length;
            submit.style.display = "inline";
        }
    }

});

submit.addEventListener("click",async (event) => {
    event.preventDefault();
    const input =  document.querySelector("input");
    choice = input.value;

    const cityData = await getCityData(choice);

    const dataList = cityData.list;

    const h2 = document.createElement("h2");
    h2.className = "city";
    h2.textContent = choice;
    container.appendChild(h2);

    //Creation de la div weather-today et wearther-other-day
    const weatherDiv = document.createElement("div");
    weatherDiv.className = "weather-today";
    container.appendChild(weatherDiv);

    const weatherOtherDayDiv = document.createElement("div");
    weatherOtherDayDiv.className = "weather-other-day";
    weatherOtherDayDiv.style.display = "flex";
    container.appendChild(weatherOtherDayDiv);


    //On cherche le première index de Json.list où l'heure est à minuit pour savoir où le jour 1 se termine
    const index = dataList.findIndex((element) => {
        element = element.dt_txt.split(" ")[1];
        return element === "00:00:00";
    })
    
    //Ici on va stocker dans une array les index de la fin de chaque jour
    let dayArr = [-1];
    
    //If pour empêcher un bug si l'index 0 égale minuit
    if(index === 0){
        const day1 = index + 7;
        const day2 = index + 15;
        const day3 = index + 23;
        const day4 = index + 31;
        const day5 = index + 39;
        dayArr.push(day1, day2, day3, day4, day5);
    } else {
        const day1 = index-1;
        const day2 = index + 7;
        const day3 = index + 15;
        const day4 = index + 23;
        const day5 = index + 31;
        dayArr.push(day1, day2, day3, day4, day5);
    }
    
    //On stock ici les min/max température de chaque journée
    let minArr = [];
    let maxArr = [];
    
    for(let dayCount = 0; dayCount < 5; dayCount++){
        for(let count = dayArr[dayCount] + 1; count <= dayArr[dayCount + 1]; count++){
        const tempMin = dataList[count].main.temp_min;
        const tempMax = dataList[count].main.temp_max;
        if(count === dayArr[dayCount] + 1){
            minArr.push(tempMin);
            maxArr.push(tempMax);
        } else {
            if(tempMin < minArr[dayCount]){
            minArr[dayCount] = tempMin;
            }
            if(tempMax > maxArr[dayCount]){
            maxArr[dayCount] = tempMax;
            }
        }
        }
    }

    //On affiche les min/max de chaque journée en indiquant le jour correspondant
    const currentDate = new Date();
    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY','SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    
    for(let count = 0; count < minArr.length; count++){

        const div = document.createElement("div");
        Chart.register(...registerables);
        
        // Créez dynamiquement un élément canvas avec des dimensions spécifiques
        const canvas = document.createElement('canvas');
        canvas.id = 'myChart'; // Attribuez un ID pour le contexte 2D
        // canvas.width = 500; // Largeur du canvas
        // canvas.height = 600; // Hauteur du canvas
        canvas.style.width = "90%";
        // canvas.style.maxWidth = "90%";
        canvas.style.height = "500px";
        
        let arrHours = [];
        let arrTemps = [];
        
        for(let count2 = dayArr[count] + 1; count2 <= dayArr[count + 1] + 1; count2++){
            arrHours.push(dataList[count2].dt_txt.split(" ")[1]);
            arrTemps.push(dataList[count2].main.temp);
        }
        
        if(count === 0){
            div.className = "TODAY";
            const h3 = document.createElement("h3");
            h3.textContent = div.className;
            const p_minTemp = document.createElement("p");
            p_minTemp.textContent = "Minimum temperature : " + Math.round(minArr[count]).toString() + " °C";
            const p_maxTemp = document.createElement("p");
            p_maxTemp.textContent = "Maximum temperature : " + Math.round(maxArr[count]).toString() + " °C";
            p_maxTemp.style.color = "#e57272"
            div.appendChild(h3);
            div.appendChild(p_minTemp);
            div.appendChild(p_maxTemp);

            weatherDiv.appendChild(div);
            div.appendChild(canvas); // Ajoutez le canvas à la div
        } else {
            div.className = "other-day";
            div.id = daysOfWeek[currentDate.getDay()+ count];
            const h3 = document.createElement("h3");
            h3.textContent = div.id;
            const p_minTemp = document.createElement("p");
            p_minTemp.textContent = "Min temp : " + Math.round(minArr[count]).toString() + " °C";
            const p_maxTemp = document.createElement("p");
            p_maxTemp.textContent = "Max temp : " + Math.round(maxArr[count]).toString() + " °C";
            p_maxTemp.style.color = "#e57272"
            div.appendChild(h3);
            div.appendChild(p_minTemp);
            div.appendChild(p_maxTemp);

            weatherOtherDayDiv.appendChild(div);
            div.appendChild(canvas); // Ajoutez le canvas à la div
        }
        
        // Obtenez le contexte 2D du canvas
        const ctx = canvas.getContext('2d');

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrHours, // Les labels pour les heures
                datasets: [{
                    label: 'Temperature',
                    data: arrTemps, // Les données pour les températures
                    borderColor: '#FCB72B', // Couleur de la ligne
                    borderWidth: 3
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: '#E5ECF4' // Couleur des ticks (texte des labels sur l'axe x)
                        },
                        grid: {
                            color: '#E5ECF4' // Couleur des lignes de la grille de l'axe x
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#E5ECF4' // Couleur des ticks (texte des labels sur l'axe y)
                        },
                        grid: {
                            color: '#E5ECF4' // Couleur des lignes de la grille de l'axe y
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#E5ECF4' // Couleur du texte de la légende
                        }
                    }
                }
            }
        });
    }

    // const img = document.createElement("img");
    const imgUrl = await getPhotoUrl(choice);
    // img.src = imgUrl;
    // console.log(imgUrl);
    // img.alt = "This is an image of " + choice;
    // container.appendChild(img);
    const body = document.body;
    body.style.backgroundImage = "url(" + imgUrl +")";
})

refreshButton.addEventListener("click", () => {
    if(document.querySelector(".weather")){
        const weatherDiv = document.querySelector(".weather");
        weatherDiv.remove();
    }
});