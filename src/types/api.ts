export interface Character {
  id: string;
  name: string;
  images: string[];
  jutsu: string[];
  personal: {
    birthdate: string;
    sex: string;
    status: string;
    clan: string;
    affiliation: string;
  };
  rank: {
    ninjaRank: string;
    ninjaRegistration: string;
  };
  debut: {
    manga: string;
    anime: string;
  };
}

export interface Jutsu {
  id: string;
  name: string;
  description: string;
  type: string;
  rank: string;
  images: string[];
}

export interface Clan {
  id: string;
  name: string;
  description: string;
  members: string[];
  kekkeiGenkai: string[];
}

export interface TailedBeast {
  id: string;
  name: string;
  description: string;
  jinchuriki: string[];
  images: string[];
}