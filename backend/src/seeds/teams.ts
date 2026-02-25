export interface TeamSeed {
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  secondary_color: string;
}

export const teams: TeamSeed[] = [
  {
    id: 'team-ironclad',
    city: 'Ironclad',
    name: 'Giants',
    abbreviation: 'IRN',
    primary_color: '#1e3a5f',
    secondary_color: '#c0a060',
  },
  {
    id: 'team-gravel',
    city: 'Gravel City',
    name: 'Hammers',
    abbreviation: 'GRV',
    primary_color: '#5a2d0c',
    secondary_color: '#d4a017',
  },
  {
    id: 'team-blueridge',
    city: 'Blue Ridge',
    name: 'Falcons',
    abbreviation: 'BLR',
    primary_color: '#003366',
    secondary_color: '#99ccff',
  },
  {
    id: 'team-portside',
    city: 'Portside',
    name: 'Mariners',
    abbreviation: 'PRT',
    primary_color: '#004d40',
    secondary_color: '#80cbc4',
  },
];
