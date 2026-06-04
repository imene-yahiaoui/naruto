import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCharacterById } from "../services/api";
import type { Character } from "../types/api";

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${String(val)}`)
        .join(", ");
    }

    return String(value);
  };

  useEffect(() => {
    const loadCharacter = async () => {
      if (!id) {
        setError("ID du personnage manquant.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchCharacterById(id);
        setCharacter(data);
        console.log("Character detail:", data);
      } catch (err) {
        console.error("Erreur personnage :", err);
        setError("Erreur lors de la récupération des détails du personnage.");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!character) {
    return <div className="text-center mt-8">Personnage introuvable.</div>;
  }

  return (
    <div className=" bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/characters"
          className="inline-block mb-6 text-yellow-400 hover:text-yellow-300"
        >
          ← Retour aux personnages
        </Link>

        <div className="bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden text-white">
          <img
            src={character.images?.[0] || "/placeholder.jpg"}
            alt={character.name || "Personnage inconnu"}
            className="w-full h-80 object-contain border-b-4 border-yellow-400 bg-gray-800"
          />

          <div className="p-6">
            <h1 className="text-5xl font-bold mb-4 text-center text-yellow-400">
              {character.name}
            </h1>

            <p className="text-center text-gray-300 mb-8">
              ID : {character.id}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Début
                </h2>

                {character.debut && Object.keys(character.debut).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(character.debut).map(([key, value]) => (
                      <li key={key} className="mb-2">
                        <span className="font-bold capitalize text-white">
                          {key} :
                        </span>{" "}
                        {formatValue(value)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucune information disponible.</p>
                )}
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Famille
                </h2>

                {character.family && Object.keys(character.family).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(character.family).map(([relation, name]) => (
                      <li key={relation} className="mb-2">
                        <span className="font-bold capitalize text-white">
                          {relation} :
                        </span>{" "}
                        {formatValue(name)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">
                    Aucune information sur la famille.
                  </p>
                )}
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Détails personnels
                </h2>

                {character.personal &&
                Object.keys(character.personal).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(character.personal).map(([key, value]) => (
                      <li key={key} className="mb-2">
                        <span className="font-bold capitalize text-white">
                          {key} :
                        </span>{" "}
                        {formatValue(value)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">
                    Aucun détail personnel disponible.
                  </p>
                )}
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Jutsus
                </h2>

                {character.jutsu && character.jutsu.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {character.jutsu.map((jutsu, index) => (
                      <li key={`${jutsu}-${index}`} className="mb-2">
                        {jutsu}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucun jutsu trouvé.</p>
                )}
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Types de nature
                </h2>

                {character.natureType && character.natureType.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {character.natureType.map((nature, index) => (
                      <li key={`${nature}-${index}`} className="mb-2">
                        {nature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucun type de nature trouvé.</p>
                )}
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Traits uniques
                </h2>

                {character.uniqueTraits &&
                character.uniqueTraits.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {character.uniqueTraits.map((trait, index) => (
                      <li key={`${trait}-${index}`} className="mb-2">
                        {trait}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white">Aucun trait unique trouvé.</p>
                )}
              </section>

              <section>
                <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                  Doubleurs
                </h2>

                {character.voiceActors &&
                Object.keys(character.voiceActors).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(character.voiceActors).map(
                      ([language, actor]) => (
                        <li key={language} className="mb-2">
                          <span className="font-bold text-white">
                            {language} :
                          </span>{" "}
                          {formatValue(actor)}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-white">
                    Aucune information sur les doubleurs.
                  </p>
                )}
              </section>
            </div>

            <section className="mt-8">
              <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
                Outils
              </h2>

              {character.tools && character.tools.length > 0 ? (
                <ul className="list-disc list-inside">
                  {character.tools.map((tool, index) => (
                    <li key={`${tool}-${index}`} className="mb-2">
                      {tool}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">Aucun outil trouvé.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;