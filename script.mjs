import city from './city.mjs';

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

submit.addEventListener("click",(event) => {
    event.preventDefault();
    const input =  document.querySelector("input");
    choice = input.value;
})

export default choice;