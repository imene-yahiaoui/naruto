import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCharacterById } from "../services/api"; // Fonction pour récupérer un personnage par ID
import type { Character } from "../types/api";

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupère l'ID à partir des paramètres d'URL
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchCharacterById(id);
        setCharacter(data);
        console.log("data", data);
      } catch (err) {
        setError("Erreur lors de la récupération des détails du personnage.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!character)
    return <div className="text-center mt-8">Personnage introuvable.</div>;

  return (
    <div className="min-h-screen bg-[url('/path-to-naruto-background.jpg')] bg-cover text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden text-white">
          <img
            src={character.images?.[0] || "/placeholder.jpg"}
            alt={character.name}
            className="w-full h-80 object-contain border-b-4 border-yellow-400"
          />
          <div className="p-6">
            <h1 className="text-5xl font-bold mb-4 text-center text-yellow-400">
              {character.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Début</h2>
                <ul className="list-disc list-inside">
                  {Object.entries(character.debut || {}).map(([key, value]) => (
                    <li key={key} className="mb-2">
                      <span className="font-bold capitalize text-white">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Famille</h2>
                {character.family ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(character.family).map(([relation, name]) => (
                      <li key={relation} className="mb-2">
                        <span className="font-bold capitalize text-white">{relation}:</span> {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucune information sur la famille.</p>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Détails personnels</h2>
                <ul className="list-disc list-inside">
                  {Object.entries(character.personal || {}).map(([key, value]) => (
                    <li key={key} className="mb-2">
                      <span className="font-bold capitalize text-white">{key}:</span> {typeof value === "string" ? value : JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Jutsus</h2>
                {character.jutsu && character.jutsu.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {character.jutsu.map((jutsu, index) => (
                      <li key={index} className="mb-2">{jutsu}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucun jutsu trouvé.</p>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Types de nature</h2>
                {character.natureType && character.natureType.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {character.natureType.map((nature, index) => (
                      <li key={index} className="mb-2">{nature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucun type de nature trouvé.</p>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Traits uniques</h2>
                {character.uniqueTraits && character.uniqueTraits.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {character.uniqueTraits.map((trait, index) => (
                      <li key={index} className="mb-2">{trait}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucun trait unique trouvé.</p>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Doubleurs</h2>
                {character.voiceActors ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(character.voiceActors).map(
                      ([language, actor]) => (
                        <li key={language} className="mb-2">
                          <span className="font-bold text-white">{language}:</span> {actor}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-white">Aucune information sur les doubleurs.</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Outils</h2>
              {character.tools && character.tools.length > 0 ? (
                <ul className="list-disc list-inside">
                  {character.tools.map((tool, index) => (
                    <li key={index} className="mb-2">{tool}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">Aucun outil trouvé.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
