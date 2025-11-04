module.exports = {

"[project]/.next-internal/server/app/api/profile/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/constants.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BASE_URL": (()=>BASE_URL)
});
const BASE_URL = "https://ensight-backend.onrender.com";
}}),
"[project]/src/app/api/profile/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const token = req.headers.get("authorization");
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Authorization token is required"
            }, {
                status: 401
            });
        }
        // Get FormData from request
        const incomingFormData = await req.formData();
        // Validate required fields
        const firstName = incomingFormData.get("first_name");
        const lastName = incomingFormData.get("last_name");
        const email = incomingFormData.get("email");
        const password = incomingFormData.get("password");
        const role = incomingFormData.get("role");
        const profileImage = incomingFormData.get("profile_image");
        if (!firstName || !lastName || !email || !password || !role) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Missing required fields: first_name, last_name, email, password, role"
            }, {
                status: 400
            });
        }
        // Use native FormData (same pattern as article route which works)
        const formDataToSend = new FormData();
        formDataToSend.append("first_name", firstName);
        formDataToSend.append("last_name", lastName);
        formDataToSend.append("email", email);
        formDataToSend.append("password", password);
        formDataToSend.append("role", role);
        // Handle file upload if present
        if (profileImage && profileImage instanceof File) {
            formDataToSend.append("profile_image", profileImage);
        }
        // Log what we're sending for debugging (remove in production)
        console.log("Creating user:", {
            firstName,
            lastName,
            email,
            role
        });
        let response;
        try {
            response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_URL"]}/profiles/`, {
                method: "POST",
                headers: {
                    Authorization: token
                },
                body: formDataToSend
            });
            console.log("Response status:", response.status, response.statusText);
        } catch (fetchError) {
            console.error("Fetch error:", fetchError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Failed to connect to backend server",
                error: fetchError instanceof Error ? fetchError.message : String(fetchError)
            }, {
                status: 503
            });
        }
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch  {
                errorData = {
                    message: `Server returned ${response.status}`
                };
            }
            // Handle validation errors from FastAPI
            if (response.status === 422 && errorData.detail) {
                const details = Array.isArray(errorData.detail) ? errorData.detail.map((d)=>`${d.loc?.join('.')}: ${d.msg}`).join(', ') : errorData.detail;
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: details || errorData.message || "Validation error"
                }, {
                    status: response.status
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: errorData.detail || errorData.message || "Failed to create profile"
            }, {
                status: response.status
            });
        }
        const createdProfile = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(createdProfile, {
            status: 201
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    try {
        const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_URL"]}/profiles`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.get("authorization") || ""
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: errorData.message || "Failed to fetch profiles"
            }, {
                status: response.status
            });
        }
        const profiles = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(profiles, {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__87e286ec._.js.map