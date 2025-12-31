import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to dashboard if logged in
  if (user) {
    redirect(`/${locale}/dashboard`);
  }

  // Show landing page for guests
  return <LandingPage locale={locale} />;
}
