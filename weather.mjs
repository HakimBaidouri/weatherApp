const city = "London";


async function getData(city){
    const apiKey = "1d8a793b18773f58bb0de1988dc9aef8";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
        // Utilisation de fetch avec async/await
        const response = await fetch(url);
    
        // Vérifie si la réponse est correcte
        if (!response.ok) {
          throw new Error('Erreur de requête réseau');
        }
    
        // Convertit la réponse en JSON
        const data = await response.json();
        
        console.log(data.list[3].dt - data.list[2].dt);
        // Exemple pour accéder à la liste de prévisions météo
        // const forecastList = data.list;
        // forecastList.forEach(forecast => {
        //   console.log(`Prévision : ${forecast.dt_txt}, Température : ${forecast.main.temp}°K`);
        // });
    
      } catch (error) {
        // Gère les erreurs
        console.error('Erreur lors de la récupération des données :', error);
      }
}

getData(city);