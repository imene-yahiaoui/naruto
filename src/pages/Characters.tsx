import React, { useEffect, useState } from "react";
import { fetchCharacters } from "../services/api.ts"; // Importez votre fonction depuis le second code
import type { Character } from "../types/api";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20; // Nombre de personnages par page

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCharacters(page, limit);
        setCharacters(data);
      } catch (err) {
        setError("Erreur lors du chargement des personnages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [page]); // Déclenche la récupération chaque fois que `page` change

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Personnages</h1>

        {loading && <p className="text-center">Chargement...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
              {characters.map((character) => (
                
                <div
                  key={character.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                >
                  <img
                    src={character.images[0] || "/placeholder.jpg"}
                    alt={character.name || "Inconnu"}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">
                    {character.name}
                  </h2>
                  <Button variant="outline" className="w-full">
                      <Link to={`/characters/${character.id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                </div>
             
              ))}
         
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Précédent
          </button>
          <span>Page {page}</span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Characters;
