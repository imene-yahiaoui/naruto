import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTailedBeasts } from "../services/api";
import type { TailedBeast } from "../types/api";

const TailedBeasts: React.FC = () => {
  const [tailedBeasts, setTailedBeasts] = useState<TailedBeast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTailedBeasts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTailedBeasts();
        setTailedBeasts(data);
      } catch (err) {
        console.log(err)
        setError("Erreur lors de la récupération des Bijuus.");
      } finally {
        setLoading(false);
      }
    };

    fetchTailedBeasts();
  }, []);

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[url('/path-to-bijuu-background.jpg')] bg-cover text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">Liste des Bijuus</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tailedBeasts.map((beast) => (
            <div
              key={beast.id}
              className="bg-black bg-opacity-70 rounded-lg shadow-lg p-4 text-white"
            >
              <img
                src={beast.images[0] || "/placeholder.jpg"}
                alt={beast.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">{beast.name}</h2>
              <p>{beast.personal?.classification || "Aucune classification disponible."}</p>
              <p className="mt-2">
                <span className="font-bold">Statut :</span> {beast.personal?.status || "Inconnu"}
              </p>
              <Link
                to={`/tailed-beasts/${beast.id}`}
                className="mt-4 inline-block bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-600"
              >
                Voir les détails
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TailedBeasts;
