import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scroll, Swords, Users, Zap } from "lucide-react";
import Button from "../components/ui/Button";
import type { Character } from "../types/api";
import { fetchCharacters } from "../services/api";

export default function Home() {
  const [featuredCharacters, setFeaturedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCharacters = async () => {
      try {
        const response = await fetchCharacters(6, 8); // Récupère 8 personnages pour la section "À l'honneur"
        if (response) {
          setFeaturedCharacters(response);
          console.log("Personnages à l'honneur :", response);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des personnages :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCharacters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section d'accueil */}
      <div
        className="relative bg-cover bg-center h-[600px]"
        style={{
          backgroundImage: 'url("../images/image.png")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">
                Bienvenue dans NarutoVerse
              </h1>
              <p className="text-xl mb-8">
                Explorez l'univers fascinant de Naruto, des ninjas légendaires
                aux jutsus puissants.
              </p>
              <div className="flex space-x-4">
                <Button size="lg">
                  <Link to="/characters">Explorer les personnages</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/jutsus">Découvrir les Jutsus</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des fonctionnalités */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Personnages",
                description:
                  "Découvrez les ninjas légendaires et leurs histoires.",
              },
              {
                icon: Swords,
                title: "Jutsus",
                description:
                  "Apprenez tout sur les techniques ninja puissantes.",
              },
              {
                icon: Scroll,
                title: "Clans",
                description: "Explorez les grandes familles de ninjas.",
              },
              {
                icon: Zap,
                title: "Bijuus",
                description: "Rencontrez les puissantes bêtes à queues.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section des personnages à l'honneur */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Personnages à l'honneur
          </h2>
          {loading ? (
            <div className="text-center">Chargement...</div>
          ) : featuredCharacters.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-8">
              {/* <p>sadek sofia  sadek2 imene naroto princesse sofia sadek lel</p> */}
              {featuredCharacters.map((character) => (
                <div
                  key={character.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={
                      character.images?.[0] ||
                      "https://via.placeholder.com/300x400"
                    }
                    alt={character.name || "Image du personnage"}
                    className="w-full h-64 object-cover"
                  />
                  <dis className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {character.name || "Personnage inconnu"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {character.personal?.clan
                        ? `Clan ${character.personal.clan}`
                        : "Clan inconnu"}
                    </p>
                    <Button variant="outline" className="w-full">
                      <Link to={`/characters/${character.id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                  </dis>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Aucun personnage disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
