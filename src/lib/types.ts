export type PayMode = "cash" | "upi" | "bank";
export type AttendStatus = "present" | "absent";

export type Batch = {
  id: string;
  name: string;
  className: string;
  subject: string;
  monthlyFee: number;
};

export type TeacherProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  instituteName: string;
  subjects: string[]; // e.g. ["Maths", "Science", "English", "Physics"]
  role: string; // e.g. "Institute Owner" | "Senior Faculty" | "Subject Teacher"
};

export type Student = {
  id: string;
  name: string;
  parentName: string;
  parentPhone: string;
  studentPhone?: string; // Optional student phone number
  batchId: string;
  monthlyFee: number;
  dueAmount: number;
  joinedAt: string;
};

export type Attendance = {
  id: string;
  studentId: string;
  batchId: string;
  date: string;
  status: AttendStatus;
  markedByTeacherId?: string;
};

export type Payment = {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  mode: PayMode;
};

export type Test = {
  id: string;
  batchId: string;
  name: string;
  maxMarks: number;
  date: string;
  createdById?: string;
};

export type Mark = {
  id: string;
  testId: string;
  studentId: string;
  score: number;
};

export type QuestionPaper = {
  id: string;
  title: string;
  subject: string;
  batchId: string;
  fileUrl: string;
  notes?: string;
  createdAt: string;
};

