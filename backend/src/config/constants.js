module.exports = {
  ROLES: {
    ADMIN: 'admin',
    CHAIR: 'chair',
    VICE_CHAIR: 'vice_chair',
    MEMBER: 'member',
    STAFF: 'staff',
  },
  MEMBER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ALUMNI: 'alumni',
  },
  MEETING_STATUS: {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  DOCUMENT_TYPE: {
    AGENDA: 'agenda',
    MINUTES: 'minutes',
    REPORT: 'report',
    POLICY: 'policy',
    OTHER: 'other',
  },
  VOTE_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
    CANCELLED: 'cancelled',
  },
  DECISION_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    IMPLEMENTED: 'implemented',
  },
  SURVEY_STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CLOSED: 'closed',
  },
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    EXCUSED: 'excused',
  },
};
