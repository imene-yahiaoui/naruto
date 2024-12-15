import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import pour la navigation
import { getClans } from "../services/api";
import type { Clan } from "../types/api";

const Clans: React.FC = () => {
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClans = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClans();
        setClans(data);
      } catch (err) {
        setError("Erreur lors de la récupération des clans.");
      } finally {
        setLoading(false);
      }
    };

    fetchClans();
  }, []);

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[url('/path-to-clan-background.jpg')] bg-cover text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">
          Liste des Clans
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clans.map((clan) => (
            <Link
              to={`/clans/${clan.id}`}
              key={clan.id}
              className="block bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition"
            >
              {/* Arrière-plan dynamique basé sur le premier personnage */}
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    clan.characters[0]?.images?.[0] || "/placeholder.jpg"
                  })`,
                }}
              ></div>

              <div className="p-4 text-white">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                  {clan.name}
                </h2>

                {/* Liste des personnages */}
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {clan.characters.slice(0, 3).map((character) => (
                    <div
                      key={character.id}
                      className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden"
                    >
                      <img
                        src={character.images?.[0] || "/placeholder.jpg"}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {clan.characters.length > 3 && (
                  <p className="mt-2 text-sm text-gray-400">
                    ...et {clan.characters.length - 3} autres personnages
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

export default Clans;
