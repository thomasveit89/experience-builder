import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function RootPage() {
  // Redirect to the default locale (landing page or dashboard based on auth)
  redirect(`/${defaultLocale}`);
}
