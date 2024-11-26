import { createApi } from './node_modules/unsplash-js/dist/unsplash-js.esm.mjs';

const api = createApi({
    accessKey:"NFrZO-a6jPhucTYY3l3kXQv1vx3dXMyyxEWKhWZIBgo"
})


async function getPhotoUrl(city) {
  try {
      // Attend la réponse de l'API avec await
      const result = await api.search.getPhotos({ query: city, orientation: "landscape" });

      // Vérifie si la réponse est valide et contient des résultats
      if (result.response && result.response.results.length > 0) {
          // Récupère l'URL de la première image
          const imageUrl = result.response.results[0].urls.regular;
          return imageUrl; // Retourne l'URL
      } else {
          throw new Error("No images found");
      }
  } catch (error) {
      console.log("Something went wrong!", error);
  }
}


export { getPhotoUrl }