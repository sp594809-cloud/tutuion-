import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as House, f as BookOpen, i as TriangleAlert, l as ClipboardCheck, n as Wallet, o as LayoutGrid, r as Users } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Di6qwOvu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function inr(n) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(n);
}
function prettyDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function seedData() {
	const b1 = "batch-maths";
	const b2 = "batch-science";
	const b3 = "batch-english";
	const ids = {
		rahul: "st-rahul",
		priya: "st-priya",
		aman: "st-aman",
		sneha: "st-sneha",
		arjun: "st-arjun",
		meera: "st-meera",
		kabir: "st-kabir",
		ananya: "st-ananya",
		rohan: "st-rohan"
	};
	const s = (id, name, parent, phone, batchId, fee, due) => ({
		id,
		name,
		parentName: parent,
		parentPhone: phone,
		batchId,
		monthlyFee: fee,
		dueAmount: due,
		joinedAt: "2026-04-01"
	});
	const students = [
		s(ids.rahul, "Rahul Sharma", "Suresh Sharma", "9876543210", b1, 2500, 2500),
		s(ids.priya, "Priya Patel", "Neha Patel", "9876543211", b1, 2500, 0),
		s(ids.aman, "Aman Verma", "Rakesh Verma", "9876543212", b1, 2500, 2500),
		s(ids.sneha, "Sneha Joshi", "Anita Joshi", "9876501111", b2, 1800, 1800),
		s(ids.arjun, "Arjun Singh", "Vikram Singh", "9876502222", b2, 1800, 0),
		s(ids.meera, "Meera Nair", "Lakshmi Nair", "9876503333", b2, 1800, 3600),
		s(ids.kabir, "Kabir Khan", "Imran Khan", "9876504444", b3, 1200, 1200),
		s(ids.ananya, "Ananya Iyer", "Revathi Iyer", "9876505555", b3, 1200, 0),
		s(ids.rohan, "Rohan Desai", "Nitin Desai", "9876506666", b3, 1200, 1200)
	];
	const today = todayISO();
	const y = /* @__PURE__ */ new Date();
	y.setDate(y.getDate() - 1);
	const yest = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
	const attendance = students.map((st) => ({
		id: `att-${st.id}`,
		studentId: st.id,
		batchId: st.batchId,
		date: yest,
		status: st.name === "Meera Nair" || st.name === "Rohan Desai" ? "absent" : "present"
	}));
	const payments = students.filter((st) => st.dueAmount === 0).map((st) => ({
		id: `pay-${st.id}`,
		studentId: st.id,
		amount: st.monthlyFee,
		date: today,
		mode: "upi"
	}));
	const testId = "test-ch5";
	return {
		institute: "Sunrise Tuition",
		batches: [
			{
				id: b1,
				name: "Class 10 Maths",
				className: "10",
				subject: "Maths",
				monthlyFee: 2500
			},
			{
				id: b2,
				name: "Class 9 Science",
				className: "9",
				subject: "Science",
				monthlyFee: 1800
			},
			{
				id: b3,
				name: "Class 8 English",
				className: "8",
				subject: "English",
				monthlyFee: 1200
			}
		],
		students,
		attendance,
		payments,
		tests: [{
			id: testId,
			batchId: b1,
			name: "Chapter 5 Test",
			maxMarks: 40,
			date: yest
		}],
		marks: [
			{
				id: "mk-1",
				testId,
				studentId: ids.rahul,
				score: 34
			},
			{
				id: "mk-2",
				testId,
				studentId: ids.priya,
				score: 38
			},
			{
				id: "mk-3",
				testId,
				studentId: ids.aman,
				score: 29
			}
		]
	};
}
var seeded = seedData();
var useTuition = create()(persist((set, get) => ({
	...seeded,
	setInstitute: (institute) => set({ institute }),
	addBatch: (b) => {
		const id = uid();
		set({ batches: [...get().batches, {
			...b,
			id
		}] });
		return id;
	},
	updateBatch: (id, patch) => set({ batches: get().batches.map((b) => b.id === id ? {
		...b,
		...patch
	} : b) }),
	deleteBatch: (id) => set({
		batches: get().batches.filter((b) => b.id !== id),
		students: get().students.filter((s) => s.batchId !== id)
	}),
	addStudent: (s) => {
		const id = uid();
		set({ students: [...get().students, {
			...s,
			id
		}] });
		return id;
	},
	updateStudent: (id, patch) => set({ students: get().students.map((s) => s.id === id ? {
		...s,
		...patch
	} : s) }),
	deleteStudent: (id) => set({
		students: get().students.filter((s) => s.id !== id),
		attendance: get().attendance.filter((a) => a.studentId !== id),
		payments: get().payments.filter((p) => p.studentId !== id),
		marks: get().marks.filter((m) => m.studentId !== id)
	}),
	saveAttendance: (batchId, date, rows) => {
		const rest = get().attendance.filter((a) => !(a.batchId === batchId && a.date === date));
		const next = rows.map((r) => ({
			id: uid(),
			studentId: r.studentId,
			batchId,
			date,
			status: r.status
		}));
		set({ attendance: [...rest, ...next] });
	},
	collectFee: (studentId, amount, mode, date = todayISO()) => {
		if (!get().students.find((s) => s.id === studentId) || amount <= 0) return;
		set({
			students: get().students.map((s) => s.id === studentId ? {
				...s,
				dueAmount: Math.max(0, s.dueAmount - amount)
			} : s),
			payments: [{
				id: uid(),
				studentId,
				amount,
				date,
				mode
			}, ...get().payments]
		});
	},
	chargeMonth: () => set({ students: get().students.map((s) => ({
		...s,
		dueAmount: s.dueAmount + s.monthlyFee
	})) }),
	addTest: (t) => {
		const id = uid();
		set({ tests: [{
			...t,
			id
		}, ...get().tests] });
		return id;
	},
	saveMarks: (testId, rows) => {
		set({ marks: [...get().marks.filter((m) => m.testId !== testId), ...rows.map((r) => ({
			id: uid(),
			testId,
			studentId: r.studentId,
			score: r.score
		}))] });
	}
}), { name: "tuition-easy-v1" }));
var tabs = [
	{
		to: "/",
		label: "Home",
		icon: House,
		match: (p) => p === "/"
	},
	{
		to: "/students",
		label: "Students",
		icon: Users,
		match: (p) => p.startsWith("/students")
	},
	{
		to: "/attendance",
		label: "Attend",
		icon: ClipboardCheck,
		match: (p) => p.startsWith("/attendance")
	},
	{
		to: "/fees",
		label: "Fees",
		icon: Wallet,
		match: (p) => p.startsWith("/fees")
	},
	{
		to: "/more",
		label: "More",
		icon: LayoutGrid,
		match: (p) => p.startsWith("/more") || p.startsWith("/batches") || p.startsWith("/marks") || p.startsWith("/reports")
	}
];
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const institute = useTuition((s) => s.institute);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-9 items-center justify-center rounded-md bg-primary text-primary-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "TuitionEasy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold leading-tight",
					children: institute || "My Tuition"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-y-auto pb-24",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5",
					children: tabs.map((t) => {
						const active = t.match(pathname);
						const Icon = t.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: t.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-primary" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.8
							}), t.label]
						}) }, t.to);
					})
				})
			})
		]
	});
}
var styles_default = "/assets/styles-C2u5rhmv.css";
var APP_NAME = "TuitionEasy";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Simple tuition class software — students, attendance, fees and marks."
			},
			{
				name: "theme-color",
				content: "#1f4a43"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$9 = () => import("./routes-C4c0Hh0I.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./attendance-DrktGliA.mjs");
var Route$8 = createFileRoute("/attendance")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./batches-DbFTIWeH.mjs");
var Route$7 = createFileRoute("/batches")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./fees-Dp63aFk3.mjs");
var Route$6 = createFileRoute("/fees")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./marks-COynQK9h.mjs");
var Route$5 = createFileRoute("/marks")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./more-vAC51qLl.mjs");
var Route$4 = createFileRoute("/more")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./reports-ByIEdEyb.mjs");
var Route$3 = createFileRoute("/reports")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./students-Cyf7kG7g.mjs");
var Route$2 = createFileRoute("/students")({
	validateSearch: (s) => ({ add: s.add === true || s.add === "true" }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./batches._batchId-DMWq-Pu3.mjs");
var Route$1 = createFileRoute("/batches/$batchId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./students._studentId-BwssEXYV.mjs");
var Route = createFileRoute("/students/$studentId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var AttendanceRoute = Route$8.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => Route$10
});
var BatchesRoute = Route$7.update({
	id: "/batches",
	path: "/batches",
	getParentRoute: () => Route$10
});
var FeesRoute = Route$6.update({
	id: "/fees",
	path: "/fees",
	getParentRoute: () => Route$10
});
var MarksRoute = Route$5.update({
	id: "/marks",
	path: "/marks",
	getParentRoute: () => Route$10
});
var MoreRoute = Route$4.update({
	id: "/more",
	path: "/more",
	getParentRoute: () => Route$10
});
var ReportsRoute = Route$3.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => Route$10
});
var StudentsRoute = Route$2.update({
	id: "/students",
	path: "/students",
	getParentRoute: () => Route$10
});
var BatchesBatchIdRoute = Route$1.update({
	id: "/$batchId",
	path: "/$batchId",
	getParentRoute: () => BatchesRoute
});
var StudentsStudentIdRoute = Route.update({
	id: "/$studentId",
	path: "/$studentId",
	getParentRoute: () => StudentsRoute
});
var BatchesRouteChildren = { BatchesBatchIdRoute };
var BatchesRouteWithChildren = BatchesRoute._addFileChildren(BatchesRouteChildren);
var StudentsRouteChildren = { StudentsStudentIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AttendanceRoute,
	BatchesRoute: BatchesRouteWithChildren,
	FeesRoute,
	MarksRoute,
	MoreRoute,
	ReportsRoute,
	StudentsRoute: StudentsRoute._addFileChildren(StudentsRouteChildren)
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useTuition as a, prettyDate as c, Route$2 as i, todayISO as l, Route as n, cn as o, Route$1 as r, inr as s, router_exports as t };
