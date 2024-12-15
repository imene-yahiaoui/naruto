import axios from "axios";
import type { Character, Jutsu, Clan, TailedBeast } from "../types/api";

// Base URL pour l'API NarutoDB
const API_BASE_URL = "https://narutodb.xyz/api";

// Configuration de l'instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Timeout pour éviter les blocages
});

// Récupérer une liste de personnages avec pagination
export const fetchCharacters = async (
  page: number,
  limit: number
): Promise<Character[]> => {
  try {
    const response = await axios.get<{ characters: Character[] }>(
      `${API_BASE_URL}/character`,
      { params: { page, limit } }
    );
    return response.data.characters || []; // Return an empty array if undefined
    console.log(response.data.characters);
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    throw error;
  }
};

// Récupérer un personnage par ID
export const fetchCharacterById = async (id: string): Promise<Character> => {
  try {
    const response = await api.get<Character>(`/character/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du personnage avec l'ID ${id}:`,
      error
    );
    throw error;
  }
};

// Récupérer une liste de jutsus avec pagination
export const getVillage = async (page = 1, limit = 20): Promise<Jutsu[]> => {
  try {
    const response = await api.get<{ jutsu: Jutsu[] }>(
      `/village?page=${page}&limit=${limit}`
    );
    return response.data.jutsu;
  } catch (error) {
    console.error("Erreur lors de la récupération des jutsus :", error);
    throw error;
  }
};

// Récupérer tous les clans
export const getClans = async (): Promise<Clan[]> => {
  try {
    const response = await api.get<{ clans: Clan[] }>("/clan");
    return response.data.clans;
  } catch (error) {
    console.error("Erreur lors de la récupération des clans :", error);
    throw error;
  }
};

// Récupérer tous les Bijuu (Tailed Beasts)
export const getTailedBeasts = async (): Promise<TailedBeast[]> => {
  try {
    const response = await api.get<{ tailedBeasts: TailedBeast[] }>(
      "/tailed-beast"
    );
    return response.data.tailedBeasts;
  } catch (error) {
    console.error("Erreur lors de la récupération des Bijuu :", error);
    throw error;
  }
};
