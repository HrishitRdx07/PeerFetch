const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const BRANCHES = [
    { code: 'EL', name: 'Electronics', offset: 0 },
    { code: 'CP', name: 'Computer SFI', offset: 0 },
    { code: 'CP', name: 'Computer GIA', offset: 50 },
    { code: 'EC', name: 'Electronics and Communication', offset: 0 },
    { code: 'EE', name: 'Electrical', offset: 0 },
    { code: 'ME', name: 'Mechanical SFI', offset: 0 },
    { code: 'ME', name: 'Mechanical GIA', offset: 50 },
    { code: 'CE', name: 'Civil', offset: 0 },
    { code: 'PE', name: 'Production', offset: 0 },
    { code: 'IT', name: 'IT', offset: 0 },
];

const ACTIVITIES = ['TRS', 'TSA', 'BAHA', 'IEEE', 'IEI'];

const SKILLS = [
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'Machine Learning',
    'Data Analysis', 'Circuit Design', 'CAD', 'AutoCAD', 'MATLAB', 'Arduino',
    'Embedded Systems', 'Web Development', 'Mobile Development', 'Cloud Computing',
    'Database Management', 'UI/UX Design', 'Project Management'
];

const FIRST_NAMES = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
    'Shaurya', 'Atharv', 'Advaith', 'Pranav', 'Dhruv', 'Aryan', 'Kabir', 'Shivansh', 'Reyansh', 'Aadhya',
    'Ananya', 'Pari', 'Aanya', 'Diya', 'Ira', 'Myra', 'Sara', 'Navya', 'Kiara', 'Saanvi',
    'Aarohi', 'Avni', 'Riya', 'Zara', 'Kavya', 'Shanaya', 'Prisha', 'Anvi', 'Aditi', 'Anika'
];

const LAST_NAMES = [
    'Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Verma', 'Joshi', 'Agarwal', 'Mehta',
    'Rao', 'Nair', 'Pillai', 'Iyer', 'Desai', 'Kulkarni', 'Mishra', 'Pandey', 'Chopra', 'Shah',
    'Malhotra', 'Bhatia', 'Kapoor', 'Menon', 'Ghosh', 'Das', 'Banerjee', 'Chatterjee', 'Roy', 'Mukherjee'
];

function generateName() {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${firstName} ${lastName}`;
}

function generateStudentId(batch, branchCode, rollNumber) {
    const batchYear = batch.toString().slice(-2);
    const roll = rollNumber.toString().padStart(3, '0');
    return `${batchYear}${branchCode}${roll}`;
}

function generateSkills(count = 3) {
    const shuffled = [...SKILLS].sort(() => 0.5 - Math.random());
    return JSON.stringify(shuffled.slice(0, count));
}

function generateActivities(count = 2) {
    const shuffled = [...ACTIVITIES].sort(() => 0.5 - Math.random());
    return JSON.stringify(shuffled.slice(0, Math.floor(Math.random() * count) + 1));
}

function generateBio(name, branch, year) {
    const bios = [
        `Hi! I'm ${name}, a ${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} year ${branch} student passionate about technology and innovation.`,
        `${name} here! Enthusiastic about learning and exploring new opportunities in ${branch} engineering.`,
        `Hello! I'm ${name}, dedicated to excellence in ${branch}. Always eager to connect and collaborate.`,
        `${name} - ${branch} student with a keen interest in research and development.`,
        `Passionate ${branch} engineering student looking to make meaningful connections and learn from seniors.`,
    ];
    return bios[Math.floor(Math.random() * bios.length)];
}

function generateLinkedInUrl(name) {
    // Convert name to LinkedIn-style URL
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `https://www.linkedin.com/in/${slug}`;
}

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.mentorshipRequest.deleteMany({});
    await prisma.user.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
        data: {
            studentId: 'ADMIN001',
            password: hashedPassword,
            name: 'Admin User',
            email: 'admin@peerfetch.com',
            branch: 'CP',
            year: 4,
            batch: 2022,
            isApproved: true,
            isAdmin: true,
            bio: 'System Administrator for PeerFetch Platform',
            skills: JSON.stringify(['System Administration', 'Database Management', 'Security']),
            extracurriculars: JSON.stringify(['IEEE', 'TRS']),
        },
    });

    console.log('✅ Admin user created (studentId: ADMIN001, password: admin123)');

    // Create students for each branch and year
    let totalStudents = 0;
    const currentYear = 2026;

    for (const branch of BRANCHES) {
        for (let year = 1; year <= 4; year++) {
            const batch = currentYear - year + 1;

            for (let rollNumber = 1; rollNumber <= 50; rollNumber++) {
                const name = generateName();
                const actualRoll = rollNumber + branch.offset;
                const studentId = generateStudentId(batch, branch.code, actualRoll);
                const password = await bcrypt.hash('password123', 10);

                // Randomly approve 90% of students
                const isApproved = Math.random() > 0.1;

                await prisma.user.create({
                    data: {
                        studentId,
                        password,
                        name,
                        email: `${studentId.toLowerCase()}@college.edu`,
                        branch: branch.code,
                        year,
                        batch,
                        isApproved,
                        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`,
                        bio: generateBio(name, branch.name, year),
                        linkedinUrl: generateLinkedInUrl(name),
                        skills: generateSkills(),
                        extracurriculars: generateActivities(),
                    },
                });

                totalStudents++;

                if (totalStudents % 100 === 0) {
                    console.log(`📝 Created ${totalStudents} students...`);
                }
            }
        }
    }

    console.log(`\n🎉 Successfully seeded database with:`);
    console.log(`   - 1 Admin user`);
    console.log(`   - ${totalStudents} Student users`);
    console.log(`   - Total: ${totalStudents + 1} users\n`);
    console.log(`📌 Default credentials:`);
    console.log(`   Admin: ADMIN001 / admin123`);
    console.log(`   Student examples: 25EL001 / password123, 24CP015 / password123`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
