import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTailedBeasts } from "../services/api";
import type { TailedBeast } from "../types/api";

const TailedBeastDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [beast, setBeast] = useState<TailedBeast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTailedBeast = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTailedBeasts();
        const selectedBeast = data.find(
          (item) => item.id === parseInt(id || "0")
        );
        if (!selectedBeast) throw new Error("Bijuu introuvable.");
        setBeast(selectedBeast);
      } catch (err) {
        console.log(err);
        setError("Erreur lors de la récupération du Bijuu.");
      } finally {
        setLoading(false);
      }
    };

    fetchTailedBeast();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!beast) return <div className="text-center mt-8">Bijuu introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${beast.images[0] || "/placeholder.jpg"})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-yellow-400">{beast.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Détails du Bijuu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Jutsus
            </h3>
            <ul className="list-disc list-inside">
              {beast.jutsu.map((jutsu, index) => (
                <li key={index}>{jutsu}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Nature Types
            </h3>
            <ul className="list-disc list-inside">
              {beast.natureType?.map((nature, index) => (
                <li key={index}>{nature}</li>
              )) || <p>Aucune nature type disponible.</p>}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Traits Uniques
            </h3>
            <ul className="list-disc list-inside">
              {beast.uniqueTraits?.map((trait, index) => (
                <li key={index}>{trait}</li>
              )) || <p>Aucun trait unique disponible.</p>}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">
              Hôte(s) (Jinchūriki)
            </h3>
            <ul className="list-disc list-inside">
              {beast.personal?.jinchūriki?.map((jinchuriki, index) => (
                <li key={index}>{jinchuriki}</li>
              )) || <p>Aucun jinchūriki disponible.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailedBeastDetail;
