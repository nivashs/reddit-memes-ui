import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '../config/constants';
import LoadingRing from './utils/loading-ring';

export default function TopMemes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['topMemes'],
    queryFn: async () => {
      const response = await fetch(`${ENDPOINTS.topMemes}?limit=20`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
    staleTime: 290000,
  });

  const handleRedirect = (permalink) => {
    const redditUrl = `${permalink}`;
    window.open(redditUrl);
  };

  if (isLoading) return <LoadingRing size="large" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((meme) => (
        <div
          key={meme.reddit_id}
          className="bg-white rounded-lg shadow overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-lg"
          onClick={() => handleRedirect(meme.permalink)}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleRedirect(meme.permalink);
            }
          }}
        >
          <img
            src={meme.url}
            alt={meme.title}
            className="w-full h-[400px] object-contain bg-gray-100"
          />
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">{meme.title}</h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>Upvotes: {meme.score}</span>
              <span className="mx-2">•</span>
              <span>Comments: {meme.num_comments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}