ALTER TABLE "StoreSettings" 
ADD COLUMN "siteTitle" TEXT,
ADD COLUMN "metaDescription" TEXT,
ADD COLUMN "ogTitle" TEXT,
ADD COLUMN "ogDescription" TEXT,
ADD COLUMN "ogImageUrl" TEXT,
ADD COLUMN "twitterCardType" TEXT DEFAULT 'summary_large_image',
ADD COLUMN "canonicalUrl" TEXT,
ADD COLUMN "faviconUrl" TEXT,
ADD COLUMN "appleTouchIconUrl" TEXT,
ADD COLUMN "themeColor" TEXT DEFAULT '#111827',
ADD COLUMN "robotsIndex" BOOLEAN DEFAULT true,
ADD COLUMN "robotsFollow" BOOLEAN DEFAULT true,
ADD COLUMN "googleAnalyticsId" TEXT,
ADD COLUMN "googleTagManagerId" TEXT,
ADD COLUMN "facebookVerification" TEXT,
ADD COLUMN "pinterestVerification" TEXT;

