import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import fallbackImage from "../images/fallback-naruto.jpg";
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
  natureType?: string[];
  uniqueTraits?: string[];
  voiceActors?: {
    japanese?: string;
    english?: string;
    [key: string]: unknown;
  };
}

const API_BASE_URL = "https://dattebayo-api.onrender.com";

const TailedBeastDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [beast, setBeast] = useState<TailedBeast | null>(null);
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
    const fetchTailedBeast = async () => {
      if (!id) {
        setError("ID du Bijuu manquant.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<TailedBeast>(
          `${API_BASE_URL}/tailed-beasts/${id}`,
        );

        console.log("Bijuu detail:", response.data);
        setBeast(response.data);
      } catch (err) {
        console.error("Erreur détail Bijuu :", err);
        setError("Erreur lors de la récupération du Bijuu.");
      } finally {
        setLoading(false);
      }
    };

    fetchTailedBeast();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (!beast) {
    return <div className="text-center mt-8">Bijuu introuvable.</div>;
  }

  const image = beast.images?.[0] || fallbackImage;
  const jinchuriki = beast.personal?.jinchūriki ?? [];

  return (
    <div className=" bg-gray-900 text-gray-100">
      <div
        className="h-64 bg-contain bg-center bg-no-repeat relative bg-gray-800"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-yellow-400 text-center px-4">
            {beast.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/tailed-beasts"
          className="inline-block mb-6 text-yellow-400 hover:text-yellow-300"
        >
          ← Retour aux Bijuus
        </Link>

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Détails du Bijuu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Informations personnelles
            </h3>

            {beast.personal && Object.keys(beast.personal).length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {Object.entries(beast.personal).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold capitalize">{key} :</span>{" "}
                    {formatValue(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune information personnelle disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Début
            </h3>

            {beast.debut && Object.keys(beast.debut).length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {Object.entries(beast.debut).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold capitalize">{key} :</span>{" "}
                    {formatValue(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune information de début disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Jutsus
            </h3>

            {beast.jutsu && beast.jutsu.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {beast.jutsu.map((jutsu, index) => (
                  <li key={`${jutsu}-${index}`}>{jutsu}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun jutsu disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Nature Types
            </h3>

            {beast.natureType && beast.natureType.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {beast.natureType.map((nature, index) => (
                  <li key={`${nature}-${index}`}>{nature}</li>
                ))}
              </ul>
            ) : (
              <p>Aucune nature type disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Traits uniques
            </h3>

            {beast.uniqueTraits && beast.uniqueTraits.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {beast.uniqueTraits.map((trait, index) => (
                  <li key={`${trait}-${index}`}>{trait}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun trait unique disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Hôte(s) Jinchūriki
            </h3>

            {jinchuriki.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {jinchuriki.map((name, index) => (
                  <li key={`${name}-${index}`}>{name}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun jinchūriki disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Famille
            </h3>

            {beast.family && Object.keys(beast.family).length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {Object.entries(beast.family).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold capitalize">{key} :</span>{" "}
                    {formatValue(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune information familiale disponible.</p>
            )}
          </section>

          <section className="bg-black bg-opacity-60 rounded-lg p-4">
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Doubleurs
            </h3>

            {beast.voiceActors && Object.keys(beast.voiceActors).length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {Object.entries(beast.voiceActors).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-bold capitalize">{key} :</span>{" "}
                    {formatValue(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune information sur les doubleurs.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default TailedBeastDetail;
