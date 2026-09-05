import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, l as ClipboardCheck, n as Wallet, r as Users } from "../_libs/lucide-react.mjs";
import { a as useTuition, c as prettyDate, l as todayISO, s as inr } from "./router-Di6qwOvu.mjs";
import { n as Card } from "./ui-FzJS744L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C4c0Hh0I.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const students = useTuition((s) => s.students);
	const payments = useTuition((s) => s.payments);
	const today = todayISO();
	const todayTotal = payments.filter((p) => p.date === today).reduce((a, p) => a + p.amount, 0);
	const pending = students.reduce((a, s) => a + s.dueAmount, 0);
	const dueCount = students.filter((s) => s.dueAmount > 0).length;
	const recent = payments.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "Today collection"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl font-semibold tabular-nums tracking-tight",
						children: inr(todayTotal)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted",
							children: "Pending fees"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-semibold tabular-nums tracking-tight text-danger",
							children: inr(pending)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [dueCount, " students"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/attendance",
						className: "flex min-h-20 flex-col justify-between rounded-xl bg-primary p-4 text-primary-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Mark attendance"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/fees",
						className: "flex min-h-20 flex-col justify-between rounded-xl bg-surface p-4 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Collect fee"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/students",
						search: { add: true },
						className: "flex min-h-20 flex-col justify-between rounded-xl bg-surface p-4 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Add student"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/students",
						className: "flex min-h-20 flex-col justify-between rounded-xl bg-surface p-4 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-semibold",
							children: [students.length, " students"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold text-muted",
				children: "Recent payments"
			}), recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No payments yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: recent.map((p) => {
					const st = students.find((s) => s.id === p.studentId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-lg bg-surface px-3 py-3 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: st?.name ?? "Student"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								prettyDate(p.date),
								" · ",
								p.mode.toUpperCase()
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tabular-nums",
							children: inr(p.amount)
						})]
					}, p.id);
				})
			})] })
		]
	});
}
//#endregion
export { Home as component };
