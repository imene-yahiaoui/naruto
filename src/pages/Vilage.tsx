import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import de Link pour la navigation
import axios from "axios";

interface Village {
  id: number;
  name: string;
  characters: {
    id: number;
    name: string;
    images: string[];
  }[];
}

const Villages: React.FC = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVillages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://narutodb.xyz/api/village?page=1&limit=12"
      );
      setVillages(response.data.villages);
    } catch (err) {
      setError("Erreur lors de la récupération des villages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[url('/path-to-naruto-background.jpg')] bg-cover text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">
          Villages Ninja
        </h1>

        {/* Barre de recherche */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Rechercher un village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Liste des villages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVillages.map((village) => (
            <Link
              to={`/villages/${village.id}`}
              key={village.id}
              className="block bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden"
            >
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${village.characters[0]?.images?.[0] || "/placeholder.jpg"})`,
                }}
              ></div>
              <div className="p-4">
                <h2 className="text-2xl font-bold text-orange-400 mb-4">
                  {village.name}
                </h2>

                {/* Liste des personnages */}
                <div className="space-y-4">
                  {village.characters.slice(0, 3).map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={character.images?.[0] || "/placeholder.jpg"}
                        alt={character.name}
                        className="w-16 h-16 rounded-full border-2 border-orange-500"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {character.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {village.characters.length > 3 && (
                  <p className="mt-4 text-sm text-gray-300">
                    ...et {village.characters.length - 3} autres personnages
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Villages;
