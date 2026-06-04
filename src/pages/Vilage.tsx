import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import fallbackImage from "../images/icon.webp";
interface Character {
  id: number;
  name: string;
  images?: string[];
}

interface VillageApi {
  id: number;
  name: string;
  characters: number[];
}

interface VillageView {
  id: number;
  name: string;
  characterIds: number[];
  previewCharacters: Character[];
}

interface VillagesResponse {
  villages: VillageApi[];
  currentPage: number;
  pageSize: number;
  total: number;
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";
const LIMIT = 8;

const Villages: React.FC = () => {
  const [villages, setVillages] = useState<VillageView[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVillages, setTotalVillages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalVillages / LIMIT);

  const fetchCharacterById = async (id: number): Promise<Character | null> => {
    try {
      const response = await axios.get<Character>(
        `${API_BASE_URL}/characters/${id}`
      );

      return response.data;
    } catch (error) {
      console.warn(`Impossible de récupérer le personnage ${id}`, error);
      return null;
    }
  };

  const fetchVillages = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<VillagesResponse>(
        `${API_BASE_URL}/villages`,
        {
          params: {
            page,
            limit: LIMIT,
          },
        }
      );

      const apiVillages = response.data.villages ?? [];

      const enrichedVillages = await Promise.all(
        apiVillages.map(async (village) => {
          const characterIds = village.characters ?? [];

          const previewCharactersResult = await Promise.all(
            characterIds.slice(0, 3).map((id) => fetchCharacterById(id))
          );

          const previewCharacters = previewCharactersResult.filter(
            (character): character is Character => character !== null
          );

          return {
            id: village.id,
            name: village.name,
            characterIds,
            previewCharacters,
          };
        })
      );

      setVillages(enrichedVillages);
      setTotalVillages(response.data.total ?? 0);
    } catch (err) {
      console.error("Erreur villages :", err);
      setError("Erreur lors de la récupération des villages.");
      setVillages([]);
      setTotalVillages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages(currentPage);
  }, [currentPage]);

  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className=" bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">
          Villages Ninja
        </h1>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Rechercher un village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {filteredVillages.length === 0 ? (
          <p className="text-center text-gray-500">Aucun village trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredVillages.map((village) => (
              <Link
                to={`/villages/${village.id}`}
                key={village.id}
                className="block bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="h-full min-h-[300px] p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-orange-400 mb-4">
                      {village.name}
                    </h2>

                    <p className="text-sm text-gray-200 mb-4">
                      {village.characterIds.length > 0
                        ? `${village.characterIds.length} personnages liés`
                        : "Aucun personnage disponible."}
                    </p>

                    {village.previewCharacters.length > 0 && (
                      <div className="space-y-3">
                        {village.previewCharacters.map((character) => (
                          <div
                            key={character.id}
                            className="flex items-center gap-3 rounded-md bg-white bg-opacity-10 p-2"
                          >
                            <img
                              src={character.images?.[0] || fallbackImage}
                              alt={character.name}
                              className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
                            />

                            <p className="text-sm text-white font-medium">
                              {character.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {village.characterIds.length > 3 && (
                    <p className="mt-4 text-sm text-gray-300">
                      ...et {village.characterIds.length - 3} autres personnages
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-orange-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <span className="font-semibold text-lg">
            Page {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded-md bg-orange-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Villages;