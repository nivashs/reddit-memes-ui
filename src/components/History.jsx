import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ENDPOINTS } from '../config/constants';

export default function History() {
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [limit, setLimit] = useState(20);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['memeHistory', sortBy, order, limit],
    queryFn: async ({ pageParam = null }) => {
      const cursor = pageParam ? `&cursor=${pageParam}` : '';
      const url = ENDPOINTS.allMemes(limit, sortBy, order, cursor);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });

  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'score', label: 'Score' },
    { value: 'reddit_created_at', label: 'Reddit Date' },
    { value: 'num_comments', label: 'Comments' }
  ];

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    refetch();
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    refetch();
  };

  const handleRedirect = (permalink) => {
    const redditUrl = `${permalink}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
        <select 
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded border p-2"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select 
          value={order}
          onChange={(e) => handleOrderChange(e.target.value)}
          className="rounded border p-2"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <select 
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="rounded border p-2"
        >
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {data.pages.map((page, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.items.map((meme) => (
            <div key={meme.reddit_id} className="bg-white rounded-lg shadow overflow-hidden" onClick={() => handleRedirect(meme.permalink)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRedirect(meme.permalink);
              }
            }}>
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full h-[400px] object-contain bg-gray-100"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{meme.title}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>Score: {meme.score}</span>
                  <span className="mx-2">•</span>
                  <span>Comments: {meme.num_comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}