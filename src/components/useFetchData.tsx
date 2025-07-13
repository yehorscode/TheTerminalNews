import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const feeds = {
    world: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    europe: "https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml",
    africa: "https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml",
    americas: "https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml",
    asia: "https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml",
    middle_east: "https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml",
    business: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    technology: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
};

type Feed = {
    title: string;
    items: FeedItem[];
};

type FeedItem = {
    title: string;
    link: string;
    pubDate?: string;
    description?: string;
    image?: string;
    author?: string;
    content?: string;
};

export default function useFetchData(
    select_feed: keyof typeof feeds = "world",
    is_debug: boolean = false
) {
    const [feed, setFeed] = useState<Feed | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [feed_url, setFeedUrl] = useState<string | null>(feeds[select_feed]);

    // Set feed_url only when select_feed changes
    useEffect(() => {
        setFeedUrl(feeds[select_feed]);
    }, [select_feed]);

    useEffect(() => {
        if (!feed_url) return;
        const FetchRss = async () => {
            try {
                const CORS_PROXY = "https://proxy.corsfix.com/?";
                const response = await axios.get(CORS_PROXY + feed_url, {
                    headers: { "User-Agent": "RSS Fetcher/1.0" },
                });

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(
                    response.data,
                    "text/xml"
                );

                const channel = xmlDoc.getElementsByTagName("channel")[0];
                const title =
                    channel.getElementsByTagName("title")[0].textContent ?? "";
                const items = xmlDoc.getElementsByTagName("item");

                const feedData: Feed = {
                    title,
                    items: Array.from(items).map((item) => {
                        const title =
                            item.getElementsByTagName("title")[0].textContent ??
                            "";
                        const link =
                            item.getElementsByTagName("link")[0].textContent ??
                            "";
                        const pubDate =
                            item.getElementsByTagName("pubDate")[0]
                                .textContent ?? "";
                        const description =
                            item.getElementsByTagName("description")[0]
                                .textContent ?? "";
                        const image =
                            item
                                .getElementsByTagName("media:content")[0]
                                ?.getAttribute("url") ||
                            item
                                .getElementsByTagName("media:thumbnail")[0]
                                ?.getAttribute("url") ||
                            "";

                        return { title, link, pubDate, description, image };
                    }),
                };
                setFeed(feedData);
                setError(null);
                console.log("Feed succesfully(?) fetched")
            } catch (err) {
                toast.error("An error occurred while fetching the RSS feed.");
                console.error("Error fetching/parsing RSS:", err);
            }
        };
        FetchRss();
    }, []);
    return { feed, error };
}
