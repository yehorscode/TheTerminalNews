import useFetchData from "@/components/useFetchData";
import "./Home.module.scss";

export default function Home() {
    const { feed, error } = useFetchData("world", true);

    if (error) return <div>Error {error}</div>;
    if (!feed) return <div>Loading...</div>;

    return (
        <div className="mt-5">
            <div className="mb-4">
                <h1 className="text-4xl font-mono">Global News</h1>
                <h1 className="font-mono opacity-70">{feed.title}</h1>
            </div>
            <div className="border-dashed border-t-2 border-b-2 border-green-600">
                {feed.items[0] && (
                    <div key={feed.items[0].link}>
                        {feed.items[0].image && (
                            <div
                                style={{
                                    backgroundImage: `url(${feed.items[0].image})`,
                                }}
                                className="bg-cover bg-center h-50 w-full "
                            />
                        )}
                        <a
                            href={feed.items[0].link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {feed.items[0].title}
                        </a>
                    </div>
                )}
            </div>
            <ul>
                {feed.items.map((item: any, idx: number) => (
                    <li key={item.link || idx}>
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.title}
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "150px",
                                    display: "block",
                                    marginBottom: "0.5em",
                                }}
                            />
                        )}
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
