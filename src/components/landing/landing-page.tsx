'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';

interface LandingPageProps {
  locale: string;
}

export function LandingPage({ locale }: LandingPageProps) {
  const t = useTranslations('landing');

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo/Brand */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/joyo.svg"
              alt="joyo"
              width={200}
              height={80}
              priority
              className="h-16 w-auto sm:h-20 lg:h-24"
            />
          </div>

          {/* Headline */}
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t('hero.headline')}
          </h2>

          {/* Subheadline */}
          <p className="mb-10 text-xl text-gray-600 sm:text-2xl">
            {t('hero.subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-purple-600 text-lg hover:bg-purple-700 sm:w-auto"
            >
              <Link href={`/${locale}/auth/signup`}>
                {t('hero.ctaPrimary')}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToDemo}
              className="w-full text-lg sm:w-auto"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {t('demo.title')}
            </h3>
            <p className="text-lg text-gray-600">
              {t('demo.description')}
            </p>
          </div>

          {/* Demo placeholder - can be replaced with iframe or video */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex aspect-[9/16] max-h-[600px] items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 sm:aspect-video">
              <div className="text-center">
                <div className="mb-4 text-6xl">🎁</div>
                <p className="text-lg text-gray-600">
                  {t('demo.placeholder')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {t('cta.headline')}
          </h3>
          <p className="mb-8 text-xl text-gray-600">
            {t('cta.subheadline')}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-purple-600 text-lg hover:bg-purple-700"
          >
            <Link href={`/${locale}/auth/signup`}>
              {t('cta.button')}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <Image
                src="/joyo.svg"
                alt="joyo"
                width={100}
                height={40}
                className="h-8 w-auto"
              />
              <p className="mt-2 text-sm text-gray-600">
                {t.raw('hero.subheadline')?.toString().split('.')[0]}
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href={`/${locale}/terms`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {t('footer.terms')}
              </Link>
              <Link
                href={`/${locale}/privacy`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {t('footer.privacy')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
