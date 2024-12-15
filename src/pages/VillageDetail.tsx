import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Character {
  id: number;
  name: string;
  images: string[];
}

interface Village {
  id: number;
  name: string;
  characters: Character[];
}

const VillageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [village, setVillage] = useState<Village | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVillage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://narutodb.xyz/api/village/${id}`
      );
      setVillage(response.data);
    } catch (err) {
      console.log(err);
      setError("Erreur lors de la récupération des détails du village.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillage();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!village)
    return <div className="text-center mt-8">Village introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          {village.name}
        </h1>

        <h2 className="text-2xl font-semibold text-orange-400 mb-4">
          Personnages associés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {village.characters.map((character) => (
            <div
              key={character.id}
              className="bg-black bg-opacity-70 rounded-lg shadow-lg p-4 text-white"
            >
              <img
                src={character.images?.[0] || "/placeholder.jpg"}
                alt={character.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-orange-400">
                {character.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VillageDetail;
