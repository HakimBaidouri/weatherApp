let city = [];

function createCityList(json){
    if(json.length > 9){
        for(let count = 0; count < json.length || city.length < 10; count++){
            const cityName = json[count].name + ", " + json[count].state;
            city.push(cityName);
            city = [...new Set(city)];
        }
    } else {
        for(let count = 0; count < json.length; count++){
            const cityName = json[count].name + ", " + json[count].state;
            city.push(cityName);
            city = [...new Set(city)];
        }
    }
}

export async function getCityList (choice){
    const apiKey = "1d8a793b18773f58bb0de1988dc9aef8";
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${choice}&limit=5&appid=${apiKey}`;

    try {
        // Utilisation de fetch avec async/await
        const response = await fetch(url);
    
        // Vérifie si la réponse est correcte
        if (!response.ok) {
          throw new Error('Erreur de requête réseau');
        }
    
        // Convertit la réponse en JSON
        const cityJSON = await response.json();
        createCityList(cityJSON);
        return city

      } catch (error) {
        // Gère les erreurs
        console.error('Erreur lors de la récupération des données :', error);
      }
}