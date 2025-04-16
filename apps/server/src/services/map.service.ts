class MapService {
  async geocode(data: { address: string; authHeader: string | undefined }): Promise<any> {
    const { address, authHeader } = data;

    if (!address) {
      throw new Error("Address is required");
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];

    const url = `https://atlas.mappls.com/api/places/geocode?address=${encodeURIComponent(address)}&itemCount=10&access_token=${token}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data from MapMyIndia");
    }

    const result = await response.json();
    return result;
  }
}

export const mapService = Object.freeze(new MapService());
