const moviesData = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    rating: 8.6,
    votesCount: 38400,
    certification: 'PG-13',
    director: 'Denis Villeneuve',
    featured: true,
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    releaseDate: new Date('2024-03-01'),
    status: 'now_showing',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
      { name: 'Zendaya', role: 'Chani', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' },
      { name: 'Javier Bardem', role: 'Stilgar', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' }
    ]
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral, political, and personal consequences of scientific discovery.',
    genres: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    rating: 8.9,
    votesCount: 65200,
    certification: 'R',
    director: 'Christopher Nolan',
    featured: true,
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    releaseDate: new Date('2023-07-21'),
    status: 'now_showing',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' },
      { name: 'Matt Damon', role: 'Leslie Groves', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=80' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80' }
    ]
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genres: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    rating: 8.7,
    votesCount: 41200,
    certification: 'PG',
    director: 'Joaquim Dos Santos, Kemp Powers',
    featured: false,
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    releaseDate: new Date('2023-06-02'),
    status: 'now_showing',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales (voice)', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' }
    ]
  },
  {
    title: 'The Batman',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 176,
    rating: 8.1,
    votesCount: 48900,
    certification: 'PG-13',
    director: 'Matt Reeves',
    featured: false,
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4',
    releaseDate: new Date('2022-03-04'),
    status: 'now_showing',
    cast: [
      { name: 'Robert Pattinson', role: 'Bruce Wayne / Batman', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
      { name: 'Zoë Kravitz', role: 'Selina Kyle / Catwoman', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' }
    ]
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    rating: 8.7,
    votesCount: 92000,
    certification: 'PG-13',
    director: 'Christopher Nolan',
    featured: false,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    releaseDate: new Date('2014-11-07'),
    status: 'now_showing',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
      { name: 'Anne Hathaway', role: 'Brand', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
      { name: 'Jessica Chastain', role: 'Murph', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' }
    ]
  },
  {
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    duration: 192,
    rating: 8.0,
    votesCount: 54000,
    certification: 'PG-13',
    director: 'James Cameron',
    featured: false,
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    releaseDate: new Date('2022-12-16'),
    status: 'now_showing',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
      { name: 'Zoe Saldana', role: 'Neytiri', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
      { name: 'Sigourney Weaver', role: 'Kiri', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' }
    ]
  },
  {
    title: 'Gladiator II',
    description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    genres: ['Action', 'Drama', 'Adventure'],
    language: 'English',
    duration: 148,
    rating: 8.4,
    votesCount: 18200,
    certification: 'R',
    director: 'Ridley Scott',
    featured: false,
    poster: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
    releaseDate: new Date('2025-11-22'),
    status: 'coming_soon',
    cast: [
      { name: 'Paul Mescal', role: 'Lucius Verus', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
      { name: 'Pedro Pascal', role: 'Marcus Acacius', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
      { name: 'Denzel Washington', role: 'Macrinus', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=80' }
    ]
  },
  {
    title: 'Deadpool & Wolverine',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy, bringing unforgettable chaotic comedy and electrifying action.',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    duration: 128,
    rating: 8.2,
    votesCount: 39500,
    certification: 'R',
    director: 'Shawn Levy',
    featured: false,
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
    releaseDate: new Date('2024-07-26'),
    status: 'now_showing',
    cast: [
      { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
      { name: 'Hugh Jackman', role: 'Logan / Wolverine', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' }
    ]
  }
];

const theatresData = [
  {
    name: 'IMovies Grand Cinema',
    city: 'New York',
    location: 'Times Square, Manhattan',
    address: '1540 Broadway, New York, NY 10036',
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'VIP Recliners', 'Gourmet Bar & Cafe', 'Wheelchair Accessible'],
    phone: '+1 (212) 555-0199',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'
  },
  {
    name: 'IMovies IMAX Luxe',
    city: 'Los Angeles',
    location: 'Sunset Boulevard, Hollywood',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    amenities: ['Dolby Cinema', '4DX Motion Seats', 'In-Seat Dining', 'Valet Parking', 'Reserved Seating'],
    phone: '+1 (323) 555-0144',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80'
  },
  {
    name: 'IMovies Star Cineplex',
    city: 'Chicago',
    location: 'Michigan Avenue, Downtown',
    address: '600 N Michigan Ave, Chicago, IL 60611',
    amenities: ['RealD 3D', 'Dolby Atmos', 'Premium Loungers', 'Express Concessions'],
    phone: '+1 (312) 555-0188',
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80'
  },
  {
    name: 'IMovies Downtown Megaplex',
    city: 'Toronto',
    location: 'Yonge-Dundas Square',
    address: '259 Richmond St W, Toronto, ON M5V 1W5',
    amenities: ['UltraAVX', 'Laser Projection', 'VIP Lounge', 'Mobile Ticketing'],
    phone: '+1 (416) 555-0122',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80'
  }
];

module.exports = { moviesData, theatresData };
