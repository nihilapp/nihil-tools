export interface MonsterOriginData {
  id: string;
  label: string;
  weight: number;
}

export interface MonsterMajorTypeData {
  id: string;
  label: string;
  weight: number;
}

export interface MonsterSubtypeData {
  id: string;
  label: string;
  majorTypeId: string;
  weight: number;
}

export interface MonsterOptionData {
  id: string;
  label: string;
  weight: number;
}
