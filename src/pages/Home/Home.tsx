import useFetchData, { getFeedList } from "@/components/useFetchData";
import "./Home.module.scss";
import noimage from "@/assets/noimage.png";
import type { FeedItem } from "@/components/useFetchData";
import { useState } from "react";

export default function Home() {
    const feeds = getFeedList();
    const [selectedFeed, setSelectedFeed] = useState<keyof typeof feeds>("world");
    const { feed, error } = useFetchData(selectedFeed);

    if (error) return <div>Error {error}</div>;
    if (!feed) return <div>Loading...</div>;

    return (
        <div className="mt-5">
            <div className="mb-4">
                <h1 className="text-4xl font-mono">{feed.title?.split('>').pop()?.trim() || ''}</h1>
                <h1 className="font-mono opacity-70">{feed.title}</h1>
                <select
                    className="mt-2 p-1 border border-green-600 bg-black text-green-500 font-mono rounded"
                    value={selectedFeed}
                    onChange={e => setSelectedFeed(e.target.value as keyof typeof feeds)}
                >
                    {Object.entries(feeds).map(([key]) => (
                        <option key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
            </div>
            <div className="border-dashed border-t-2 border-b-2 border-green-600 p-2 hover:cursor-pointer">
                {feed.items[0] && (
                    <div
                        key={feed.items[0].link}
                        onClick={() =>
                            window.open(
                                "https://www.removepaywall.com/search?url=" +
                                    feed.items[0].link
                            )
                        }
                    >
                        {feed.items[0].image && (
                            <div
                                style={{
                                    backgroundImage: `url(${feed.items[0].image})`,
                                    filter: "grayscale(1) brightness(0.7) contrast(1.5) sepia(0.6) hue-rotate(75deg) saturate(7) blur(0.5px)",
                                    imageRendering: "pixelated",
                                }}
                                className="bg-cover bg-center h-150 w-full"
                            />
                        )}
                        <a
                            href={feed.items[0].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-mono mt-2 block"
                        >
                            {feed.items[0].title}
                        </a>
                    </div>
                )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                {feed.items
                    .slice(1)
                    .reduce<Set<string>>((uniqueLinks, item) => {
                        if (!uniqueLinks.has(item.link)) {
                            uniqueLinks.add(item.link);
                            return uniqueLinks;
                        }
                        return uniqueLinks;
                    }, new Set()).size > 0 &&
                    feed.items.slice(1).map((item: FeedItem, idx: number) => (
                        <div
                            key={item.link || idx + 1}
                            className="mb-4 border-dashed border-green-600 border-2 p-2 font-mono hover:scale-105 hover:cursor-pointer"
                            onClick={() =>
                                window.open(
                                    "https://www.removepaywall.com/search?url=" +
                                        item.link
                                )
                            }
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${
                                        item.image || noimage
                                    })`,
                                    filter: "grayscale(1) brightness(0.7) contrast(1) sepia(0.6) hue-rotate(75deg) saturate(7) blur(0.5px)",
                                    imageRendering: "pixelated",
                                }}
                                className="bg-cover bg-center h-100 w-full"
                            />
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block"
                            >
                                {item.title}
                            </a>
                        </div>
                    ))}
            </div>
        </div>
    );
}
