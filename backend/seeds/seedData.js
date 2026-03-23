require('dotenv').config();
const { sequelize, User, Member, Meeting, MeetingAttendance, Document, Survey, Vote, Decision } = require('../src/models');
const { hashPassword } = require('../src/utils/passwordHash');
const logger = require('../src/utils/logger');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    
    logger.info('Starting seed data...');

    // Create Admin User
    const adminHash = await hashPassword('Admin123!');
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@cac.org' },
      defaults: { email: 'admin@cac.org', password: adminHash, firstName: 'System', lastName: 'Admin', role: 'admin' }
    });

    // Create Chair User
    const chairHash = await hashPassword('Chair123!');
    const [chair] = await User.findOrCreate({
      where: { email: 'chair@cac.org' },
      defaults: { email: 'chair@cac.org', password: chairHash, firstName: 'Sarah', lastName: 'Johnson', role: 'chair' }
    });

    // Create Member Users
    const memberData = [
      { email: 'member1@cac.org', firstName: 'Michael', lastName: 'Chen' },
      { email: 'member2@cac.org', firstName: 'Dr. Emily', lastName: 'Rodriguez' },
      { email: 'member3@cac.org', firstName: 'James', lastName: 'Thompson' },
    ];

    const memberHash = await hashPassword('Member123!');
    const memberUsers = [];
    for (const data of memberData) {
      const [user] = await User.findOrCreate({
        where: { email: data.email },
        defaults: { ...data, password: memberHash, role: 'member' }
      });
      memberUsers.push(user);
    }

    // Create Member profiles
    const [chairMember] = await Member.findOrCreate({
      where: { userId: chair.id },
      defaults: { userId: chair.id, role: 'chair', status: 'active', phone: '555-0101', organization: 'Community Health Center', bio: 'Experienced healthcare administrator with 15 years in community health.', expertise: ['Healthcare Policy', 'Community Outreach', 'Budget Management'], joinDate: '2020-01-15' }
    });

    const [member1] = await Member.findOrCreate({
      where: { userId: memberUsers[0].id },
      defaults: { userId: memberUsers[0].id, role: 'member', status: 'active', phone: '555-0102', organization: 'Patient Advocacy Group', bio: 'Patient advocate focused on healthcare access.', expertise: ['Patient Rights', 'Healthcare Access'], joinDate: '2021-03-01' }
    });

    const [member2] = await Member.findOrCreate({
      where: { userId: memberUsers[1].id },
      defaults: { userId: memberUsers[1].id, role: 'vice_chair', status: 'active', phone: '555-0103', organization: 'Regional Medical Center', bio: 'Physician with expertise in preventive care.', expertise: ['Preventive Medicine', 'Clinical Practice', 'Research'], joinDate: '2020-06-15' }
    });

    const [member3] = await Member.findOrCreate({
      where: { userId: memberUsers[2].id },
      defaults: { userId: memberUsers[2].id, role: 'member', status: 'active', phone: '555-0104', organization: 'Community Services', bio: 'Community outreach specialist.', expertise: ['Community Services', 'Mental Health'], joinDate: '2022-01-10' }
    });

    // Create Meetings
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 1);
    
    const [meeting1] = await Meeting.findOrCreate({
      where: { title: 'Q1 2026 Regular CAC Meeting' },
      defaults: {
        title: 'Q1 2026 Regular CAC Meeting',
        description: 'First quarterly meeting to review healthcare service updates and member concerns.',
        scheduledDate: pastDate,
        location: 'Community Health Center - Conference Room A',
        meetingType: 'regular',
        status: 'completed',
        agenda: ['Call to Order', 'Approval of Previous Minutes', 'Healthcare Service Updates', 'Member Concerns', 'Action Items Review', 'Adjournment'],
        minutes: 'The meeting was called to order at 2:00 PM by Chair Johnson. Minutes from the previous meeting were approved unanimously. Healthcare service updates were presented. Several member concerns were discussed including access to telehealth services.',
        createdBy: chair.id
      }
    });

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);

    const [meeting2] = await Meeting.findOrCreate({
      where: { title: 'Q2 2026 Regular CAC Meeting' },
      defaults: {
        title: 'Q2 2026 Regular CAC Meeting',
        description: 'Second quarterly meeting focusing on community feedback and strategic planning.',
        scheduledDate: futureDate,
        location: 'Community Health Center - Conference Room A',
        meetingType: 'regular',
        status: 'scheduled',
        agenda: ['Call to Order', 'Approval of Previous Minutes', 'Community Feedback Review', 'Strategic Planning Update', 'New Business', 'Adjournment'],
        createdBy: chair.id
      }
    });

    // Create Attendance
    for (const member of [chairMember, member1, member2, member3]) {
      await MeetingAttendance.findOrCreate({
        where: { meetingId: meeting1.id, memberId: member.id },
        defaults: { meetingId: meeting1.id, memberId: member.id, status: member.id === member3.id ? 'excused' : 'present' }
      });
    }

    // Create Documents
    await Document.findOrCreate({
      where: { title: 'Q1 2026 Meeting Agenda' },
      defaults: { title: 'Q1 2026 Meeting Agenda', description: 'Official agenda for the Q1 2026 CAC meeting', type: 'agenda', version: '1.0', meetingId: meeting1.id, uploadedBy: chair.id, accessLevel: 'members_only', tags: ['Q1', '2026', 'agenda'] }
    });

    await Document.findOrCreate({
      where: { title: 'Q1 2026 Meeting Minutes' },
      defaults: { title: 'Q1 2026 Meeting Minutes', description: 'Approved minutes from the Q1 2026 CAC meeting', type: 'minutes', version: '1.0', meetingId: meeting1.id, uploadedBy: chair.id, accessLevel: 'members_only', tags: ['Q1', '2026', 'minutes'] }
    });

    await Document.findOrCreate({
      where: { title: 'Annual Healthcare Services Report 2025' },
      defaults: { title: 'Annual Healthcare Services Report 2025', description: 'Comprehensive report on healthcare service delivery and outcomes', type: 'report', version: '1.0', uploadedBy: admin.id, accessLevel: 'members_only', tags: ['annual', 'report', '2025'] }
    });

    // Create Survey
    const [survey] = await Survey.findOrCreate({
      where: { title: 'Member Satisfaction Survey Q1 2026' },
      defaults: {
        title: 'Member Satisfaction Survey Q1 2026',
        description: 'Quarterly satisfaction survey for CAC members',
        questions: [
          { id: '1', text: 'How satisfied are you with the CAC meeting frequency?', type: 'rating' },
          { id: '2', text: 'Are the meeting agendas provided with adequate notice?', type: 'yes_no' },
          { id: '3', text: 'What topics would you like to see addressed in future meetings?', type: 'text' },
          { id: '4', text: 'How would you rate the overall CAC effectiveness?', type: 'rating' },
        ],
        status: 'active',
        isAnonymous: false,
        createdBy: chair.id,
        startDate: new Date(),
        endDate: futureDate
      }
    });

    // Create Vote
    const [vote] = await Vote.findOrCreate({
      where: { title: 'Approval of Q1 2026 Meeting Minutes' },
      defaults: {
        title: 'Approval of Q1 2026 Meeting Minutes',
        description: 'Vote to formally approve the minutes from the Q1 2026 CAC meeting',
        options: ['Approve', 'Approve with Amendments', 'Reject'],
        status: 'open',
        votingMethod: 'simple_majority',
        createdBy: chair.id,
        endDate: futureDate
      }
    });

    // Create Decisions
    await Decision.findOrCreate({
      where: { title: 'Expand Telehealth Services Access' },
      defaults: {
        title: 'Expand Telehealth Services Access',
        description: 'Recommendation to expand telehealth service availability to include evening and weekend hours to improve patient access.',
        status: 'approved',
        category: 'Healthcare Access',
        priority: 'high',
        createdBy: chair.id,
        dueDate: futureDate.toISOString().split('T')[0],
        tags: ['telehealth', 'access', 'patient-care']
      }
    });

    await Decision.findOrCreate({
      where: { title: 'Implement Community Health Education Program' },
      defaults: {
        title: 'Implement Community Health Education Program',
        description: 'Launch a quarterly community health education program focusing on preventive care and chronic disease management.',
        status: 'pending',
        category: 'Community Health',
        priority: 'medium',
        createdBy: chair.id,
        tags: ['education', 'community', 'prevention']
      }
    });

    await Decision.findOrCreate({
      where: { title: 'Establish Patient Feedback Portal' },
      defaults: {
        title: 'Establish Patient Feedback Portal',
        description: 'Create an online portal for patients to submit feedback on healthcare services.',
        status: 'implemented',
        category: 'Patient Engagement',
        priority: 'medium',
        createdBy: chair.id,
        implementationNotes: 'Portal launched successfully in February 2026',
        tags: ['feedback', 'portal', 'patient-engagement']
      }
    });

    logger.info('✅ Seed data created successfully!');
    logger.info('');
    logger.info('Demo credentials:');
    logger.info('  Admin:   admin@cac.org   / Admin123!');
    logger.info('  Chair:   chair@cac.org   / Chair123!');
    logger.info('  Member:  member1@cac.org / Member123!');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
