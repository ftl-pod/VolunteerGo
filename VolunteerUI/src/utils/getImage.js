const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export const getPexelsImage = async (query = "volunteering") => {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    if (!res.ok) throw new Error("Pexels API request failed");

    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.landscape;
    }
  } catch (err) {
    console.error("Error fetching Pexels image:", err);
  }

  // Final fallback
  return "https://picsum.photos/800/400";
};
