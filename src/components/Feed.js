import React from "react";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import { fetchPosts } from "../api/posts";
import "./Feed.css";

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    "posts",
    ({ pageParam = 1 }) => fetchPosts(pageParam, 5),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasMore ? allPages.length + 1 : 1; // Reset to page 1 if no more pages
      },
    }
  );

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="feed">
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<p>Loading...</p>}
        endMessage={<p>Restarting the feed...</p>}
      >
        {allPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScroll>
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default Feed;
