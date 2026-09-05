import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useTuition, l as todayISO, o as cn } from "./router-Di6qwOvu.mjs";
import { a as Select, t as Button } from "./ui-FzJS744L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-DrktGliA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AttendancePage() {
	const batches = useTuition((s) => s.batches);
	const students = useTuition((s) => s.students);
	const attendance = useTuition((s) => s.attendance);
	const saveAttendance = useTuition((s) => s.saveAttendance);
	const [batchId, setBatchId] = (0, import_react.useState)(batches[0]?.id ?? "");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [saved, setSaved] = (0, import_react.useState)(false);
	const batchStudents = (0, import_react.useMemo)(() => students.filter((s) => s.batchId === batchId).sort((a, b) => a.name.localeCompare(b.name)), [students, batchId]);
	const existingKey = `${batchId}|${date}|${attendance.filter((a) => a.batchId === batchId && a.date === date).map((a) => `${a.studentId}:${a.status}`).join(",")}`;
	const [rows, setRows] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const next = {};
		for (const a of attendance) if (a.batchId === batchId && a.date === date) next[a.studentId] = a.status;
		setRows(next);
		setSaved(false);
	}, [existingKey]);
	function setStatus(id, status) {
		setRows((r) => ({
			...r,
			[id]: status
		}));
		setSaved(false);
	}
	const allMarked = batchStudents.length > 0 && batchStudents.every((s) => rows[s.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-3 text-xl font-semibold",
				children: "Attendance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: batchId,
					onChange: (e) => setBatchId(e.target.value),
					children: batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: b.id,
						children: b.name
					}, b.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: "h-11 w-full rounded-md bg-surface px-3 text-base ring-1 ring-border"
				})]
			}),
			batchStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No students in this batch."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: batchStudents.map((s) => {
					const st = rows[s.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-3 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setStatus(s.id, "present"),
								className: cn("h-11 min-w-20 rounded-md text-sm font-medium ring-1", st === "present" ? "bg-success text-success-fg ring-success" : "bg-bg text-muted ring-border"),
								children: "Present"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setStatus(s.id, "absent"),
								className: cn("h-11 min-w-20 rounded-md text-sm font-medium ring-1", st === "absent" ? "bg-danger text-danger-fg ring-danger" : "bg-bg text-muted ring-border"),
								children: "Absent"
							})]
						})]
					}, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: !allMarked,
					onClick: () => {
						saveAttendance(batchId, date, batchStudents.map((s) => ({
							studentId: s.id,
							status: rows[s.id]
						})));
						setSaved(true);
					},
					children: saved ? "Saved" : "Save attendance"
				}), !allMarked && batchStudents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-xs text-muted",
					children: "Mark every student, then save."
				})]
			})
		]
	});
}
//#endregion
export { AttendancePage as component };
