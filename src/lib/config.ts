import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import type { I18nConfig } from '@/types/i18n';

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    favicon: string;
    last_updated?: string;
  };
  author: {
    name: string;
    title: string;
    institution: string;
    avatar: string;
  };
  social: {
    email?: string;
    location?: string;
    location_url?: string;
    location_details?: string[];
    google_scholar?: string;
    orcid?: string;
    github?: string;
    linkedin?: string;
    [key: string]: string | string[] | undefined;
  };
  features: {
    enable_likes: boolean;
    enable_one_page_mode?: boolean;
  };
  navigation: Array<{
    title: string;
    type: 'section' | 'page' | 'link';
    target: string;
    href: string;
  }>;
  sections?: Array<{
    id: string;
    type: 'markdown' | 'publications' | 'list' | 'cards';
    source?: string;
    title?: string;
    filter?: string;
    limit?: number;
  }>;
  i18n?: I18nConfig;
}

const DEFAULT_CONTENT_DIR = 'content';

function getGitHubPagesBasePath(): string {
  const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

  if (!isGitHubActions || !repositoryOwner || !repositoryName) {
    return '';
  }

  return repositoryName === `${repositoryOwner}.github.io` ? '' : `/${repositoryName}`;
}

function prefixPublicAssetPath(value?: string): string | undefined {
  const basePath = getGitHubPagesBasePath();

  if (!value || !basePath || !value.startsWith('/') || value.startsWith(`${basePath}/`)) {
    return value;
  }

  return `${basePath}${value}`;
}

function withRuntimeAssetPaths(config: SiteConfig): SiteConfig {
  return {
    ...config,
    site: {
      ...config.site,
      favicon: prefixPublicAssetPath(config.site.favicon) || config.site.favicon,
    },
    author: {
      ...config.author,
      avatar: prefixPublicAssetPath(config.author.avatar) || config.author.avatar,
    },
  };
}

function normalizeLocale(locale: string): string {
  return locale.trim().replace('_', '-').toLowerCase();
}

function readConfigFromPath(configPath: string): Partial<SiteConfig> | null {
  try {
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    return parse(fileContent) as unknown as Partial<SiteConfig>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function mergeConfig(base: SiteConfig, localized?: Partial<SiteConfig> | null): SiteConfig {
  if (!localized) return base;

  return {
    ...base,
    site: {
      ...base.site,
      ...(localized.site || {}),
    },
    author: {
      ...base.author,
      ...(localized.author || {}),
    },
    social: {
      ...base.social,
      ...(localized.social || {}),
    },
    features: base.features,
    navigation: localized.navigation || base.navigation,
    sections: localized.sections || base.sections,
    // i18n is always sourced from default content/config.toml
    i18n: base.i18n,
  };
}

function getDefaultConfig(): SiteConfig {
  const defaultPath = path.join(process.cwd(), DEFAULT_CONTENT_DIR, 'config.toml');
  const parsed = readConfigFromPath(defaultPath);

  if (!parsed) {
    throw new Error('Failed to load content/config.toml');
  }

  return parsed as SiteConfig;
}

export function getConfig(locale?: string): SiteConfig {
  try {
    const baseConfig = getDefaultConfig();

    if (!locale) {
      return withRuntimeAssetPaths(baseConfig);
    }

    const normalizedLocale = normalizeLocale(locale);
    const localizedPath = path.join(process.cwd(), `${DEFAULT_CONTENT_DIR}_${normalizedLocale}`, 'config.toml');
    const localizedConfig = readConfigFromPath(localizedPath);

    return withRuntimeAssetPaths(mergeConfig(baseConfig, localizedConfig));
  } catch (error) {
    console.error('Error loading config:', error);
    throw new Error('Failed to load configuration');
  }
}
