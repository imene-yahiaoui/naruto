import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import fallbackImage from "../images/fallback-naruto.jpg";
interface Character {
  id: number;
  name: string;
  images?: string[];
}

interface ClanApi {
  id: number;
  name: string;
  characters: number[];
}

interface ClanView {
  id: number;
  name: string;
  characterIds: number[];
  previewCharacters: Character[];
}

interface ClansResponse {
  clans: ClanApi[];
  currentPage?: number;
  pageSize?: number;
  total?: number;
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";
const LIMIT = 8;

const Clans: React.FC = () => {
  const [clans, setClans] = useState<ClanView[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClans, setTotalClans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalClans / LIMIT);

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

  const fetchClans = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ClansResponse>(
        `${API_BASE_URL}/clans`,
        {
          params: {
            page,
            limit: LIMIT,
          },
        }
      );

      const apiClans = response.data.clans ?? [];

      const enrichedClans = await Promise.all(
        apiClans.map(async (clan) => {
          const characterIds = clan.characters ?? [];

          const previewCharactersResult = await Promise.all(
            characterIds.slice(0, 3).map((id) => fetchCharacterById(id))
          );

          const previewCharacters = previewCharactersResult.filter(
            (character): character is Character => character !== null
          );

          return {
            id: clan.id,
            name: clan.name,
            characterIds,
            previewCharacters,
          };
        })
      );

      setClans(enrichedClans);
      setTotalClans(response.data.total ?? apiClans.length);
    } catch (err) {
      console.error("Erreur clans :", err);
      setError("Erreur lors de la récupération des clans.");
      setClans([]);
      setTotalClans(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClans(currentPage);
  }, [currentPage]);

  const filteredClans = clans.filter((clan) =>
    clan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (totalPages === 0 || currentPage < totalPages) {
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
    <div className=" bg-[url('/path-to-clan-background.jpg')] bg-cover text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">
          Liste des Clans
        </h1>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Rechercher un clan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {filteredClans.length === 0 ? (
          <p className="text-center text-gray-500">Aucun clan trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredClans.map((clan) => {
              const firstImage =
                clan.previewCharacters[0]?.images?.[0] || fallbackImage;

              return (
                <Link
                  to={`/clans/${clan.id}`}
                  key={clan.id}
                  className="block bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition"
                >
                  <div
                    className="h-40 bg-cover bg-center bg-gray-800"
                    style={{
                      backgroundImage: `url(${firstImage})`,
                    }}
                  />

                  <div className="p-4 text-white">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                      {clan.name}
                    </h2>

                    <p className="text-sm text-gray-300 mb-4">
                      {clan.characterIds.length > 0
                        ? `${clan.characterIds.length} personnages liés`
                        : "Aucun personnage disponible."}
                    </p>

                    {clan.previewCharacters.length > 0 && (
                      <div className="flex space-x-4 overflow-x-auto pb-2">
                        {clan.previewCharacters.map((character) => (
                          <div
                            key={character.id}
                            className="flex-shrink-0 w-16"
                          >
                            <div className="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden bg-gray-800">
                              <img
                                src={
                                  character.images?.[0] || fallbackImage
                                }
                                alt={character.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <p className="text-xs text-center mt-2 text-gray-300 truncate">
                              {character.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {clan.characterIds.length > 3 && (
                      <p className="mt-2 text-sm text-gray-400">
                        ...et {clan.characterIds.length - 3} autres personnages
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <span className="font-semibold text-lg">
            Page {currentPage}
            {totalPages > 0 ? ` / ${totalPages}` : ""}
          </span>

          <button
            onClick={handleNextPage}
            disabled={totalPages > 0 && currentPage >= totalPages}
            className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clans;