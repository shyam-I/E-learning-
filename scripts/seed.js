const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in your environment')
  process.exit(1)
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await mongoose.connection.dropDatabase()
    console.log('Database cleared')

    const db = mongoose.connection.db

    // Create collections
    const categories = await db.collection('categories').insertMany([
      {
        name: 'Web Development',
        description: 'Learn to build modern web applications',
        icon: '🌐',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Data Science',
        description: 'Master data analysis and machine learning',
        icon: '📊',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mobile Development',
        description: 'Create iOS and Android applications',
        icon: '📱',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'UI/UX Design',
        description: 'Design beautiful and intuitive interfaces',
        icon: '🎨',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Cloud Computing',
        description: 'Deploy and manage applications in the cloud',
        icon: '☁️',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'DevOps',
        description: 'Automate and optimize deployment pipelines',
        icon: '⚙️',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    console.log('Categories created')

    // Get category IDs
    const category_id = categories.insertedIds

    // Create courses
    const courses = await db.collection('courses').insertMany([
      {
        title: 'Introduction to React',
        description:
          'Learn React fundamentals and build your first interactive application with hooks and state management.',
        instructorId: 'test-instructor',
        category_id: category_id[0], // Web Development
        level: 'Beginner',
        duration_hours: 20,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Python for Data Science',
        description:
          'Master Python programming with pandas, NumPy, and scikit-learn for data analysis and machine learning.',
        instructorId: 'test-instructor',
        category_id: category_id[1], // Data Science
        level: 'Intermediate',
        duration_hours: 30,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Advanced JavaScript',
        description:
          'Deep dive into JavaScript: async/await, closures, prototypes, and modern ES6+ features.',
        instructorId: 'test-instructor',
        category_id: category_id[0], // Web Development
        level: 'Advanced',
        duration_hours: 25,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'UI/UX Design Fundamentals',
        description:
          'Learn design principles, user research, wireframing, and prototyping for beautiful digital products.',
        instructorId: 'test-instructor',
        category_id: category_id[3], // UI/UX Design
        level: 'Beginner',
        duration_hours: 18,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AWS Cloud Essentials',
        description:
          'Get certified with AWS: EC2, S3, RDS, Lambda, and other core AWS services for cloud solutions.',
        instructorId: 'test-instructor',
        category_id: category_id[4], // Cloud Computing
        level: 'Intermediate',
        duration_hours: 28,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Flutter Mobile Development',
        description:
          'Build cross-platform mobile apps with Flutter and Dart. Create iOS and Android apps from a single codebase.',
        instructorId: 'test-instructor',
        category_id: category_id[2], // Mobile Development
        level: 'Intermediate',
        duration_hours: 35,
        status: 'published',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    console.log('Courses created')

    // Get course IDs
    const course_id = courses.insertedIds
    const courseArray = Object.values(course_id)

    // Create lessons for React course
    await db.collection('lessons').insertMany([
      {
        course_id: courseArray[0],
        title: 'Getting Started with React',
        description: 'Learn what React is and why it\'s popular for building user interfaces.',
        content:
          'React is a JavaScript library for building user interfaces with reusable components. In this lesson, we\'ll explore React fundamentals and set up your development environment.',
        order_index: 1,
        duration_minutes: 15,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        course_id: courseArray[0],
        title: 'JSX and Components',
        description: 'Master JSX syntax and learn how to create functional components.',
        content:
          'JSX allows you to write HTML-like code in JavaScript. Components are the building blocks of React applications. Learn how to create reusable, composable components.',
        order_index: 2,
        duration_minutes: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        course_id: courseArray[0],
        title: 'State and Props',
        description: 'Understand how to manage state and pass data between components.',
        content:
          'Props allow you to pass data from parent to child components. State lets components manage their own data. Learn when to use each and how they work together.',
        order_index: 3,
        duration_minutes: 25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        course_id: courseArray[0],
        title: 'Hooks and Side Effects',
        description: 'Learn about React Hooks and how to manage side effects.',
        content:
          'Hooks like useState and useEffect make functional components more powerful. Understand how to manage component lifecycle and side effects in modern React.',
        order_index: 4,
        duration_minutes: 22,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Lessons for Python course
      {
        course_id: courseArray[1],
        title: 'Python Basics for Data Science',
        description: 'Get started with Python fundamentals needed for data science.',
        content:
          'Python is the go-to language for data science. Learn about variables, data types, functions, and libraries like NumPy.',
        order_index: 1,
        duration_minutes: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        course_id: courseArray[1],
        title: 'Data Manipulation with Pandas',
        description: 'Learn how to work with data using the Pandas library.',
        content:
          'Pandas is essential for data manipulation. Master DataFrames, Series, and common operations like filtering, grouping, and merging data.',
        order_index: 2,
        duration_minutes: 35,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    console.log('Lessons created')

    console.log('✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
