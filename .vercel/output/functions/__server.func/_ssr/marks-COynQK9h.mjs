import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus } from "../_libs/lucide-react.mjs";
import { a as useTuition, c as prettyDate, l as todayISO } from "./router-Di6qwOvu.mjs";
import { a as Select, i as Input, r as Field, t as Button } from "./ui-FzJS744L.mjs";
import { t as Sheet } from "./sheet-B1UaSMOC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marks-COynQK9h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarksPage() {
	const batches = useTuition((s) => s.batches);
	const students = useTuition((s) => s.students);
	const tests = useTuition((s) => s.tests);
	const marks = useTuition((s) => s.marks);
	const addTest = useTuition((s) => s.addTest);
	const saveMarks = useTuition((s) => s.saveMarks);
	const [batchId, setBatchId] = (0, import_react.useState)(batches[0]?.id ?? "");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(null);
	const batchTests = (0, import_react.useMemo)(() => tests.filter((t) => t.batchId === batchId), [tests, batchId]);
	const batchStudents = students.filter((s) => s.batchId === batchId);
	const test = tests.find((t) => t.id === active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Marks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Test"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
				className: "mb-4",
				value: batchId,
				onChange: (e) => setBatchId(e.target.value),
				children: batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: b.id,
					children: b.name
				}, b.id))
			}),
			batchTests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted",
				children: "No tests yet. Add one."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: batchTests.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(t.id),
					className: "flex w-full items-center justify-between rounded-xl bg-surface px-4 py-3 text-left ring-1 ring-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: t.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted",
						children: [
							prettyDate(t.date),
							" · ",
							t.maxMarks,
							" marks"
						]
					})] })
				}) }, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: "New test",
				open,
				onClose: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewTestForm, {
					batchId,
					onSave: (data) => {
						addTest(data);
						setOpen(false);
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: test?.name ?? "Enter marks",
				open: !!test,
				onClose: () => setActive(null),
				children: test && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarksForm, {
					max: test.maxMarks,
					students: batchStudents,
					initial: Object.fromEntries(marks.filter((m) => m.testId === test.id).map((m) => [m.studentId, String(m.score)])),
					onSave: (rows) => {
						saveMarks(test.id, rows);
						setActive(null);
					}
				})
			})
		]
	});
}
function NewTestForm({ batchId, onSave }) {
	const [name, setName] = (0, import_react.useState)("");
	const [max, setMax] = (0, import_react.useState)("40");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSave({
				batchId,
				name: name.trim(),
				maxMarks: Number(max) || 0,
				date
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Test name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "Unit Test 1",
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Max marks",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: max,
					onChange: (e) => setMax(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Date",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				type: "submit",
				disabled: !name.trim(),
				children: "Save test"
			})
		]
	});
}
function MarksForm({ max, students, initial, onSave }) {
	const [scores, setScores] = (0, import_react.useState)(initial);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			e.preventDefault();
			onSave(students.map((s) => ({
				studentId: s.id,
				score: Math.min(max, Math.max(0, Number(scores[s.id]) || 0))
			})));
		},
		children: [
			students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-sm font-medium",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "w-20 text-center",
					inputMode: "numeric",
					value: scores[s.id] ?? "",
					onChange: (e) => setScores((x) => ({
						...x,
						[s.id]: e.target.value
					}))
				})]
			}, s.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["Out of ", max]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				type: "submit",
				children: "Save marks"
			})
		]
	});
}
//#endregion
export { MarksPage as component };
