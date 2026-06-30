const galleryData = [
  // Achievements (8)
  { id: 1, cat: 'achievements', title: 'Science Olympiad Winners', desc: 'Our team secured first place at the State Science Olympiad.', year: '2024', img: 'https://placehold.co/400x300/2563eb/ffffff?text=Science+Olympiad' },
  { id: 2, cat: 'achievements', title: 'National Debate Champions', desc: 'Students won the National Inter-School Debate Championship.', year: '2024', img: 'https://placehold.co/400x600/2563eb/ffffff?text=Debate+Champs' },
  { id: 3, cat: 'achievements', title: 'Robotics Award', desc: 'Gold medal at the National Robotics Challenge.', year: '2023', img: 'https://placehold.co/600x300/2563eb/ffffff?text=Robotics+Award' },
  { id: 4, cat: 'achievements', title: 'Math Genius Title', desc: 'First place in the Regional Mathematics Olympiad.', year: '2023', img: 'https://placehold.co/400x300/2563eb/ffffff?text=Math+Genius' },
  { id: 5, cat: 'achievements', title: 'Art Competition Winners', desc: 'Three students won prizes at the State Art Exhibition.', year: '2024', img: 'https://placehold.co/800x400/2563eb/ffffff?text=Art+Winners' },
  { id: 6, cat: 'achievements', title: 'Spelling Bee Champions', desc: 'Won the Regional Spelling Bee competition.', year: '2024', img: 'https://placehold.co/400x400/2563eb/ffffff?text=Spelling+Bee' },
  { id: 7, cat: 'achievements', title: 'Innovation Award', desc: 'Recognized for innovative waste management project.', year: '2023', img: 'https://placehold.co/600x400/2563eb/ffffff?text=Innovation' },
  { id: 8, cat: 'achievements', title: 'Sports Achievement Trophy', desc: 'Overall champions in Inter-School Sports Meet.', year: '2024', img: 'https://placehold.co/400x400/2563eb/ffffff?text=Sports+Trophy' },

  // Academics (6)
  { id: 9, cat: 'academics', title: 'Science Lab Session', desc: 'Students conducting experiments in the advanced lab.', year: '2024', img: 'https://placehold.co/600x400/22c55e/ffffff?text=Science+Lab' },
  { id: 10, cat: 'academics', title: 'Library Reading Hour', desc: 'Quiet reading session in the school library.', year: '2024', img: 'https://placehold.co/400x300/22c55e/ffffff?text=Library' },
  { id: 11, cat: 'academics', title: 'Computer Class', desc: 'Learning programming in the computer lab.', year: '2023', img: 'https://placehold.co/400x600/22c55e/ffffff?text=Computer+Class' },
  { id: 12, cat: 'academics', title: 'Group Study Session', desc: 'Collaborative learning in the classroom.', year: '2024', img: 'https://placehold.co/400x300/22c55e/ffffff?text=Group+Study' },
  { id: 13, cat: 'academics', title: 'Geography Project', desc: 'Students presenting their model projects.', year: '2023', img: 'https://placehold.co/800x400/22c55e/ffffff?text=Geography+Project' },
  { id: 14, cat: 'academics', title: 'Chemistry Experiment', desc: 'Hands-on chemistry lab work.', year: '2024', img: 'https://placehold.co/400x400/22c55e/ffffff?text=Chemistry+Lab' },

  // Sports (6)
  { id: 15, cat: 'sports', title: 'Annual Sports Day', desc: 'Highlights from the annual sports meet.', year: '2024', img: 'https://placehold.co/400x300/f59e0b/ffffff?text=Sports+Day' },
  { id: 16, cat: 'sports', title: 'Basketball Tournament', desc: 'Inter-house basketball championship.', year: '2024', img: 'https://placehold.co/400x400/f59e0b/ffffff?text=Basketball' },
  { id: 17, cat: 'sports', title: 'Swimming Competition', desc: 'Students competing in swimming events.', year: '2023', img: 'https://placehold.co/600x400/f59e0b/ffffff?text=Swimming' },
  { id: 18, cat: 'sports', title: 'Football Match', desc: 'Friendly match between school teams.', year: '2024', img: 'https://placehold.co/800x400/f59e0b/ffffff?text=Football' },
  { id: 19, cat: 'sports', title: 'Yoga Session', desc: 'Morning yoga for mindfulness and fitness.', year: '2024', img: 'https://placehold.co/400x600/f59e0b/ffffff?text=Yoga' },
  { id: 20, cat: 'sports', title: 'Athletics Training', desc: 'Track and field practice sessions.', year: '2023', img: 'https://placehold.co/400x300/f59e0b/ffffff?text=Athletics' },

  // Events (6)
  { id: 21, cat: 'events', title: 'Annual Day Celebration', desc: 'Grand cultural event with performances by students.', year: '2024', img: 'https://placehold.co/800x400/ec4899/ffffff?text=Annual+Day' },
  { id: 22, cat: 'events', title: 'Parent-Teacher Meet', desc: 'Interactive session between parents and teachers.', year: '2024', img: 'https://placehold.co/400x300/ec4899/ffffff?text=PTM' },
  { id: 23, cat: 'events', title: 'Science Fair', desc: 'Innovative projects displayed at the Science Fair.', year: '2023', img: 'https://placehold.co/400x600/ec4899/ffffff?text=Science+Fair' },
  { id: 24, cat: 'events', title: 'Career Counselling', desc: 'Guidance session for senior students.', year: '2024', img: 'https://placehold.co/400x400/ec4899/ffffff?text=Career+Counselling' },
  { id: 25, cat: 'events', title: 'Alumni Meet', desc: 'Former students reuniting at the campus.', year: '2023', img: 'https://placehold.co/600x400/ec4899/ffffff?text=Alumni+Meet' },
  { id: 26, cat: 'events', title: 'Workshop on AI', desc: 'Students learning about artificial intelligence.', year: '2024', img: 'https://placehold.co/400x300/ec4899/ffffff?text=AI+Workshop' },

  // Cultural (6)
  { id: 27, cat: 'cultural', title: 'Diwali Celebration', desc: 'Festival of lights celebrated with enthusiasm.', year: '2024', img: 'https://placehold.co/400x300/a855f7/ffffff?text=Diwali' },
  { id: 28, cat: 'cultural', title: 'Dance Performance', desc: 'Traditional dance showcase by students.', year: '2024', img: 'https://placehold.co/400x600/a855f7/ffffff?text=Dance' },
  { id: 29, cat: 'cultural', title: 'Music Concert', desc: 'School orchestra and choir performance.', year: '2023', img: 'https://placehold.co/600x400/a855f7/ffffff?text=Music+Concert' },
  { id: 30, cat: 'cultural', title: 'Drama Club Play', desc: 'Students performing a Shakespearean play.', year: '2024', img: 'https://placehold.co/800x400/a855f7/ffffff?text=Drama+Play' },
  { id: 31, cat: 'cultural', title: 'Republic Day', desc: 'Flag hoisting and cultural programs.', year: '2024', img: 'https://placehold.co/400x400/a855f7/ffffff?text=Republic+Day' },
  { id: 32, cat: 'cultural', title: 'Art Exhibition', desc: 'Student artwork displayed in the school gallery.', year: '2024', img: 'https://placehold.co/400x300/a855f7/ffffff?text=Art+Exhibition' },

  // Facilities (5)
  { id: 33, cat: 'facilities', title: 'School Library', desc: 'Well-stocked library with 5000+ books.', year: '2024', img: 'https://placehold.co/400x300/06b6d4/ffffff?text=Library' },
  { id: 34, cat: 'facilities', title: 'Computer Lab', desc: 'Modern computer lab with 40 systems.', year: '2024', img: 'https://placehold.co/600x400/06b6d4/ffffff?text=Computer+Lab' },
  { id: 35, cat: 'facilities', title: 'Science Labs', desc: 'Fully equipped physics, chemistry and biology labs.', year: '2023', img: 'https://placehold.co/400x600/06b6d4/ffffff?text=Science+Labs' },
  { id: 36, cat: 'facilities', title: 'Playground', desc: 'Spacious playground for outdoor sports.', year: '2024', img: 'https://placehold.co/800x400/06b6d4/ffffff?text=Playground' },
  { id: 37, cat: 'facilities', title: 'Smart Classrooms', desc: 'Interactive smart boards in every classroom.', year: '2024', img: 'https://placehold.co/400x300/06b6d4/ffffff?text=Smart+Classrooms' },

  // Student Life (5)
  { id: 38, cat: 'student-life', title: 'Morning Assembly', desc: 'Daily morning assembly routine.', year: '2024', img: 'https://placehold.co/400x300/14b8a6/ffffff?text=Morning+Assembly' },
  { id: 39, cat: 'student-life', title: 'Scout & Guide', desc: 'Scout and guide activities and training.', year: '2024', img: 'https://placehold.co/400x400/14b8a6/ffffff?text=Scout+and+Guide' },
  { id: 40, cat: 'student-life', title: 'Classroom Learning', desc: 'Engaging classroom sessions with teachers.', year: '2023', img: 'https://placehold.co/600x400/14b8a6/ffffff?text=Classroom' },
  { id: 41, cat: 'student-life', title: 'School Canteen', desc: 'Students enjoying break time at the canteen.', year: '2024', img: 'https://placehold.co/400x600/14b8a6/ffffff?text=Canteen' },
  { id: 42, cat: 'student-life', title: 'Study Circle', desc: 'Peer learning groups after school hours.', year: '2024', img: 'https://placehold.co/400x300/14b8a6/ffffff?text=Study+Circle' }
];