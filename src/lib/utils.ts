import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return crypto.randomUUID();
}

export function todayISO() {
  return isoFromDate(new Date());
}

export function isoFromDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoFromDate(d);
}

export function monthKey(iso?: string) {
  return (iso ?? todayISO()).slice(0, 7);
}

export function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Generate WhatsApp direct link for parent / student notifications
export function getWhatsAppLink(phone: string, message: string) {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

// Automated Marks Notification Message Generator
export function generateMarksWhatsApp({
  studentName,
  parentName,
  testName,
  subject,
  score,
  maxMarks,
  date,
  instituteName,
  teacherName,
  teacherPhone,
}: {
  studentName: string;
  parentName?: string;
  testName: string;
  subject?: string;
  score: number;
  maxMarks: number;
  date: string;
  instituteName: string;
  teacherName?: string;
  teacherPhone?: string;
}) {
  const pct = Math.round((score / maxMarks) * 100);
  let grade = "C";
  if (pct >= 90) grade = "A+ (Excellent)";
  else if (pct >= 75) grade = "A (Very Good)";
  else if (pct >= 60) grade = "B (Good)";
  else if (pct >= 50) grade = "C (Satisfactory)";
  else grade = "Needs Improvement";

  return `🎓 *EXAM RESULT REPORT*
----------------------------------------
🏫 *Institute:* ${instituteName}
👤 *Student:* ${studentName} ${parentName ? `(Parent: ${parentName})` : ""}
📝 *Test:* ${testName} ${subject ? `[${subject}]` : ""}
📅 *Date:* ${prettyDate(date)}

📊 *Score:* ${score} / ${maxMarks} (${pct}%)
🎖️ *Performance:* ${grade}
----------------------------------------
👨‍🏫 *Teacher:* ${teacherName || "Institute Admin"} ${teacherPhone ? `(Mo. ${teacherPhone})` : ""}
Thank you!`;
}

// Automated Fee Receipt Message Generator
export function generateFeeReceiptWhatsApp({
  studentName,
  parentName,
  amountPaid,
  mode,
  paymentDate,
  remainingDue,
  instituteName,
  teacherPhone,
}: {
  studentName: string;
  parentName?: string;
  amountPaid: number;
  mode: string;
  paymentDate: string;
  remainingDue: number;
  instituteName: string;
  teacherPhone?: string;
}) {
  return `🧾 *FEE PAYMENT RECEIPT*
----------------------------------------
🏫 *Institute:* ${instituteName}
👤 *Student:* ${studentName} ${parentName ? `(${parentName})` : ""}
💰 *Amount Received:* ${inr(amountPaid)}
💳 *Payment Mode:* ${mode.toUpperCase()}
📅 *Date:* ${prettyDate(paymentDate)}

📌 *Remaining Due Balance:* ${remainingDue > 0 ? inr(remainingDue) : "₹0 (Fully Paid ✓)"}
----------------------------------------
Thank you for your payment! ${teacherPhone ? `Contact: ${teacherPhone}` : ""}`;
}

// Automated Fee Due Reminder Message Generator
export function generateFeeDueWhatsApp({
  studentName,
  parentName,
  dueAmount,
  batchName,
  instituteName,
  teacherPhone,
}: {
  studentName: string;
  parentName?: string;
  dueAmount: number;
  batchName?: string;
  instituteName: string;
  teacherPhone?: string;
}) {
  return `⚠️ *FEE DUE REMINDER*
----------------------------------------
Dear ${parentName || "Parent"},
This is a gentle reminder regarding the pending tuition fee for *${studentName}* ${batchName ? `(${batchName})` : ""} at *${instituteName}*.

💰 *Pending Amount:* ${inr(dueAmount)}

Kindly arrange to clear the dues at your earliest convenience.
----------------------------------------
👨‍🏫 ${teacherPhone ? `Contact: ${teacherPhone}` : instituteName}`;
}

// Automated Attendance Alert Generator
export function generateAttendanceWhatsApp({
  studentName,
  parentName,
  date,
  status,
  batchName,
  instituteName,
}: {
  studentName: string;
  parentName?: string;
  date: string;
  status: "present" | "absent";
  batchName?: string;
  instituteName: string;
}) {
  if (status === "absent") {
    return `🚨 *ABSENT ALERT*
----------------------------------------
Dear ${parentName || "Parent"},
*${studentName}* was marked *ABSENT* today (${prettyDate(date)}) in ${batchName || "class"} at *${instituteName}*.

If you were unaware, please get in touch with us.
----------------------------------------`;
  }
  return `✅ *ATTENDANCE UPDATE*
----------------------------------------
Dear ${parentName || "Parent"},
*${studentName}* was PRESENT today (${prettyDate(date)}) in ${batchName || "class"} at *${instituteName}*.
----------------------------------------`;
}

// Export JSON data to downloadable CSV file
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
