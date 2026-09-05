import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useTuition, l as todayISO, s as inr } from "./router-Di6qwOvu.mjs";
import { n as Card } from "./ui-FzJS744L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-ByIEdEyb.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const students = useTuition((s) => s.students);
	const payments = useTuition((s) => s.payments);
	const attendance = useTuition((s) => s.attendance);
	const month = todayISO().slice(0, 7);
	const monthPay = payments.filter((p) => p.date.startsWith(month)).reduce((a, p) => a + p.amount, 0);
	const pending = students.reduce((a, s) => a + s.dueAmount, 0);
	const monthAtt = attendance.filter((a) => a.date.startsWith(month));
	const present = monthAtt.filter((a) => a.status === "present").length;
	const pct = monthAtt.length ? Math.round(present / monthAtt.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Reports"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "This month collection"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xl font-semibold tabular-nums",
				children: inr(monthPay)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Total pending"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xl font-semibold tabular-nums text-danger",
				children: inr(pending)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Attendance this month"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-2xl font-semibold tabular-nums",
					children: [pct, "%"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						present,
						" present of ",
						monthAtt.length,
						" marks"
					]
				})
			] })
		]
	});
}
//#endregion
export { ReportsPage as component };
