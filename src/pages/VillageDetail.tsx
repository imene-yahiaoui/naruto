import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

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
  characters: Character[];
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";

const VillageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [village, setVillage] = useState<VillageView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacterById = async (
    characterId: number
  ): Promise<Character | null> => {
    try {
      const response = await axios.get<Character>(
        `${API_BASE_URL}/characters/${characterId}`
      );

      return response.data;
    } catch (error) {
      console.warn(
        `Impossible de récupérer le personnage ${characterId}`,
        error
      );
      return null;
    }
  };

  const fetchVillage = async () => {
    if (!id) {
      setError("ID du village manquant.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<VillageApi>(
        `${API_BASE_URL}/villages/${id}`
      );

      const villageData = response.data;
      const characterIds = villageData.characters ?? [];

      const charactersResult = await Promise.all(
        characterIds.map((characterId) => fetchCharacterById(characterId))
      );

      const characters = charactersResult.filter(
        (character): character is Character => character !== null
      );

      setVillage({
        id: villageData.id,
        name: villageData.name,
        characterIds,
        characters,
      });
    } catch (err) {
      console.error("Erreur détail village :", err);
      setError("Erreur lors de la récupération des détails du village.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillage();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (!village) {
    return <div className="text-center mt-8">Village introuvable.</div>;
  }

  return (
    <div className=" bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/villages"
          className="inline-block mb-6 text-orange-400 hover:text-orange-300"
        >
          ← Retour aux villages
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">
            {village.name}
          </h1>

          <p className="text-gray-300">
            {village.characterIds.length > 0
              ? `${village.characterIds.length} personnages associés`
              : "Aucun personnage associé à ce village."}
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-orange-400 mb-6">
          Personnages associés
        </h2>

        {village.characters.length === 0 ? (
          <p className="text-gray-300">
            Aucun personnage disponible pour ce village.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {village.characters.map((character) => (
              <Link
                to={`/characters/${character.id}`}
                key={character.id}
                className="bg-black bg-opacity-70 rounded-lg shadow-lg p-4 text-white hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={character.images?.[0] || "/placeholder.jpg"}
                  alt={character.name}
                  className="w-full h-48 object-cover rounded-md mb-4 bg-gray-800"
                />

                <h3 className="text-xl font-bold text-orange-400">
                  {character.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageDetail;