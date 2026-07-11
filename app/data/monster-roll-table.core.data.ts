import type { MonsterMajorTypeData, MonsterOptionData, MonsterOriginData } from '~/data/monster-roll-table.types';

export const monsterOriginData: MonsterOriginData[] = [
  {
    'id':'field',
    'label':'필드',
    'weight':8,
  },
  {
    'id':'settlement_edge',
    'label':'생활권 인접',
    'weight':6,
  },
  {
    'id':'ruin',
    'label':'폐허·유적',
    'weight':7,
  },
  {
    'id':'dungeon_inner',
    'label':'던전 내부',
    'weight':7,
  },
  {
    'id':'dungeon_guardian',
    'label':'던전 가디언',
    'weight':2,
  },
  {
    'id':'living_dungeon',
    'label':'살아있는 던전',
    'weight':1,
  },
  {
    'id':'angra_fog',
    'label':'앙그라 안개권',
    'weight':3,
  },
  {
    'id':'totem_nail',
    'label':'앙그라의 못',
    'weight':1,
  },
  {
    'id':'totem_guardian',
    'label':'토템 가디언',
    'weight':1,
  },
  {
    'id':'resonance_zone',
    'label':'잔향 지역',
    'weight':3,
  },
  {
    'id':'blackstone_site',
    'label':'흑마석 지점',
    'weight':2,
  },
  {
    'id':'refinery',
    'label':'정제 시설',
    'weight':2,
  },
  {
    'id':'portal_space',
    'label':'포탈·공간 왜곡',
    'weight':3,
  },
  {
    'id':'cult_site',
    'label':'금기 의식지',
    'weight':3,
  },
  {
    'id':'conflict_zone',
    'label':'분쟁지',
    'weight':4,
  },
];

export const monsterMajorTypeData: MonsterMajorTypeData[] = [
  {
    'id':'aberration',
    'label':'변이체',
    'weight':7,
  },
  {
    'id':'beast',
    'label':'야수',
    'weight':15,
  },
  {
    'id':'celestial',
    'label':'천상체',
    'weight':5,
  },
  {
    'id':'construct',
    'label':'구조체',
    'weight':8,
  },
  {
    'id':'dragon',
    'label':'드래곤',
    'weight':6,
  },
  {
    'id':'elemental',
    'label':'원소체',
    'weight':7,
  },
  {
    'id':'fey',
    'label':'요정',
    'weight':7,
  },
  {
    'id':'fiend',
    'label':'악마체',
    'weight':8,
  },
  {
    'id':'giant',
    'label':'거인',
    'weight':6,
  },
  {
    'id':'humanoid',
    'label':'인간형',
    'weight':9,
  },
  {
    'id':'monstrosity',
    'label':'괴수',
    'weight':8,
  },
  {
    'id':'ooze',
    'label':'점액체',
    'weight':4,
  },
  {
    'id':'plant',
    'label':'식물체',
    'weight':4,
  },
  {
    'id':'undead',
    'label':'언데드',
    'weight':6,
  },
];

export const monsterSizeData: MonsterOptionData[] = [
  {
    'id':'tiny',
    'label':'초소형',
    'weight':5,
  },
  {
    'id':'small',
    'label':'소형',
    'weight':15,
  },
  {
    'id':'medium',
    'label':'중형',
    'weight':35,
  },
  {
    'id':'large',
    'label':'대형',
    'weight':25,
  },
  {
    'id':'huge',
    'label':'거대형',
    'weight':15,
  },
  {
    'id':'gargantuan',
    'label':'초거대형',
    'weight':5,
  },
];

export const monsterGroupStructureData: MonsterOptionData[] = [
  {
    'id':'solitary_individual',
    'label':'단독 개체',
    'weight':20,
  },
  {
    'id':'pair_individual',
    'label':'한 쌍',
    'weight':7,
  },
  {
    'id':'small_pack',
    'label':'소규모 무리',
    'weight':14,
  },
  {
    'id':'small_pack_leader',
    'label':'소규모 무리의 우두머리',
    'weight':8,
  },
  {
    'id':'large_pack',
    'label':'대규모 무리',
    'weight':7,
  },
  {
    'id':'large_pack_alpha',
    'label':'대규모 무리의 알파 개체',
    'weight':5,
  },
  {
    'id':'swarm',
    'label':'군집',
    'weight':5,
  },
  {
    'id':'nest',
    'label':'둥지 집단',
    'weight':5,
  },
  {
    'id':'nest_leader',
    'label':'둥지의 우두머리',
    'weight':4,
  },
  {
    'id':'colony',
    'label':'군락',
    'weight':4,
  },
  {
    'id':'hierarchy',
    'label':'위계 집단',
    'weight':4,
  },
  {
    'id':'hierarchy_leader',
    'label':'위계 집단의 지휘자',
    'weight':4,
  },
  {
    'id':'cultic',
    'label':'의식 집단',
    'weight':3,
  },
  {
    'id':'cultic_leader',
    'label':'의식 집단의 지도자',
    'weight':3,
  },
  {
    'id':'controlled',
    'label':'피지배 집단',
    'weight':3,
  },
  {
    'id':'hive_mind',
    'label':'군체 의식',
    'weight':3,
  },
  {
    'id':'temporary_gathering',
    'label':'임시 집결',
    'weight':3,
  },
  {
    'id':'territory_alpha',
    'label':'영역의 알파 개체',
    'weight':3,
  },
  {
    'id':'regional_lord',
    'label':'지역 군주',
    'weight':2,
  },
  {
    'id':'guardian_class',
    'label':'가디언급 위협',
    'weight':1,
  },
  {
    'id':'raid_guardian',
    'label':'레이드급 수호자',
    'weight':1,
  },
];

export const monsterBehaviorData: MonsterOptionData[] = [
  {
    'id':'predatory',
    'label':'포식형',
    'weight':8,
  },
  {
    'id':'territorial',
    'label':'영역형',
    'weight':8,
  },
  {
    'id':'ambush',
    'label':'매복형',
    'weight':8,
  },
  {
    'id':'pursuit',
    'label':'추격형',
    'weight':6,
  },
  {
    'id':'scavenger',
    'label':'청소부형',
    'weight':4,
  },
  {
    'id':'guardian',
    'label':'수호형',
    'weight':6,
  },
  {
    'id':'nesting',
    'label':'둥지형',
    'weight':4,
  },
  {
    'id':'swarming',
    'label':'군집형',
    'weight':4,
  },
  {
    'id':'luring',
    'label':'유인형',
    'weight':4,
  },
  {
    'id':'migratory',
    'label':'이동형',
    'weight':3,
  },
  {
    'id':'ritualistic',
    'label':'의식형',
    'weight':3,
  },
  {
    'id':'commanded',
    'label':'명령형',
    'weight':4,
  },
  {
    'id':'frenzied',
    'label':'광폭형',
    'weight':4,
  },
  {
    'id':'curious',
    'label':'탐색형',
    'weight':3,
  },
  {
    'id':'avoidant',
    'label':'회피형',
    'weight':3,
  },
  {
    'id':'mimicry',
    'label':'모방형',
    'weight':3,
  },
  {
    'id':'parasitic',
    'label':'기생형',
    'weight':3,
  },
  {
    'id':'resource_drawn',
    'label':'자원 반응형',
    'weight':2,
  },
];

export const monsterCombatStyleData: MonsterOptionData[] = [
  {
    'id':'melee_acid',
    'label':'근거리 · 산성',
    'weight':3,
  },
  {
    'id':'melee_bludgeoning',
    'label':'근거리 · 타격',
    'weight':3,
  },
  {
    'id':'melee_cold',
    'label':'근거리 · 냉기',
    'weight':3,
  },
  {
    'id':'melee_fire',
    'label':'근거리 · 화염',
    'weight':3,
  },
  {
    'id':'melee_force',
    'label':'근거리 · 역장',
    'weight':3,
  },
  {
    'id':'melee_lightning',
    'label':'근거리 · 번개',
    'weight':3,
  },
  {
    'id':'melee_necrotic',
    'label':'근거리 · 사령',
    'weight':3,
  },
  {
    'id':'melee_piercing',
    'label':'근거리 · 관통',
    'weight':3,
  },
  {
    'id':'melee_poison',
    'label':'근거리 · 독성',
    'weight':3,
  },
  {
    'id':'melee_psychic',
    'label':'근거리 · 정신',
    'weight':3,
  },
  {
    'id':'melee_radiant',
    'label':'근거리 · 광휘',
    'weight':3,
  },
  {
    'id':'melee_slashing',
    'label':'근거리 · 참격',
    'weight':3,
  },
  {
    'id':'melee_thunder',
    'label':'근거리 · 천둥',
    'weight':3,
  },
  {
    'id':'ranged_acid',
    'label':'원거리 · 산성',
    'weight':2,
  },
  {
    'id':'ranged_bludgeoning',
    'label':'원거리 · 타격',
    'weight':2,
  },
  {
    'id':'ranged_cold',
    'label':'원거리 · 냉기',
    'weight':2,
  },
  {
    'id':'ranged_fire',
    'label':'원거리 · 화염',
    'weight':2,
  },
  {
    'id':'ranged_force',
    'label':'원거리 · 역장',
    'weight':2,
  },
  {
    'id':'ranged_lightning',
    'label':'원거리 · 번개',
    'weight':2,
  },
  {
    'id':'ranged_necrotic',
    'label':'원거리 · 사령',
    'weight':2,
  },
  {
    'id':'ranged_piercing',
    'label':'원거리 · 관통',
    'weight':2,
  },
  {
    'id':'ranged_poison',
    'label':'원거리 · 독성',
    'weight':2,
  },
  {
    'id':'ranged_psychic',
    'label':'원거리 · 정신',
    'weight':2,
  },
  {
    'id':'ranged_radiant',
    'label':'원거리 · 광휘',
    'weight':2,
  },
  {
    'id':'ranged_slashing',
    'label':'원거리 · 참격',
    'weight':2,
  },
  {
    'id':'ranged_thunder',
    'label':'원거리 · 천둥',
    'weight':2,
  },
  {
    'id':'spell_acid',
    'label':'주문 · 산성',
    'weight':1,
  },
  {
    'id':'spell_bludgeoning',
    'label':'주문 · 타격',
    'weight':1,
  },
  {
    'id':'spell_cold',
    'label':'주문 · 냉기',
    'weight':1,
  },
  {
    'id':'spell_fire',
    'label':'주문 · 화염',
    'weight':1,
  },
  {
    'id':'spell_force',
    'label':'주문 · 역장',
    'weight':1,
  },
  {
    'id':'spell_lightning',
    'label':'주문 · 번개',
    'weight':1,
  },
  {
    'id':'spell_necrotic',
    'label':'주문 · 사령',
    'weight':1,
  },
  {
    'id':'spell_piercing',
    'label':'주문 · 관통',
    'weight':1,
  },
  {
    'id':'spell_poison',
    'label':'주문 · 독성',
    'weight':1,
  },
  {
    'id':'spell_psychic',
    'label':'주문 · 정신',
    'weight':1,
  },
  {
    'id':'spell_radiant',
    'label':'주문 · 광휘',
    'weight':1,
  },
  {
    'id':'spell_slashing',
    'label':'주문 · 참격',
    'weight':1,
  },
  {
    'id':'spell_thunder',
    'label':'주문 · 천둥',
    'weight':1,
  },
  {
    'id':'area_acid',
    'label':'범위 · 산성',
    'weight':1,
  },
  {
    'id':'area_bludgeoning',
    'label':'범위 · 타격',
    'weight':1,
  },
  {
    'id':'area_cold',
    'label':'범위 · 냉기',
    'weight':1,
  },
  {
    'id':'area_fire',
    'label':'범위 · 화염',
    'weight':1,
  },
  {
    'id':'area_force',
    'label':'범위 · 역장',
    'weight':1,
  },
  {
    'id':'area_lightning',
    'label':'범위 · 번개',
    'weight':1,
  },
  {
    'id':'area_necrotic',
    'label':'범위 · 사령',
    'weight':1,
  },
  {
    'id':'area_poison',
    'label':'범위 · 독성',
    'weight':1,
  },
  {
    'id':'area_psychic',
    'label':'범위 · 정신',
    'weight':1,
  },
  {
    'id':'area_radiant',
    'label':'범위 · 광휘',
    'weight':1,
  },
  {
    'id':'area_thunder',
    'label':'범위 · 천둥',
    'weight':1,
  },
  {
    'id':'aura_cold',
    'label':'오라 · 냉기',
    'weight':1,
  },
  {
    'id':'aura_fire',
    'label':'오라 · 화염',
    'weight':1,
  },
  {
    'id':'aura_necrotic',
    'label':'오라 · 사령',
    'weight':1,
  },
  {
    'id':'aura_poison',
    'label':'오라 · 독성',
    'weight':1,
  },
  {
    'id':'aura_psychic',
    'label':'오라 · 정신',
    'weight':1,
  },
  {
    'id':'aura_radiant',
    'label':'오라 · 광휘',
    'weight':1,
  },
  {
    'id':'aura_thunder',
    'label':'오라 · 천둥',
    'weight':1,
  },
  {
    'id':'gaze_cold',
    'label':'시선 · 냉기',
    'weight':1,
  },
  {
    'id':'gaze_force',
    'label':'시선 · 역장',
    'weight':1,
  },
  {
    'id':'gaze_necrotic',
    'label':'시선 · 사령',
    'weight':1,
  },
  {
    'id':'gaze_psychic',
    'label':'시선 · 정신',
    'weight':1,
  },
  {
    'id':'gaze_radiant',
    'label':'시선 · 광휘',
    'weight':1,
  },
  {
    'id':'breath_acid',
    'label':'브레스 · 산성',
    'weight':1,
  },
  {
    'id':'breath_cold',
    'label':'브레스 · 냉기',
    'weight':1,
  },
  {
    'id':'breath_fire',
    'label':'브레스 · 화염',
    'weight':1,
  },
  {
    'id':'breath_force',
    'label':'브레스 · 역장',
    'weight':1,
  },
  {
    'id':'breath_lightning',
    'label':'브레스 · 번개',
    'weight':1,
  },
  {
    'id':'breath_necrotic',
    'label':'브레스 · 사령',
    'weight':1,
  },
  {
    'id':'breath_poison',
    'label':'브레스 · 독성',
    'weight':1,
  },
  {
    'id':'breath_radiant',
    'label':'브레스 · 광휘',
    'weight':1,
  },
  {
    'id':'breath_thunder',
    'label':'브레스 · 천둥',
    'weight':1,
  },
  {
    'id':'trap_like_acid',
    'label':'함정형 · 산성',
    'weight':1,
  },
  {
    'id':'trap_like_bludgeoning',
    'label':'함정형 · 타격',
    'weight':1,
  },
  {
    'id':'trap_like_cold',
    'label':'함정형 · 냉기',
    'weight':1,
  },
  {
    'id':'trap_like_fire',
    'label':'함정형 · 화염',
    'weight':1,
  },
  {
    'id':'trap_like_force',
    'label':'함정형 · 역장',
    'weight':1,
  },
  {
    'id':'trap_like_piercing',
    'label':'함정형 · 관통',
    'weight':1,
  },
  {
    'id':'trap_like_poison',
    'label':'함정형 · 독성',
    'weight':1,
  },
  {
    'id':'trap_like_slashing',
    'label':'함정형 · 참격',
    'weight':1,
  },
  {
    'id':'summon_support',
    'label':'소환 중심',
    'weight':5,
  },
  {
    'id':'control_cold',
    'label':'제어형 · 냉기',
    'weight':1,
  },
  {
    'id':'control_force',
    'label':'제어형 · 역장',
    'weight':1,
  },
  {
    'id':'control_necrotic',
    'label':'제어형 · 사령',
    'weight':1,
  },
  {
    'id':'control_poison',
    'label':'제어형 · 독성',
    'weight':1,
  },
  {
    'id':'control_psychic',
    'label':'제어형 · 정신',
    'weight':1,
  },
  {
    'id':'control_radiant',
    'label':'제어형 · 광휘',
    'weight':1,
  },
  {
    'id':'control_thunder',
    'label':'제어형 · 천둥',
    'weight':1,
  },
];
