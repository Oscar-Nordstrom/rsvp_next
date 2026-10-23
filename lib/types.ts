export const ALLERGY_OTHER_TAG = "Annat" as const;
export const ALLERGY_TAGS = [
  "Nöt",
  "Laktos",
  "Gluten",
  "Skaldjur",
  "Vegeterian",
  "Vegan",
  ALLERGY_OTHER_TAG,
] as const;


export type AllergyTag = (typeof ALLERGY_TAGS)[number];

export interface Guest {
  id: string;
  name: string;
  attending: boolean | null;
  allergy_tags: AllergyTag[];
  allergy_note: string | null;
}

export interface Party {
  id: string;
  token: string;
  note: string | null;
  transport: boolean | null;
  responded_at: string | null;
  guests: Guest[];
}
