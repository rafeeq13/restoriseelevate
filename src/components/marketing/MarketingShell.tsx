import { getFooter, getNavigation, getSiteSettings } from "@/lib/siteData";
import { CookieConsent } from "./CookieConsent";
import { LeadCaptureModal } from "./LeadCaptureModal";
import { PageIntro } from "./PageIntro";
import { ScrollProgress } from "./ScrollProgress";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export async function MarketingShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [settings, navigation, footer] = await Promise.all([
    getSiteSettings(locale),
    getNavigation(locale),
    getFooter(locale),
  ]);

  return (
    <>
      <PageIntro />
      <ScrollProgress />
      <SiteHeader settings={settings} navigation={navigation} />
      <main id="main" className="lux-page flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} footer={footer} />
      <LeadCaptureModal />
      <CookieConsent />
    </>
  );
}
