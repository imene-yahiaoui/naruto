import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";

interface Character {
  id: number;
  name: string;
  images?: string[];
}

interface CharactersResponse {
  characters: Character[];
  currentPage: number;
  pageSize: number;
  total: number;
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";
const LIMIT = 12;

const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCharacters, setTotalCharacters] = useState(0);

  const totalPages = Math.ceil(totalCharacters / LIMIT);

  const fetchCharacters = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CharactersResponse>(
        `${API_BASE_URL}/characters`,
        {
          params: {
            page,
            limit: LIMIT,
          },
        },
      );

      setCharacters(response.data.characters ?? []);
      setTotalCharacters(response.data.total ?? 0);
    } catch (err) {
      console.error("Erreur personnages :", err);
      setError("Erreur lors du chargement des personnages");
      setCharacters([]);
      setTotalCharacters(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Personnages</h1>

        {loading && <p className="text-center">Chargement...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && characters.length === 0 && (
          <p className="text-center text-gray-500">Aucun personnage trouvé.</p>
        )}

        {!loading && !error && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={character.images?.[0] || "/placeholder.jpg"}
                  alt={character.name || "Personnage inconnu"}
                  className="w-full h-40 object-cover rounded-md mb-4 bg-gray-200 dark:bg-gray-700"
                />

                <h2 className="text-xl font-semibold mb-4">{character.name}</h2>

                <Button variant="outline" className="w-full">
                  <Link to={`/characters/${character.id}`}>
                    Voir les détails
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <span className="font-semibold">
            Page {page} / {totalPages || 1}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Characters;
