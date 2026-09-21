import { NextResponse } from "next/server";

/**
 * Digital Asset Links: the site's half of the handshake with the Android app.
 *
 * A Trusted Web Activity only runs without an address bar if the site names
 * the app that is allowed to present it, by package and by the SHA-256 of
 * the key it was signed with. Without this file the app still opens, but
 * with a browser bar across the top — which is exactly the thing the native
 * shell exists to remove.
 *
 * Served from a route rather than public/.well-known so the fingerprint can
 * come from the environment: Play re-signs uploaded bundles with its own
 * key, and that key's fingerprint has to be added here before the Store
 * build will verify.
 */
export const dynamic = "force-static";

// Set ANDROID_CERT_FINGERPRINT to the SHA-256 of this app's own upload key
// once a keystore exists. There is deliberately no default: a fingerprint
// from another project's keystore can never verify this app, and shipping
// one only produces a TWA that silently falls back to a browser bar.
const DEV_FINGERPRINT = "";

export function GET() {
  const fingerprints = [
    process.env.ANDROID_CERT_FINGERPRINT || DEV_FINGERPRINT,
    // Play App Signing re-signs the bundle, so the Store's own fingerprint
    // has to be listed too once the app is uploaded.
    process.env.ANDROID_PLAY_CERT_FINGERPRINT,
  ].filter(Boolean) as string[];

  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name:
            process.env.ANDROID_PACKAGE_NAME || "org.iitmaa.sangam.twa",
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ],
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}
