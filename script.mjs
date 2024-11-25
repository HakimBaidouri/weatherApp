import city from './city.mjs';
import { getCityData } from './weather.mjs';

const datalist = document.querySelector("datalist");
const input = document.querySelector("input");
const submit = document.querySelector("button");

let choice = "";

for (let count = 0; count < city.length; count++){
    const option = document.createElement("option");
    option.value = city[count];
    datalist.appendChild(option);
}

input.addEventListener("keyup", (event) => {
    const input =  document.querySelector("input");
    const submit = document.querySelector("button");
    console.log(input.value);
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

    if(document.querySelector(".weather")){
        const weatherDiv = document.querySelector(".weather");
        weatherDiv.remove();
    }

    const cityData = await getCityData(choice);

    const dataList = cityData.list;

    const weatherDiv = document.createElement("div");
    weatherDiv.className = "weather";
    document.body.appendChild(weatherDiv);
    const h2 = document.createElement("h2");
    h2.className = "city";
    h2.textContent = choice;
    weatherDiv.appendChild(h2);

    const index = dataList.findIndex((element) => {
        element = element.dt_txt.split(" ")[1];
        return element === "00:00:00";
    })
    
    let dayArr = [-1];
    
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
    
    // for(let count = 0; count < minArr.length; count++){
    //     const minTemp = (minArr[count] - 32) / 1.8;
    //     minArr[count] = minTemp;
    //     const maxTemp = (maxArr[count] - 32) / 1.8;
    //     maxArr[count] = maxTemp;
    // }
    
    for(let count = 0; count < minArr.length; count++){
        const div = document.createElement("div");
        if(count === 0){
        div.className = "Today";
        const h3 = document.createElement("h2");
        h3.textContent = div.className;
        const p_minTemp = document.createElement("p");
        p_minTemp.textContent = "Minimum temperature : " + minArr[count].toFixed(2).toString() + " °C";
        const p_maxTemp = document.createElement("p");
        p_maxTemp.textContent = "Maximum temperature : " + maxArr[count].toFixed(2).toString() + " °C";
        div.appendChild(h3);
        div.appendChild(p_minTemp);
        div.appendChild(p_maxTemp);
        } else {
        div.className = "Day " + (count + 1).toString();
        const h3 = document.createElement("h2");
        h3.textContent = div.className;
        const p_minTemp = document.createElement("p");
        p_minTemp.textContent = "Minimum temperature : " + minArr[count].toFixed(2).toString() + " °C";
        const p_maxTemp = document.createElement("p");
        p_maxTemp.textContent = "Maximum temperature : " + maxArr[count].toFixed(2).toString() + " °C";
        div.appendChild(h3);
        div.appendChild(p_minTemp);
        div.appendChild(p_maxTemp);
        }
        weatherDiv.appendChild(div);
    }
})

