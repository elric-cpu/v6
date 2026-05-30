import { GoogleAuth } from "google-auth-library";

import { company } from "../data/company";

export const searchConsoleScope = "https://www.googleapis.com/auth/webmasters";
export const searchConsoleApiBaseUrl = "https://www.googleapis.com/webmasters/v3";

export interface SearchConsoleAuthClient {
  getAccessToken(): Promise<string | null | undefined>;
}

export type SearchConsoleAuthFactory = (scopes: string[]) => SearchConsoleAuthClient;

export interface SearchConsoleSubmitOptions {
  siteUrl?: string;
  sitemapUrl?: string;
  authFactory?: SearchConsoleAuthFactory;
  fetchImpl?: typeof fetch;
}

export interface SearchConsoleSubmitResult {
  status: number;
  responseText: string;
}

export function getSearchConsolePropertyUrl() {
  return new URL(company.siteUrl).href;
}

export function getLiveSitemapUrl() {
  return new URL("/sitemap.xml", company.siteUrl).href;
}

export function buildSearchConsoleSitemapSubmitUrl(siteUrl: string, sitemapUrl: string) {
  return `${searchConsoleApiBaseUrl}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
}

export function createSearchConsoleAuthClient(scopes: string[] = [searchConsoleScope]) {
  return new GoogleAuth({ scopes });
}

function buildDeniedErrorMessage(status: number, siteUrl: string, details: string) {
  const suffix = details ? ` ${details}` : "";

  return `Search Console sitemap submission was denied with ${status} for ${siteUrl}. Confirm the GitHub Actions identity can access the property and has the ${searchConsoleScope} scope.${suffix}`;
}

function buildFailureMessage(status: number, details: string) {
  return details.length > 0
    ? `Search Console sitemap submission failed with ${status}: ${details}`
    : `Search Console sitemap submission failed with ${status}`;
}

export async function submitSitemapToSearchConsole({
  siteUrl = getSearchConsolePropertyUrl(),
  sitemapUrl = getLiveSitemapUrl(),
  authFactory = createSearchConsoleAuthClient,
  fetchImpl = fetch,
}: SearchConsoleSubmitOptions = {}): Promise<SearchConsoleSubmitResult> {
  const auth = authFactory([searchConsoleScope]);
  const accessToken = await auth.getAccessToken();

  if (!accessToken) {
    throw new Error(
      `Search Console access token unavailable for ${siteUrl}. Confirm the GitHub Actions identity is configured for Application Default Credentials and can access the Search Console property.`,
    );
  }

  const response = await fetchImpl(buildSearchConsoleSitemapSubmitUrl(siteUrl, sitemapUrl), {
    method: "PUT",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const responseText = await response.text().catch(() => "");
  const trimmedResponseText = responseText.trim();

  if (!response.ok) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? buildDeniedErrorMessage(response.status, siteUrl, trimmedResponseText)
        : buildFailureMessage(response.status, trimmedResponseText),
    );
  }

  return {
    status: response.status,
    responseText: responseText,
  };
}
