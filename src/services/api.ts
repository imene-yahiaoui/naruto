import axios from "axios";
import type { Character, Clan, TailedBeast } from "../types/api";

const API_BASE_URL = "https://dattebayo-api.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

type CharactersResponse = {
  characters: Character[];
};

type ClansResponse = {
  clans: Clan[];
};

type TailedBeastsResponse = {
  tailedBeasts: TailedBeast[];
};

type Village = {
  id: number;
  name: string;
  characters?: Character[];
};

type VillagesResponse = {
  villages: Village[];
};

export const fetchCharacters = async (
  page: number,
  limit: number
): Promise<Character[]> => {
  try {
    const response = await api.get<CharactersResponse>("/characters", {
      params: { page, limit },
    });

    console.log(response.data.characters);
    return response.data.characters ?? [];
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    return [];
  }
};

export const fetchCharacterById = async (
  id: string
): Promise<Character | null> => {
  try {
    const response = await api.get<Character>(`/characters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur personnage ID ${id}:`, error);
    return null;
  }
};

export const getVillages = async (
  page = 1,
  limit = 20
): Promise<Village[]> => {
  try {
    const response = await api.get<VillagesResponse>("/villages", {
      params: { page, limit },
    });

    return response.data.villages ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des villages :", error);
    return [];
  }
};

export const getClans = async (): Promise<Clan[]> => {
  try {
    const response = await api.get<ClansResponse>("/clans");
    return response.data.clans ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des clans :", error);
    return [];
  }
};

export const getTailedBeasts = async (): Promise<TailedBeast[]> => {
  try {
    const response = await api.get<TailedBeastsResponse>("/tailed-beasts");
    return response.data.tailedBeasts ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des Bijuu :", error);
    return [];
  }
};