let cityData = {};

export async function getCityData(city){
    const apiKey = "1d8a793b18773f58bb0de1988dc9aef8";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        // Utilisation de fetch avec async/await
        const response = await fetch(url);
    
        // Vérifie si la réponse est correcte
        if (!response.ok) {
          throw new Error('Erreur de requête réseau');
        }
    
        // Convertit la réponse en JSON
        cityData = await response.json();
        
        return cityData;

      } catch (error) {
        // Gère les erreurs
        console.error('Erreur lors de la récupération des données :', error);
      }
}