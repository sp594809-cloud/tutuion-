import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn } from "./router-Di6qwOvu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-FzJS744L.js
var import_jsx_runtime = require_jsx_runtime();
function Button({ className, variant = "primary", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-opacity duration-150 active:scale-[0.98] disabled:opacity-40", variant === "primary" && "bg-primary text-primary-fg", variant === "secondary" && "bg-surface text-fg ring-1 ring-border", variant === "ghost" && "bg-transparent text-fg", variant === "danger" && "bg-danger text-danger-fg", variant === "success" && "bg-success text-success-fg", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md bg-bg px-3 text-base text-fg outline-none ring-1 ring-border placeholder:text-subtle focus:ring-2 focus:ring-primary", className),
		...props
	});
}
function Select({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full appearance-none rounded-md bg-bg px-3 text-base text-fg outline-none ring-1 ring-border focus:ring-2 focus:ring-primary", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-sm font-medium text-muted", className),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] ring-1 ring-border", className),
		...props
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children] });
}
//#endregion
export { Select as a, Input as i, Card as n, Field as r, Button as t };
