import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus } from "../_libs/lucide-react.mjs";
import { a as useTuition, s as inr } from "./router-Di6qwOvu.mjs";
import { i as Input, r as Field, t as Button } from "./ui-FzJS744L.mjs";
import { t as Sheet } from "./sheet-B1UaSMOC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/batches-DbFTIWeH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BatchesPage() {
	const batches = useTuition((s) => s.batches);
	const students = useTuition((s) => s.students);
	const addBatch = useTuition((s) => s.addBatch);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Batches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
				})]
			}),
			batches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted",
				children: "No batches yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: batches.map((b) => {
					const count = students.filter((s) => s.batchId === b.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/batches/$batchId",
						params: { batchId: b.id },
						className: "block rounded-xl bg-surface px-4 py-3 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: b.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								count,
								" students · ",
								inr(b.monthlyFee),
								" / month"
							]
						})]
					}) }, b.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: "Add batch",
				open,
				onClose: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBatchForm, { onSave: (data) => {
					addBatch(data);
					setOpen(false);
				} })
			})
		]
	});
}
function AddBatchForm({ onSave }) {
	const [name, setName] = (0, import_react.useState)("");
	const [className, setClassName] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [fee, setFee] = (0, import_react.useState)("1500");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSave({
				name: name.trim() || `Class ${className} ${subject}`.trim(),
				className: className.trim(),
				subject: subject.trim(),
				monthlyFee: Number(fee) || 0
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Batch name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "Class 10 Maths",
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Class",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "10",
					value: className,
					onChange: (e) => setClassName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Subject",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Maths",
					value: subject,
					onChange: (e) => setSubject(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Default monthly fee (₹)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: fee,
					onChange: (e) => setFee(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				type: "submit",
				disabled: !name.trim(),
				children: "Save batch"
			})
		]
	});
}
//#endregion
export { BatchesPage as component };
