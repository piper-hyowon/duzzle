import { OmitType } from '@nestjs/swagger';
import { ZoneEntity } from 'src/module/repository/entity/zone.entity';

export class Zone extends OmitType(ZoneEntity, [
  'createdAt',
  'updatedAt',
] as const) {}

export const ZONES: Zone[] = [
  {
    id: 0,
    nameKr: '정문・대학본부',
    nameUs: 'Entrance & Administration Building',
  },
  {
    id: 1,
    nameKr: '스머프동산',
    nameUs: 'Smurf Hill',
  },
  {
    id: 2,
    nameKr: '인문사회관',
    nameUs: 'College of Humanities & Social Sciences',
  },
  {
    id: 3,
    nameKr: '대강의동',
    nameUs: 'Lecture Hall',
  },
  {
    id: 4,
    nameKr: '차미리사기념관',
    nameUs: 'ChaMirisa Memorial Building',
  },
  {
    id: 5,
    nameKr: '학생회관',
    nameUs: 'Student Union',
  },
  {
    id: 6,
    nameKr: '도서관・대학원',
    nameUs: 'Main Library & Graduate School',
  },
  {
    id: 7,
    nameKr: '민주동산',
    nameUs: 'Liberty Hill',
  },
  {
    id: 8,
    nameKr: '영근터',
    nameUs: 'Younggeunteo',
  },
  {
    id: 9,
    nameKr: '덕우당',
    nameUs: 'Duk Woo Dang',
  },
  {
    id: 10,
    nameKr: '테니스장',
    nameUs: 'tennis court',
  },
  {
    id: 11,
    nameKr: '유아교육관',
    nameUs: 'Affiliated Kindergarten',
  },
  {
    id: 12,
    nameKr: '대운동장',
    nameUs: 'Stadium',
  },
  {
    id: 13,
    nameKr: '예술관',
    nameUs: 'College of Art & Design',
  },
  {
    id: 14,
    nameKr: '자연관・비엔나숲',
    nameUs: 'College of Natural Sciences & Vienna Forest',
  },
  {
    id: 15,
    nameKr: '약학관・아트홀',
    nameUs: 'College of Pharmacy & Art Hall',
  },
  {
    id: 16,
    nameKr: '덕성하나누리관 & 라온센터',
    nameUs: 'Hana Nuri Hall & Raon Center(Fitness Center)',
  },
  {
    id: 17,
    nameKr: '국제관',
    nameUs: 'International Hall',
  },
  {
    id: 18,
    nameKr: '기숙사(가온 I관, 가온 II 관)',
    nameUs: 'Dormitory(Gain I, Gain II)',
  },
  {
    id: 19,
    nameKr: '국제기숙사',
    nameUs: 'International Dormitory',
  },
] as const;
