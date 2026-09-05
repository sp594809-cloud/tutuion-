import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useTuition, c as prettyDate, l as todayISO, o as cn, s as inr } from "./router-Di6qwOvu.mjs";
import { a as Select, i as Input, r as Field, t as Button } from "./ui-FzJS744L.mjs";
import { t as Sheet } from "./sheet-B1UaSMOC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fees-Dp63aFk3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FeesPage() {
	const students = useTuition((s) => s.students);
	const payments = useTuition((s) => s.payments);
	const collectFee = useTuition((s) => s.collectFee);
	const chargeMonth = useTuition((s) => s.chargeMonth);
	const [tab, setTab] = (0, import_react.useState)("due");
	const [pick, setPick] = (0, import_react.useState)(null);
	const due = (0, import_react.useMemo)(() => students.filter((s) => s.dueAmount > 0).sort((a, b) => b.dueAmount - a.dueAmount), [students]);
	const today = todayISO();
	const collected = payments.filter((p) => p.date === today);
	const todayTotal = collected.reduce((a, p) => a + p.amount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-3 text-xl font-semibold",
				children: "Fees"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 grid grid-cols-2 gap-2 rounded-lg bg-surface p-1 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("h-10 rounded-md text-sm font-medium", tab === "due" ? "bg-primary text-primary-fg" : "text-muted"),
					onClick: () => setTab("due"),
					children: "Due"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("h-10 rounded-md text-sm font-medium", tab === "collected" ? "bg-primary text-primary-fg" : "text-muted"),
					onClick: () => setTab("collected"),
					children: "Collected"
				})]
			}),
			tab === "due" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "mb-3 w-full",
				onClick: () => {
					if (window.confirm("Add this month’s fee to every student due?")) chargeMonth();
				},
				children: "Charge this month"
			}), due.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted",
				children: "No pending fees."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: due.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-xl bg-surface px-4 py-3 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm tabular-nums text-danger",
						children: inr(s.dueAmount)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setPick(s),
						children: "Collect"
					})]
				}, s.id))
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm text-muted",
				children: ["Today · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-fg tabular-nums",
					children: inr(todayTotal)
				})]
			}), collected.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted",
				children: "No collection today."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: collected.map((p) => {
					const st = students.find((s) => s.id === p.studentId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between rounded-xl bg-surface px-4 py-3 text-sm ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [st?.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs text-muted",
							children: [
								prettyDate(p.date),
								" · ",
								p.mode.toUpperCase()
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tabular-nums",
							children: inr(p.amount)
						})]
					}, p.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: "Collect fee",
				open: !!pick,
				onClose: () => setPick(null),
				children: pick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectForm, {
					student: pick,
					onSave: (amount, mode) => {
						collectFee(pick.id, amount, mode);
						setPick(null);
					}
				})
			})
		]
	});
}
function CollectForm({ student, onSave }) {
	const [amount, setAmount] = (0, import_react.useState)(String(student.dueAmount));
	const [mode, setMode] = (0, import_react.useState)("cash");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSave(Number(amount) || 0, mode);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					student.name,
					" · due ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tabular-nums",
						children: inr(student.dueAmount)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Amount (₹)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Mode",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: mode,
					onChange: (e) => setMode(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "cash",
							children: "Cash"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "upi",
							children: "UPI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "bank",
							children: "Bank"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				type: "submit",
				children: "Save payment"
			})
		]
	});
}
//#endregion
export { FeesPage as component };
