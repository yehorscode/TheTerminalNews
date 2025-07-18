import useFetchData, { getFeedList } from "@/components/useFetchData";
import "./Home.module.scss";
import noimage from "@/assets/noimage.png";
import type { FeedItem } from "@/components/useFetchData";
import { useEffect, useState } from "react";

export default function Home() {
    const feeds = getFeedList();
    const [selectedFeed, setSelectedFeed] =
        useState<keyof typeof feeds>("world");
    const { feed, error } = useFetchData(selectedFeed);
    const [errorClock, setErrorClock] = useState(21);
    const [maxFeed, setMaxFeed] = useState(9);
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    function expandFeed() {
        setMaxFeed(200);
    }

    if (error) {
        return (
            <div>
                Error {error}. Note!: Wait a minute and refresh. The api may be
                asleep. Let it start up
            </div>
        );
    }
    if (!feed) {
        if (errorClock > 0) {
            setTimeout(() => setErrorClock(errorClock - 1), 1000);
        }
        if (errorClock === 0) {
            window.location.reload();
        }
        return (
            <div className="font-mono">
                <div>
                    Loading... Doesn't load? Note!: Wait a minute and refresh.
                    The api may be asleep. Let it start up!
                </div>
                <div className="mt-3">
                    <h4>Retrying in 20 seconds:</h4>
                    <span className="text-6xl">{errorClock}</span>
                </div>
            </div>
        );
    }
    return (
        <div className="mt-5">
            <div className="mb-4">
                <h1 className="text-4xl font-mono">
                    {feed.title?.split(">").pop()?.trim() || ""} {time}
                </h1>
                <h1 className="font-mono opacity-70">{feed.title}</h1>
                <select
                    className="mt-2 p-1 border border-green-600 bg-black text-green-500 font-mono rounded"
                    value={selectedFeed}
                    onChange={(e) =>
                        setSelectedFeed(e.target.value as keyof typeof feeds)
                    }
                >
                    {Object.entries(feeds).map(([key]) => (
                        <option key={key} value={key}>
                            {key.charAt(0).toUpperCase() +
                                key.slice(1).replace(/_/g, " ")}
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
                {feed.items.slice(1, maxFeed).map((item: FeedItem, idx: number) => (
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
                {maxFeed === 9 && (
                    <button
                        className="col-span-2 mt-2 p-2 border-2 border-green-600 border-dashed font-mono hover:scale-105 hover:cursor-pointer"
                        onClick={() => {
                            expandFeed();
                        }}
                    >
                        Show more
                    </button>
                )}
            </div>
        </div>
    );
}
