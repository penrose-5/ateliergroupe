export interface Project {
  year: string;
  title: string;
  location?: string;
  note?: string;
  rank: number;
}

export const projects: Project[] = [
  {
    year: '2025',
    title: 'Genève : Paysage Exposé',
    location: 'Genève',
    note: 'Europan (Special Mention)',
    rank: 1,
  },
  {
    year: '2024',
    title: 'Open Hand, Open Castle',
    note: 'Publication',
    rank: 2,
  },
  {
    year: '2023',
    title: 'Project Room',
    rank: 3,
  },
  {
    year: '2022',
    title: 'Housing Study',
    location: 'Paris',
    rank: 4,
  },
];
