import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Character {
  id: number;
  name: string;
  images: string[];
}

interface Clan {
  id: number;
  name: string;
  characters: Character[];
}

const ClanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupère l'ID du clan depuis l'URL
  const [clan, setClan] = useState<Clan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClanDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://narutodb.xyz/api/clan/${id}`
      ); // Assurez-vous que cette API retourne les détails d'un clan
      setClan(response.data);
    } catch (err) {
      console.log(err)
      setError("Erreur lors de la récupération des détails du clan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchClanDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!clan)
    return <div className="text-center mt-8">Clan introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Section d'en-tête */}
      <div className="h-64 bg-contain bg-center bg-no-repeat relative" style={{
        backgroundImage: `url(${clan.characters[0]?.images[0] || "/placeholder.jpg"})`
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-yellow-400">
            {clan.name}
          </h1>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Détails du Clan</h2>

        {/* Section des personnages */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-400 mb-4">
            Membres du Clan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {clan.characters.map((character) => (
              <div
                key={character.id}
                className="bg-black bg-opacity-70 rounded-lg shadow-lg p-4 text-white"
              >
                <img
                  src={character.images[0] || "/placeholder.jpg"}
                  alt={character.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {character.name}
                </h3>
                <p className="text-sm">
                  <span className="font-bold">ID :</span> {character.id}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ajoutez d'autres sections si nécessaire */}
      </div>
    </div>
  );
};

export default ClanDetail;
