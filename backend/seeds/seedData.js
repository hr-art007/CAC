require('dotenv').config();
const { sequelize, User, Member, Meeting, MeetingAttendance, Document, Survey, Vote, Decision } = require('../src/models');
const { hashPassword } = require('../src/utils/passwordHash');
const logger = require('../src/utils/logger');

const seedData = async () => {
  try {
    logger.info('Connecting to database...');
    await sequelize.authenticate();
    logger.info('Database connected. Syncing schema...');
    await sequelize.sync({ force: false, alter: true });
    logger.info('Schema synced. Starting seed...');

    // ----------------------------------------------------------------
    // Users
    // ----------------------------------------------------------------
    const [adminUser] = await User.findOrCreate({
      where: { email: 'admin@cac.org' },
      defaults: {
        email: 'admin@cac.org',
        password: await hashPassword('Admin123!'),
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true,
      },
    });

    const [chairUser] = await User.findOrCreate({
      where: { email: 'chair@cac.org' },
      defaults: {
        email: 'chair@cac.org',
        password: await hashPassword('Chair123!'),
        firstName: 'Margaret',
        lastName: 'Thompson',
        role: 'chair',
        isActive: true,
      },
    });

    const [viceChairUser] = await User.findOrCreate({
      where: { email: 'vicechair@cac.org' },
      defaults: {
        email: 'vicechair@cac.org',
        password: await hashPassword('ViceChair123!'),
        firstName: 'David',
        lastName: 'Martinez',
        role: 'vice_chair',
        isActive: true,
      },
    });

    const [member1User] = await User.findOrCreate({
      where: { email: 'member1@cac.org' },
      defaults: {
        email: 'member1@cac.org',
        password: await hashPassword('Member123!'),
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'member',
        isActive: true,
      },
    });

    const [member2User] = await User.findOrCreate({
      where: { email: 'member2@cac.org' },
      defaults: {
        email: 'member2@cac.org',
        password: await hashPassword('Member123!'),
        firstName: 'James',
        lastName: 'Williams',
        role: 'member',
        isActive: true,
      },
    });

    const [staffUser] = await User.findOrCreate({
      where: { email: 'staff@cac.org' },
      defaults: {
        email: 'staff@cac.org',
        password: await hashPassword('Staff123!'),
        firstName: 'Emily',
        lastName: 'Chen',
        role: 'staff',
        isActive: true,
      },
    });

    logger.info('Users seeded.');

    // ----------------------------------------------------------------
    // Members
    // ----------------------------------------------------------------
    const [chairMember] = await Member.findOrCreate({
      where: { userId: chairUser.id },
      defaults: {
        userId: chairUser.id,
        role: 'chair',
        status: 'active',
        phone: '555-0101',
        organization: 'Regional Health Authority',
        bio: 'Experienced healthcare administrator with 15 years of community health leadership.',
        expertise: ['healthcare policy', 'community outreach', 'strategic planning'],
        joinDate: '2020-01-15',
        termEndDate: '2025-01-15',
        isAvailableForCommittee: true,
      },
    });

    const [viceChairMember] = await Member.findOrCreate({
      where: { userId: viceChairUser.id },
      defaults: {
        userId: viceChairUser.id,
        role: 'vice_chair',
        status: 'active',
        phone: '555-0102',
        organization: 'Community Health Center',
        bio: 'Public health specialist focused on preventive care and health equity.',
        expertise: ['public health', 'health equity', 'data analysis'],
        joinDate: '2021-03-01',
        termEndDate: '2025-03-01',
        isAvailableForCommittee: true,
      },
    });

    const [member1] = await Member.findOrCreate({
      where: { userId: member1User.id },
      defaults: {
        userId: member1User.id,
        role: 'member',
        status: 'active',
        phone: '555-0103',
        organization: 'Patient Advocacy Network',
        bio: 'Patient advocate with expertise in healthcare access and navigation.',
        expertise: ['patient advocacy', 'healthcare access', 'community liaison'],
        joinDate: '2021-06-01',
        termEndDate: '2024-06-01',
        isAvailableForCommittee: true,
      },
    });

    const [member2] = await Member.findOrCreate({
      where: { userId: member2User.id },
      defaults: {
        userId: member2User.id,
        role: 'member',
        status: 'active',
        phone: '555-0104',
        organization: 'Local Hospital Foundation',
        bio: 'Hospital administrator and community health volunteer.',
        expertise: ['hospital administration', 'fundraising', 'volunteer coordination'],
        joinDate: '2022-01-10',
        termEndDate: '2025-01-10',
        isAvailableForCommittee: true,
      },
    });

    const [staffMember] = await Member.findOrCreate({
      where: { userId: staffUser.id },
      defaults: {
        userId: staffUser.id,
        role: 'staff',
        status: 'active',
        phone: '555-0105',
        organization: 'CAC Secretariat',
        bio: 'Administrative staff supporting CAC operations and coordination.',
        expertise: ['administration', 'meeting coordination', 'record keeping'],
        joinDate: '2022-04-01',
        isAvailableForCommittee: true,
      },
    });

    logger.info('Members seeded.');

    // ----------------------------------------------------------------
    // Meetings
    // ----------------------------------------------------------------
    const [meeting1] = await Meeting.findOrCreate({
      where: { title: 'Q1 2024 Regular Meeting' },
      defaults: {
        title: 'Q1 2024 Regular Meeting',
        description: 'First quarter review of community health initiatives and program updates.',
        scheduledDate: new Date('2024-03-15T14:00:00Z'),
        endTime: new Date('2024-03-15T16:00:00Z'),
        location: 'Community Health Center, Room 201',
        meetingType: 'regular',
        status: 'completed',
        agenda: [
          { item: 1, title: 'Call to Order', duration: 5 },
          { item: 2, title: 'Approval of Previous Minutes', duration: 10 },
          { item: 3, title: 'Healthcare Access Update', duration: 30 },
          { item: 4, title: 'Budget Review Q1', duration: 20 },
          { item: 5, title: 'New Business', duration: 25 },
          { item: 6, title: 'Adjournment', duration: 5 },
        ],
        minutes: 'The meeting was called to order at 2:05 PM by Chair Thompson. All agenda items were discussed. The committee approved the Q1 budget allocation for community outreach programs.',
        actionItems: [
          { id: 1, task: 'Prepare Q2 budget proposal', assignedTo: 'Emily Chen', dueDate: '2024-04-15' },
          { id: 2, task: 'Draft healthcare access survey', assignedTo: 'Sarah Johnson', dueDate: '2024-04-01' },
        ],
        createdBy: adminUser.id,
        reminderSent: true,
      },
    });

    const [meeting2] = await Meeting.findOrCreate({
      where: { title: 'Q2 2024 Regular Meeting' },
      defaults: {
        title: 'Q2 2024 Regular Meeting',
        description: 'Second quarter meeting covering program evaluations and strategic planning.',
        scheduledDate: new Date('2024-06-20T14:00:00Z'),
        endTime: new Date('2024-06-20T16:30:00Z'),
        location: 'Virtual - Zoom',
        meetingType: 'virtual',
        status: 'completed',
        agenda: [
          { item: 1, title: 'Call to Order', duration: 5 },
          { item: 2, title: 'Program Evaluation Review', duration: 40 },
          { item: 3, title: 'Strategic Plan Update', duration: 30 },
          { item: 4, title: 'Community Feedback Report', duration: 25 },
          { item: 5, title: 'Adjournment', duration: 5 },
        ],
        minutes: 'Virtual meeting held via Zoom. Quorum established with 5 of 5 voting members present. Strategic plan for H2 2024 approved unanimously.',
        actionItems: [
          { id: 1, task: 'Finalize H2 strategic plan document', assignedTo: 'David Martinez', dueDate: '2024-07-15' },
          { id: 2, task: 'Publish community feedback report', assignedTo: 'Emily Chen', dueDate: '2024-07-01' },
        ],
        meetingLink: 'https://zoom.us/j/example123',
        createdBy: adminUser.id,
        reminderSent: true,
      },
    });

    logger.info('Meetings seeded.');

    // ----------------------------------------------------------------
    // Attendance
    // ----------------------------------------------------------------
    const attendance1Records = [
      { meetingId: meeting1.id, memberId: chairMember.id, status: 'present' },
      { meetingId: meeting1.id, memberId: viceChairMember.id, status: 'present' },
      { meetingId: meeting1.id, memberId: member1.id, status: 'present' },
      { meetingId: meeting1.id, memberId: member2.id, status: 'excused', notes: 'Prior commitment' },
      { meetingId: meeting1.id, memberId: staffMember.id, status: 'present' },
    ];

    const attendance2Records = [
      { meetingId: meeting2.id, memberId: chairMember.id, status: 'present' },
      { meetingId: meeting2.id, memberId: viceChairMember.id, status: 'present' },
      { meetingId: meeting2.id, memberId: member1.id, status: 'absent' },
      { meetingId: meeting2.id, memberId: member2.id, status: 'present' },
      { meetingId: meeting2.id, memberId: staffMember.id, status: 'present' },
    ];

    for (const record of [...attendance1Records, ...attendance2Records]) {
      await MeetingAttendance.findOrCreate({
        where: { meetingId: record.meetingId, memberId: record.memberId },
        defaults: record,
      });
    }

    logger.info('Attendance seeded.');

    // ----------------------------------------------------------------
    // Documents
    // ----------------------------------------------------------------
    await Document.findOrCreate({
      where: { title: 'Q1 2024 Meeting Agenda' },
      defaults: {
        title: 'Q1 2024 Meeting Agenda',
        description: 'Official agenda for the Q1 2024 Regular Meeting',
        type: 'agenda',
        meetingId: meeting1.id,
        uploadedBy: staffUser.id,
        accessLevel: 'members_only',
        version: '1.0',
        tags: ['agenda', 'Q1', '2024'],
        isActive: true,
      },
    });

    await Document.findOrCreate({
      where: { title: 'Q1 2024 Meeting Minutes' },
      defaults: {
        title: 'Q1 2024 Meeting Minutes',
        description: 'Approved minutes from the Q1 2024 Regular Meeting',
        type: 'minutes',
        meetingId: meeting1.id,
        uploadedBy: staffUser.id,
        accessLevel: 'members_only',
        version: '1.0',
        tags: ['minutes', 'Q1', '2024', 'approved'],
        isActive: true,
      },
    });

    await Document.findOrCreate({
      where: { title: 'Community Health Access Report 2024' },
      defaults: {
        title: 'Community Health Access Report 2024',
        description: 'Annual report on community healthcare access challenges and opportunities.',
        type: 'report',
        uploadedBy: chairUser.id,
        accessLevel: 'public',
        version: '2.1',
        tags: ['report', 'health access', '2024', 'annual'],
        isActive: true,
      },
    });

    logger.info('Documents seeded.');

    // ----------------------------------------------------------------
    // Survey
    // ----------------------------------------------------------------
    const [activeSurvey] = await Survey.findOrCreate({
      where: { title: 'Community Healthcare Needs Assessment 2024' },
      defaults: {
        title: 'Community Healthcare Needs Assessment 2024',
        description: 'Annual survey to assess the healthcare needs and priorities of our community members.',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            text: 'What is the most significant healthcare barrier in our community?',
            options: ['Cost/Affordability', 'Geographic Access', 'Language/Cultural Barriers', 'Lack of Providers', 'Transportation'],
            required: true,
          },
          {
            id: 'q2',
            type: 'rating',
            text: 'Rate the overall quality of healthcare services in our community (1-5)',
            min: 1,
            max: 5,
            required: true,
          },
          {
            id: 'q3',
            type: 'checkbox',
            text: 'Which services should the CAC prioritize? (Select all that apply)',
            options: ['Mental Health', 'Primary Care', 'Dental', 'Vision', 'Substance Abuse', 'Women\'s Health', 'Pediatric Care'],
            required: false,
          },
          {
            id: 'q4',
            type: 'text',
            text: 'Please share any additional comments or suggestions for improving community healthcare.',
            required: false,
          },
        ],
        status: 'active',
        isAnonymous: false,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-09-30'),
        createdBy: chairUser.id,
        targetAudience: 'all',
      },
    });

    logger.info('Survey seeded.');

    // ----------------------------------------------------------------
    // Vote
    // ----------------------------------------------------------------
    const [openVote] = await Vote.findOrCreate({
      where: { title: 'Approval of H2 2024 Community Health Budget Allocation' },
      defaults: {
        title: 'Approval of H2 2024 Community Health Budget Allocation',
        description: 'Vote to approve the proposed budget allocation of $250,000 for community health programs in the second half of 2024. Funds will support mental health services (40%), primary care access (35%), and health education (25%).',
        options: ['Approve', 'Reject', 'Abstain'],
        results: { Approve: 0, Reject: 0, Abstain: 0 },
        status: 'open',
        votingMethod: 'simple_majority',
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdBy: chairUser.id,
        isAnonymous: false,
        quorumRequired: 3,
      },
    });

    logger.info('Vote seeded.');

    // ----------------------------------------------------------------
    // Decisions
    // ----------------------------------------------------------------
    await Decision.findOrCreate({
      where: { title: 'Implement Community Health Worker Program' },
      defaults: {
        title: 'Implement Community Health Worker Program',
        description: 'Approve and implement a Community Health Worker (CHW) program to improve healthcare navigation for underserved populations. The program will hire 5 CHWs to serve the eastern, western, and central community zones.',
        status: 'approved',
        category: 'Programs',
        priority: 'high',
        implementationDate: '2024-09-01',
        implementationNotes: 'Hiring process underway. First cohort of CHWs expected to begin training in August 2024.',
        meetingId: meeting2.id,
        createdBy: chairUser.id,
        assignedTo: staffUser.id,
        dueDate: '2024-12-31',
        tags: ['community health workers', 'programs', 'underserved', '2024'],
      },
    });

    await Decision.findOrCreate({
      where: { title: 'Establish Telehealth Access Initiative' },
      defaults: {
        title: 'Establish Telehealth Access Initiative',
        description: 'Launch a telehealth access initiative to provide subsidized devices and internet connectivity to low-income community members, enabling access to remote healthcare services. Estimated cost: $75,000.',
        status: 'pending',
        category: 'Technology',
        priority: 'medium',
        meetingId: meeting2.id,
        createdBy: viceChairUser.id,
        assignedTo: chairUser.id,
        dueDate: '2024-10-15',
        tags: ['telehealth', 'technology', 'access', 'low-income'],
      },
    });

    logger.info('Decisions seeded.');

    // ----------------------------------------------------------------
    // Summary
    // ----------------------------------------------------------------
    logger.info('='.repeat(50));
    logger.info('Seed completed successfully!');
    logger.info('='.repeat(50));
    logger.info('Test credentials:');
    logger.info('  Admin:      admin@cac.org      / Admin123!');
    logger.info('  Chair:      chair@cac.org      / Chair123!');
    logger.info('  Vice Chair: vicechair@cac.org  / ViceChair123!');
    logger.info('  Member 1:   member1@cac.org    / Member123!');
    logger.info('  Member 2:   member2@cac.org    / Member123!');
    logger.info('  Staff:      staff@cac.org      / Staff123!');
    logger.info('='.repeat(50));

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
