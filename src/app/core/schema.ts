export type InputType = 'text' | 'date' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox';

export interface FieldDef {
  key: string;
  label: string;
  type: InputType;
  options?: string[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMsg?: string;
}

/** A visual group of fields displayed within a card inside a tab */
export interface FieldGroup {
  title: string;
  fields: FieldDef[];
}

export interface SectionDef {
  key: string;
  table: string;
  title: string;
  icon: string;
  repeatable: boolean;
  fields: FieldDef[];
  /** For non-repeatable sections, split fields into visual card groups */
  fieldGroups?: FieldGroup[];
}

/** A tab groups one or more sections shown as cards */
export interface TabDef {
  key: string;
  title: string;
  sections: SectionDef[];
}

// =============================================
// SECTION DEFINITIONS
// =============================================

const VISA_APPLICATION: SectionDef = {
  key: 'visaApplications',
  table: 'visa_applications',
  title: 'Visa Application',
  icon: '📋',
  repeatable: false,
  fields: [
    { key: 'family_name', label: 'Family Name', type: 'text' },
    { key: 'given_name', label: 'Given Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMsg: 'Enter a valid email address' },
    { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { key: 'birth_place', label: 'Birth Place', type: 'text' },
    { key: 'mobile_no', label: 'Mobile Number', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
    { key: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
    { key: 'relationship_status', label: 'Relationship Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'De Facto', 'Engaged', 'Never Married', 'Separated'] },
    { key: 'marriage_date', label: 'Marriage Date', type: 'date' },
    { key: 'native_language', label: 'Native Language', type: 'text' },
    { key: 'first_arrival_date_australia', label: 'First Arrival Date (Australia)', type: 'date' },
    { key: 'reason_for_name_change', label: 'Reason for Name Change', type: 'select', options: ['', 'Deed Poll', 'Marriage', 'Other'] },
    { key: 'is_australian_study_required', label: 'Australian Study Required', type: 'select', options: ['Yes', 'No'] },
    { key: 'regional_australian_study', label: 'Regional Australian Study', type: 'select', options: ['Yes', 'No'] },
    { key: 'emergency_contact_name', label: 'Emergency Contact Person Name', type: 'text' },
    { key: 'emergency_contact_email', label: 'Emergency Contact Person Email', type: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMsg: 'Enter a valid email' },
    { key: 'emergency_contact_mobile', label: 'Emergency Contact Person Mobile No', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
    { key: 'emergency_contact_relationship', label: 'Relationship With Emergency Contact', type: 'text' },
    { key: 'passport_no', label: 'Passport No', type: 'text' },
    { key: 'country_of_passport', label: 'Country of Passport', type: 'text' },
    { key: 'passport_holder_nationality', label: 'Passport Holder Nationality', type: 'text' },
    { key: 'passport_issue_date', label: 'Passport Issue Date', type: 'date' },
    { key: 'passport_expiry_date', label: 'Passport Expiry Date', type: 'date' },
    { key: 'passport_issue_place', label: 'Passport Issue Place', type: 'text' }
  ],
  fieldGroups: [
    {
      title: 'Personal Details',
      fields: [
        { key: 'family_name', label: 'Family Name', type: 'text' },
        { key: 'given_name', label: 'Given Name (As per Passport)', type: 'text' },
        { key: 'email', label: 'Email', type: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMsg: 'Enter a valid email address' },
        { key: 'date_of_birth', label: 'DOB', type: 'date' },
        { key: 'birth_place', label: 'Birth Place', type: 'text' },
        { key: 'mobile_no', label: 'Mobile No', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
        { key: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
        { key: 'relationship_status', label: 'Relationship Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'De Facto', 'Engaged', 'Never Married', 'Separated'] },
        { key: 'marriage_date', label: 'Marriage Date', type: 'date' },
        { key: 'native_language', label: 'Native Language', type: 'text' },
        { key: 'first_arrival_date_australia', label: 'First Arrival Date Australia (If Applicable)', type: 'date' }
      ]
    },
    {
      title: 'Other Names/Spellings (If Applicable)',
      fields: [
        { key: 'reason_for_name_change', label: 'Reason for Name Change', type: 'select', options: ['Deed Poll', 'Marriage', 'Other'] }
      ]
    },
    {
      title: 'Australian Study (If Applicable)',
      fields: [
        { key: 'is_australian_study_required', label: 'Is Australian Study Require (If Applicable)', type: 'select', options: ['Yes', 'No'] },
        { key: 'regional_australian_study', label: 'Regional Australian Study (If Applicable)', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    {
      title: 'Emergency Contact Details',
      fields: [
        { key: 'emergency_contact_name', label: 'Emergency Contact Person Name', type: 'text' },
        { key: 'emergency_contact_email', label: 'Emergency Contact Person Email', type: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMsg: 'Enter a valid email' },
        { key: 'emergency_contact_mobile', label: 'Emergency Contact Person Mobile No', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
        { key: 'emergency_contact_relationship', label: 'Relationship With Emergency Contact', type: 'text' }
      ]
    },
    {
      title: 'Passport Details',
      fields: [
        { key: 'passport_no', label: 'Passport No', type: 'text' },
        { key: 'country_of_passport', label: 'Country of Passport', type: 'text' },
        { key: 'passport_holder_nationality', label: 'Passport Holder Nationality', type: 'text' },
        { key: 'passport_issue_date', label: 'Passport Issue Date', type: 'date' },
        { key: 'passport_expiry_date', label: 'Passport Expiry Date', type: 'date' },
        { key: 'passport_issue_place', label: 'Passport Issue Place', type: 'text' }
      ]
    }
  ]
};

const STUDENT_DETAILS: SectionDef = {
  key: 'studentDetails',
  table: 'student_details',
  title: 'Student Details',
  icon: '🎓',
  repeatable: false,
  fields: [
    { key: 'student_id_no', label: 'Student ID', type: 'text' },
    { key: 'usi_number', label: 'Unique Student Identifier (USI) Number', type: 'text' },
    { key: 'university_college_name', label: 'University/College Name', type: 'text' },
    { key: 'course_name', label: 'Course Name', type: 'text' },
    { key: 'course_from', label: 'Course From', type: 'date' },
    { key: 'course_to', label: 'Course To', type: 'date' }
  ]
};

const FAMILY_MEMBERS: SectionDef = {
  key: 'familyMembers',
  table: 'family_members',
  title: 'Family Details',
  icon: '👨‍👩‍👧‍👦',
  repeatable: true,
  fields: [
    { key: 'full_name', label: 'Full Name (As per Passport)', type: 'text', required: true },
    { key: 'sex', label: 'Sex', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
    { key: 'dob', label: 'DOB', type: 'date', required: true },
    { key: 'relationship', label: 'Relationship with you', type: 'text', required: true },
    { key: 'relationship_status', label: 'Relationship Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'De Facto'] },
    { key: 'birth_city', label: 'Birth City', type: 'text' },
    { key: 'current_country', label: 'Current Country', type: 'text' }
  ]
};

const RELATIVES_AUSTRALIA: SectionDef = {
  key: 'relativesAustralia',
  table: 'relatives_australia',
  title: 'Relatives in Australia',
  icon: '🦘',
  repeatable: true,
  fields: [
    { key: 'full_name', label: 'Full Name (As per Passport)', type: 'text', required: true },
    { key: 'relationship', label: 'Relationship with you', type: 'text', required: true },
    { key: 'dob', label: 'DOB', type: 'date' },
    { key: 'birth_city', label: 'Birth City', type: 'text' },
    { key: 'nationality', label: 'Nationality', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'contact_no', label: 'Contact No.', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
    { key: 'email', label: 'Email', type: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMsg: 'Enter a valid email' }
  ]
};

const TRAVEL_HISTORY: SectionDef = {
  key: 'travelHistory',
  table: 'travel_history',
  title: 'Travel History',
  icon: '✈️',
  repeatable: true,
  fields: [
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'from_date', label: 'From Date', type: 'date', required: true },
    { key: 'to_date', label: 'To Date', type: 'date', required: true },
    { key: 'reason_for_visit', label: 'Reason for Visit', type: 'select', required: true, options: ['Work, Study or Training', 'Business', 'Visit Family', 'Holiday or Leisure', 'Military Deployment', 'Other'] }
  ]
};

const RESIDENT_HISTORY: SectionDef = {
  key: 'residentHistory',
  table: 'resident_history',
  title: 'Resident History',
  icon: '🏠',
  repeatable: true,
  fields: [
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'address_from', label: 'Address From', type: 'date', required: true },
    { key: 'address_to', label: 'Address To (leave blank if current)', type: 'date' }
  ]
};

const IDENTIFICATION_DOCUMENTS: SectionDef = {
  key: 'identificationDocuments',
  table: 'identification_documents',
  title: 'National Identification Documents',
  icon: '🪪',
  repeatable: true,
  fields: [
    { key: 'document_type', label: 'Document Type', type: 'select', required: true, options: ['Aadhar Card', 'Birth Certificate', 'Marriage Certificate', 'Driving Licence'] },
    { key: 'name_as_per_document', label: 'Name as Per Document', type: 'text', required: true },
    { key: 'identification_no', label: 'Identification No', type: 'text', required: true },
    { key: 'issue_country', label: 'Issue Country', type: 'text', required: true }
  ]
};

const EDUCATION_QUALIFICATIONS: SectionDef = {
  key: 'educationQualifications',
  table: 'education_qualifications',
  title: 'Education Qualifications',
  icon: '📚',
  repeatable: true,
  fields: [
    { key: 'qualification', label: 'Qualification', type: 'select', required: true, options: [
      'Doctoral Degree in Science, Business or Technology', 'Doctoral Degree (Other)',
      'Master Degree in Science, Business or Technology', 'Master Degree (Other)',
      'Honours Degree in Science, Business or Technology', 'Honours Degree (Other)',
      'Bachelor Degree in Science, Business or Technology', 'Bachelor Degree (Other)',
      'Graduate Diploma', 'Advance Diploma', 'Associate Degree', 'Diploma',
      'AQF Certificate IV', 'AQF Certificate III', 'Certificate III (Non-AQF)',
      'Senior Secondary School Certificate', 'Other - Non AQF Accreditation', 'Other'
    ]},
    { key: 'university_college_name', label: 'University/College Name', type: 'text', required: true },
    { key: 'course_name', label: 'Course Name', type: 'text', required: true },
    { key: 'from_date', label: 'From Date', type: 'date', required: true },
    { key: 'to_date', label: 'To Date', type: 'date' }
  ]
};

const EMPLOYMENT_HISTORY: SectionDef = {
  key: 'employmentHistory',
  table: 'employment_history',
  title: 'Employment History',
  icon: '💼',
  repeatable: true,
  fields: [
    { key: 'position', label: 'Position', type: 'text', required: true },
    { key: 'duty', label: 'Duty (Write only one)', type: 'text', required: true },
    { key: 'employer_name', label: 'Employer (Company Name)', type: 'text', required: true },
    { key: 'employer_abn', label: 'Employer ABN No (If Applicable)', type: 'text' },
    { key: 'contact_person_name', label: 'Contact Person Full Name', type: 'text' },
    { key: 'contact_no', label: 'Contact No', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
    { key: 'work_location', label: 'Work Location (Address)', type: 'text', required: true },
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'from_date', label: 'From Date', type: 'date', required: true },
    { key: 'to_date', label: 'To Date (blank if current)', type: 'date' }
  ]
};

const SPONSOR_DETAILS: SectionDef = {
  key: 'sponsorDetails',
  table: 'sponsor_details',
  title: 'Sponsor Details (If Applicable)',
  icon: '🤝',
  repeatable: true,
  fields: [
    { key: 'family_name', label: 'Family Name', type: 'text', required: true },
    { key: 'given_name', label: 'Given Name (As per Passport)', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternMsg: 'Enter a valid email' },
    { key: 'mobile_no', label: 'Mobile No', type: 'tel', pattern: '^[0-9+\\-\\s()]{6,20}$', patternMsg: 'Enter a valid phone number' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'australian_residency_status', label: 'Australian Residency Status', type: 'select', options: [
      'Australian Citizen', 'Australian Permanent Resident',
      'Australian Temporary Resident (Student)', 'Australian Temporary Resident (Visitor)',
      'Australian Temporary Resident (Work Visa)', 'Other', 'Unknown'
    ]},
    { key: 'relationship_to_applicant', label: 'Relationship to the Applicant', type: 'select', options: [
      'Aunt', 'Brother', 'Business Associate', 'Child', 'Cousin', 'Daughter',
      'Daughter/Son-in-Law', 'Fiance/Fiancee', 'Grand Child', 'Grand Parent',
      'Mother/Father-in-Law', 'Nephew', 'Niece', 'Other', 'Parent', 'Sister',
      'Sister/Brother-in-Law', 'Son'
    ]}
  ]
};

const TEST_CERTIFICATIONS: SectionDef = {
  key: 'testCertifications',
  table: 'test_certifications',
  title: 'Test & Certifications',
  icon: '📝',
  repeatable: true,
  fields: [
    { key: 'category', label: 'Category', type: 'select', required: true, options: ['English Test', 'NAATI', 'Professional Year'] },
    { key: 'english_test_name', label: 'Test Name', type: 'select', options: ['CAE', 'PTE', 'TOEFL', 'IELTS', 'OET'] },
    { key: 'english_test_country', label: 'Test Country', type: 'text' },
    { key: 'english_test_reference_no', label: 'Test Reference No', type: 'text' },
    { key: 'english_test_date', label: 'Test Date', type: 'date' },
    { key: 'english_expiry_date', label: 'Test Expiry Date', type: 'date' },
    { key: 'listening_score', label: 'Listening Band Score', type: 'number' },
    { key: 'reading_score', label: 'Reading Band Score', type: 'number' },
    { key: 'writing_score', label: 'Writing Band Score', type: 'number' },
    { key: 'speaking_score', label: 'Speaking Band Score', type: 'number' },
    { key: 'overall_score', label: 'Overall Band Score', type: 'number' },
    { key: 'naati_test_type', label: 'NAATI Test Type', type: 'text' },
    { key: 'naati_test_reference_no', label: 'NAATI Reference No.', type: 'text' },
    { key: 'naati_test_date', label: 'NAATI Test Date', type: 'date' },
    { key: 'naati_expiry_date', label: 'NAATI Expiry Date', type: 'date' },
    { key: 'py_name', label: 'PY', type: 'select', options: ['Engineering', 'Accountant', 'IT'] },
    { key: 'py_completion_date', label: 'PY Completion Date', type: 'date' },
    { key: 'py_expiry_date', label: 'PY Expiry Date', type: 'date' }
  ]
};

const AUSTRALIAN_VISA_HISTORY: SectionDef = {
  key: 'australianVisaHistory',
  table: 'australian_visa_history',
  title: 'Australian Visa History (If Applicable)',
  icon: '🛂',
  repeatable: true,
  fields: [
    { key: 'visa_subclass', label: 'Visa SC', type: 'text', required: true },
    { key: 'trn_no', label: 'TRN No', type: 'text' },
    { key: 'visa_grant_number', label: 'Visa Grant Number', type: 'text' },
    { key: 'visa_grant_or_refusal_date', label: 'Visa Grant/Refusal Date', type: 'date', required: true },
    { key: 'visa_expiry_date', label: 'Visa Expiry Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'select', required: true, options: ['Grant', 'Pending', 'Withdraw', 'Refusal'] }
  ]
};

const OTHER_COUNTRY_VISA_HISTORY: SectionDef = {
  key: 'otherCountryVisaHistory',
  table: 'other_country_visa_history',
  title: 'Other Country Visa History (If Applicable)',
  icon: '🌍',
  repeatable: true,
  fields: [
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'visa_type', label: 'Visa Type', type: 'text', required: true },
    { key: 'visa_grant_or_refusal_date', label: 'Visa Grant/Refusal Date', type: 'date', required: true },
    { key: 'visa_expiry_date', label: 'Visa Expiry Date', type: 'date' }
  ]
};

const VISA_REFUSAL_HISTORY: SectionDef = {
  key: 'visaRefusalHistory',
  table: 'visa_refusal_history',
  title: 'Refusal Visa History (Last 10 Years)',
  icon: '❌',
  repeatable: true,
  fields: [
    { key: 'country', label: 'Country', type: 'text', required: true },
    { key: 'visa_type', label: 'Visa Type', type: 'select', required: true, options: ['GSM Visa', 'Student Visa', 'Visitor Visa', 'TR Visa', 'ES Visa'] },
    { key: 'refusal_date', label: 'Refusal Date', type: 'date', required: true }
  ]
};

const HEALTH_INSURANCE: SectionDef = {
  key: 'healthInsurance',
  table: 'health_insurance',
  title: 'Health Insurance',
  icon: '🏥',
  repeatable: true,
  fields: [
    { key: 'insurance_type', label: 'Insurance Type', type: 'select', required: true, options: ['OSHC', 'OVHC'] },
    { key: 'insurer_name', label: 'Name of Health Insurer', type: 'text', required: true },
    { key: 'policy_number', label: 'Policy Number', type: 'text', required: true },
    { key: 'from_date', label: 'From Date', type: 'date', required: true },
    { key: 'to_date', label: 'To Date', type: 'date' }
  ]
};

const COE_HISTORY: SectionDef = {
  key: 'coeHistory',
  table: 'coe_history',
  title: 'Australian CoE History',
  icon: '🏛️',
  repeatable: true,
  fields: [
    { key: 'coe_code', label: 'CoE Code', type: 'text', required: true },
    { key: 'cricos_code', label: 'CRICOS Code', type: 'text', required: true },
    { key: 'university_name', label: 'University/College Name', type: 'text', required: true },
    { key: 'course_name', label: 'Course Name', type: 'text', required: true },
    { key: 'state', label: 'State', type: 'text', required: true },
    { key: 'from_date', label: 'From Date', type: 'date', required: true },
    { key: 'to_date', label: 'To Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'select', required: true, options: ['Enroll', 'Completed', 'Future', 'Withdraw', 'Cancel', 'Differ Intake'] },
    { key: 'coe_document_url', label: 'COE Document URL', type: 'text' }
  ]
};

const SKILL_ASSESSMENT: SectionDef = {
  key: 'skillAssessment',
  table: 'skill_assessment',
  title: 'Skill Assessment',
  icon: '🎯',
  repeatable: true,
  fields: [
    { key: 'occupation_name', label: 'Occupation Name', type: 'text', required: true },
    { key: 'anzsco_code', label: 'ANZSCO Code', type: 'text', required: true },
    { key: 'assessing_authority', label: 'Assessing Authority', type: 'text', required: true },
    { key: 'reference_number', label: 'Ref/Receipt', type: 'text' },
    { key: 'assessment_date', label: 'Skill Ass. Date', type: 'date', required: true },
    { key: 'expiry_date', label: 'Skill Ass. Expiry', type: 'date' }
  ]
};

// =============================================
// FLAT SECTIONS ARRAY (for data loading)
// =============================================

export const APP_SECTIONS: SectionDef[] = [
  VISA_APPLICATION, STUDENT_DETAILS, FAMILY_MEMBERS, RELATIVES_AUSTRALIA,
  TRAVEL_HISTORY, RESIDENT_HISTORY, IDENTIFICATION_DOCUMENTS, EDUCATION_QUALIFICATIONS,
  EMPLOYMENT_HISTORY, SPONSOR_DETAILS, TEST_CERTIFICATIONS, AUSTRALIAN_VISA_HISTORY,
  OTHER_COUNTRY_VISA_HISTORY, VISA_REFUSAL_HISTORY, HEALTH_INSURANCE, COE_HISTORY, SKILL_ASSESSMENT
];

// =============================================
// TABS — grouping sections into CRM-style tabs
// =============================================

export const APP_TABS: TabDef[] = [
  { key: 'basicDetails', title: 'Basic Details', sections: [VISA_APPLICATION] },
  { key: 'studentDetails', title: 'Student Details', sections: [STUDENT_DETAILS] },
  { key: 'familyDetails', title: 'Family Details', sections: [FAMILY_MEMBERS, RELATIVES_AUSTRALIA] },
  { key: 'travelResident', title: 'Travel & Resident History', sections: [TRAVEL_HISTORY, RESIDENT_HISTORY] },
  { key: 'docEducation', title: 'Document & Education', sections: [IDENTIFICATION_DOCUMENTS, EDUCATION_QUALIFICATIONS] },
  { key: 'employment', title: 'Employment History', sections: [EMPLOYMENT_HISTORY] },
  { key: 'sponsor', title: 'Sponsor Details', sections: [SPONSOR_DETAILS] },
  { key: 'testDetails', title: 'Test Details', sections: [TEST_CERTIFICATIONS] },
  { key: 'visaHistory', title: 'Visa History', sections: [AUSTRALIAN_VISA_HISTORY, OTHER_COUNTRY_VISA_HISTORY, VISA_REFUSAL_HISTORY] },
  { key: 'healthInsurance', title: 'Health Insurance', sections: [HEALTH_INSURANCE] },
  { key: 'coeHistory', title: 'CoE History', sections: [COE_HISTORY] },
  { key: 'skillAssessment', title: 'Skill Assessment', sections: [SKILL_ASSESSMENT] }
];

export const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
] as const;

export const BOOL_SELECT_OPTIONS = ['Yes', 'No'];
