import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useTuition, c as prettyDate, n as Route, s as inr } from "./router-Di6qwOvu.mjs";
import { a as Select, i as Input, r as Field, t as Button } from "./ui-FzJS744L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._studentId-BwssEXYV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentDetail() {
	const { studentId } = Route.useParams();
	const navigate = useNavigate();
	const student = useTuition((s) => s.students.find((x) => x.id === studentId));
	const batches = useTuition((s) => s.batches);
	const payments = useTuition((s) => s.payments.filter((p) => p.studentId === studentId));
	const attendance = useTuition((s) => s.attendance.filter((a) => a.studentId === studentId));
	const tests = useTuition((s) => s.tests);
	const marks = useTuition((s) => s.marks.filter((m) => m.studentId === studentId));
	const collectFee = useTuition((s) => s.collectFee);
	const updateStudent = useTuition((s) => s.updateStudent);
	const deleteStudent = useTuition((s) => s.deleteStudent);
	const [amount, setAmount] = (0, import_react.useState)(student ? String(student.dueAmount || student.monthlyFee) : "");
	const [mode, setMode] = (0, import_react.useState)("cash");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(student?.name ?? "");
	const monthAtt = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		return attendance.filter((a) => a.date.startsWith(prefix));
	}, [attendance]);
	const present = monthAtt.filter((a) => a.status === "present").length;
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 pt-8 text-sm text-muted",
		children: "Student not found."
	});
	const batch = batches.find((b) => b.id === student.batchId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					updateStudent(student.id, { name: name.trim() });
					setEditing(false);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Save"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: student.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: batch?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						student.parentName,
						" · ",
						student.parentPhone || "No phone"
					]
				})
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Due"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold tabular-nums",
						children: inr(student.dueAmount)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "This month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-semibold tabular-nums",
						children: [
							present,
							"/",
							monthAtt.length || 0,
							" present"
						]
					})]
				})]
			}),
			student.dueAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-xl bg-surface p-4 ring-1 ring-border",
				onSubmit: (e) => {
					e.preventDefault();
					collectFee(student.id, Number(amount) || 0, mode);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Collect fee"
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
						type: "submit",
						className: "w-full",
						children: "Save payment"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold text-muted",
				children: "Payments"
			}), payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No payments yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							prettyDate(p.date),
							" · ",
							p.mode.toUpperCase()
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium tabular-nums",
						children: inr(p.amount)
					})]
				}, p.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold text-muted",
				children: "Marks"
			}), marks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No marks yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: marks.map((m) => {
					const t = tests.find((x) => x.id === m.testId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t?.name ?? "Test" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [
								m.score,
								"/",
								t?.maxMarks ?? "—"
							]
						})]
					}, m.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "flex-1",
					onClick: () => setEditing(true),
					children: "Edit name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					className: "flex-1",
					onClick: () => {
						if (window.confirm("Remove this student?")) {
							deleteStudent(student.id);
							navigate({ to: "/students" });
						}
					},
					children: "Delete"
				})]
			})
		]
	});
}
//#endregion
export { StudentDetail as component };
