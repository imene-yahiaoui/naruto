import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface TailedBeast {
  id: number;
  name: string;
  images?: string[];
  debut?: {
    manga?: string;
    anime?: string;
    appearsIn?: string;
    game?: string;
    movie?: string;
    novel?: string;
  };
  family?: {
    creator?: string;
    sibling?: string;
    [key: string]: unknown;
  };
  personal?: {
    species?: string;
    classification?: string;
    jinchūriki?: string[];
    status?: string;
    [key: string]: unknown;
  };
  jutsu?: string[];
  voiceActors?: {
    japanese?: string;
    english?: string;
    [key: string]: unknown;
  };
}

interface TailedBeastsResponse {
  "tailed-beasts": TailedBeast[];
  currentPage: number;
  pageSize: number;
  total: number;
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";
const LIMIT = 8;

const TailedBeasts: React.FC = () => {
  const [tailedBeasts, setTailedBeasts] = useState<TailedBeast[]>([]);
  const [page, setPage] = useState(1);
  const [totalBeasts, setTotalBeasts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalBeasts / LIMIT);

  const fetchTailedBeasts = async (currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<TailedBeastsResponse>(
        `${API_BASE_URL}/tailed-beasts`,
        {
          params: {
            page: currentPage,
            limit: LIMIT,
          },
        }
      );

      console.log("Tailed beasts:", response.data);

      setTailedBeasts(response.data["tailed-beasts"] ?? []);
      setTotalBeasts(response.data.total ?? 0);
    } catch (err) {
      console.error("Erreur Bijuu :", err);
      setError("Erreur lors de la récupération des Bijuus.");
      setTailedBeasts([]);
      setTotalBeasts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTailedBeasts(page);
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className=" bg-[url('/path-to-bijuu-background.jpg')] bg-cover text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">
          Liste des Bijuus
        </h1>

        {tailedBeasts.length === 0 ? (
          <p className="text-center text-gray-500">Aucun Bijuu trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {tailedBeasts.map((beast) => {
              const image = beast.images?.[0] || "/placeholder.jpg";
              const classification =
                beast.personal?.classification || "Aucune classification disponible.";
              const species = beast.personal?.species || "Espèce inconnue";
              const jinchuriki = beast.personal?.jinchūriki;

              return (
                <div
                  key={beast.id}
                  className="bg-black bg-opacity-70 rounded-lg shadow-lg p-4 text-white hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={image}
                    alt={beast.name || "Bijuu inconnu"}
                    className="w-full h-48 object-cover rounded-md mb-4 bg-gray-800"
                  />

                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                    {beast.name}
                  </h2>

                  <p className="text-sm mb-2">
                    <span className="font-bold">Classification :</span>{" "}
                    {classification}
                  </p>

                  <p className="text-sm mb-2">
                    <span className="font-bold">Espèce :</span> {species}
                  </p>

                  <p className="text-sm mb-2">
                    <span className="font-bold">Jinchūriki :</span>{" "}
                    {Array.isArray(jinchuriki) && jinchuriki.length > 0
                      ? jinchuriki.join(", ")
                      : "Inconnu"}
                  </p>

                  <p className="text-sm mb-4">
                    <span className="font-bold">Apparaît dans :</span>{" "}
                    {beast.debut?.appearsIn || "Information indisponible"}
                  </p>

                  <Link
                    to={`/tailed-beasts/${beast.id}`}
                    className="mt-4 inline-block bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-600"
                  >
                    Voir les détails
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || loading}
            className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <span className="font-semibold text-lg">
            Page {page} / {totalPages || 1}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailedBeasts;