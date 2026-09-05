import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ChartLine, p as BookMarked, s as Layers, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as useTuition } from "./router-Di6qwOvu.mjs";
import { i as Input, r as Field, t as Button } from "./ui-FzJS744L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-vAC51qLl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MorePage() {
	const institute = useTuition((s) => s.institute);
	const setInstitute = useTuition((s) => s.setInstitute);
	const [name, setName] = (0, import_react.useState)(institute);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-4 text-xl font-semibold",
				children: "More"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mb-6 space-y-3 rounded-xl bg-surface p-4 ring-1 ring-border",
				onSubmit: (e) => {
					e.preventDefault();
					setInstitute(name.trim() || "My Tuition");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tuition name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Save name"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: [
					{
						to: "/batches",
						label: "Batches",
						hint: "Classes and groups",
						icon: Layers
					},
					{
						to: "/marks",
						label: "Marks",
						hint: "Tests and scores",
						icon: BookMarked
					},
					{
						to: "/reports",
						label: "Reports",
						hint: "Fees and attendance",
						icon: ChartLine
					}
				].map((it) => {
					const Icon = it.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: it.to,
						className: "flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: it.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: it.hint
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-subtle" })
						]
					}) }, it.to);
				})
			})
		]
	});
}
//#endregion
export { MorePage as component };
