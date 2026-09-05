import { v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useTuition, r as Route$1, s as inr } from "./router-Di6qwOvu.mjs";
import { t as Button } from "./ui-FzJS744L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/batches._batchId-DMWq-Pu3.js
var import_jsx_runtime = require_jsx_runtime();
function BatchDetail() {
	const { batchId } = Route$1.useParams();
	const navigate = useNavigate();
	const batch = useTuition((s) => s.batches.find((b) => b.id === batchId));
	const students = useTuition((s) => s.students.filter((x) => x.batchId === batchId));
	const deleteBatch = useTuition((s) => s.deleteBatch);
	if (!batch) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 pt-8 text-sm text-muted",
		children: "Batch not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: batch.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-sm text-muted",
				children: [
					"Class ",
					batch.className,
					" · ",
					batch.subject,
					" · ",
					inr(batch.monthlyFee)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold text-muted",
				children: "Students"
			}),
			students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No students in this batch."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/students/$studentId",
					params: { studentId: s.id },
					className: "flex justify-between rounded-xl bg-surface px-4 py-3 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: s.dueAmount > 0 ? "text-sm text-danger tabular-nums" : "text-sm text-success",
						children: s.dueAmount > 0 ? inr(s.dueAmount) : "Paid"
					})]
				}) }, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "danger",
				className: "mt-6 w-full",
				onClick: () => {
					if (window.confirm("Delete this batch and its students?")) {
						deleteBatch(batch.id);
						navigate({ to: "/batches" });
					}
				},
				children: "Delete batch"
			})
		]
	});
}
//#endregion
export { BatchDetail as component };
