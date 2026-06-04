import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

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
  characters: Character[];
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";

const ClanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [clan, setClan] = useState<ClanView | null>(null);
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
      console.warn(`Impossible de récupérer le personnage ${characterId}`, error);
      return null;
    }
  };

  const fetchClanDetails = async () => {
    if (!id) {
      setError("ID du clan manquant.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ClanApi>(
        `${API_BASE_URL}/clans/${id}`
      );

      const clanData = response.data;
      const characterIds = clanData.characters ?? [];

      const charactersResult = await Promise.all(
        characterIds.map((characterId) => fetchCharacterById(characterId))
      );

      const characters = charactersResult.filter(
        (character): character is Character => character !== null
      );

      setClan({
        id: clanData.id,
        name: clanData.name,
        characterIds,
        characters,
      });
    } catch (err) {
      console.error("Erreur détail clan :", err);
      setError("Erreur lors de la récupération des détails du clan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClanDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!clan) {
    return <div className="text-center mt-8">Clan introuvable.</div>;
  }

  const headerImage = clan.characters[0]?.images?.[0] || "/placeholder.jpg";

  return (
    <div className=" bg-gray-900 text-gray-100">
      <div
        className="h-64 bg-contain bg-center bg-no-repeat relative bg-gray-800"
        style={{
          backgroundImage: `url(${headerImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-yellow-400 text-center px-4">
            {clan.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/clans"
          className="inline-block mb-6 text-yellow-400 hover:text-yellow-300"
        >
          ← Retour aux clans
        </Link>

        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Détails du Clan
        </h2>

        <p className="text-gray-300 mb-8">
          {clan.characterIds.length > 0
            ? `${clan.characterIds.length} membres associés`
            : "Aucun membre associé à ce clan."}
        </p>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-400 mb-4">
            Membres du Clan
          </h3>

          {clan.characters.length === 0 ? (
            <p className="text-gray-300">
              Aucun personnage disponible pour ce clan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clan.characters.map((character) => (
                <Link
                  to={`/characters/${character.id}`}
                  key={character.id}
                  className="bg-black bg-opacity-70 rounded-lg shadow-lg p-4 text-white hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={character.images?.[0] || "/placeholder.jpg"}
                    alt={character.name}
                    className="w-full h-40 object-cover rounded-md mb-4 bg-gray-800"
                  />

                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    {character.name}
                  </h3>

                  <p className="text-sm">
                    <span className="font-bold">ID :</span> {character.id}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClanDetail;