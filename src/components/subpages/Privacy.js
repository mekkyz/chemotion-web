'use client';
import useContent from '@/hooks/useContent';
import RichTextRenderer from '@/components/helpers/RichTextRenderer';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

export default function PrivacyPage() {
  const { content, isLoading } = useContent({
    apiKey: 'privacy-page',
    fallbackKey: 'privacyPage'
  });

  if (isLoading) return <LoadingAnimation />;

  return (
    <main className="mx-auto mt-8 max-w-4xl p-4" role="main">
      <RichTextRenderer content={content} />
    </main>
  );
}
