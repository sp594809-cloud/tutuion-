import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus } from "../_libs/lucide-react.mjs";
import { a as useTuition, i as Route$2, l as todayISO, s as inr } from "./router-Di6qwOvu.mjs";
import { a as Select, i as Input, r as Field, t as Button } from "./ui-FzJS744L.mjs";
import { t as Sheet } from "./sheet-B1UaSMOC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-Cyf7kG7g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentsPage() {
	const { add } = Route$2.useSearch();
	const navigate = useNavigate();
	const students = useTuition((s) => s.students);
	const batches = useTuition((s) => s.batches);
	const addStudent = useTuition((s) => s.addStudent);
	const [q, setQ] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => {
		const t = q.trim().toLowerCase();
		return students.filter((s) => !t || s.name.toLowerCase().includes(t) || s.parentPhone.includes(t)).slice().sort((a, b) => a.name.localeCompare(b.name));
	}, [students, q]);
	function closeSheet() {
		navigate({
			to: "/students",
			search: {}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Students"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "min-h-11",
					onClick: () => void navigate({
						to: "/students",
						search: { add: true }
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search name or phone",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "mb-3"
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-muted",
				children: "No students yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: list.map((s) => {
					const batch = batches.find((b) => b.id === s.batchId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/students/$studentId",
						params: { studentId: s.id },
						className: "flex items-center justify-between rounded-xl bg-surface px-4 py-3 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: batch?.name ?? "No batch"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: s.dueAmount > 0 ? "text-sm font-semibold tabular-nums text-danger" : "text-sm font-medium tabular-nums text-success",
							children: s.dueAmount > 0 ? inr(s.dueAmount) : "Paid"
						})]
					}) }, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: "Add student",
				open: !!add,
				onClose: closeSheet,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddStudentForm, { onSave: (data) => {
					addStudent({
						...data,
						joinedAt: todayISO()
					});
					closeSheet();
				} })
			})
		]
	});
}
function AddStudentForm({ onSave }) {
	const batches = useTuition((s) => s.batches);
	const [name, setName] = (0, import_react.useState)("");
	const [parentName, setParentName] = (0, import_react.useState)("");
	const [parentPhone, setParentPhone] = (0, import_react.useState)("");
	const [batchId, setBatchId] = (0, import_react.useState)(batches[0]?.id ?? "");
	const batch = batches.find((b) => b.id === batchId);
	const [fee, setFee] = (0, import_react.useState)(String(batch?.monthlyFee ?? 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			const monthlyFee = Number(fee) || 0;
			onSave({
				name: name.trim(),
				parentName: parentName.trim(),
				parentPhone: parentPhone.trim(),
				batchId,
				monthlyFee,
				dueAmount: monthlyFee
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Student name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Parent name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: parentName,
					onChange: (e) => setParentName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Parent phone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: parentPhone,
					onChange: (e) => setParentPhone(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Batch",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: batchId,
					onChange: (e) => {
						setBatchId(e.target.value);
						const b = batches.find((x) => x.id === e.target.value);
						if (b) setFee(String(b.monthlyFee));
					},
					children: [batches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Add a batch first"
					}), batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: b.id,
						children: b.name
					}, b.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Monthly fee (₹)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: fee,
					onChange: (e) => setFee(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				type: "submit",
				disabled: !name.trim() || !batchId,
				children: "Save student"
			})
		]
	});
}
//#endregion
export { StudentsPage as component };
