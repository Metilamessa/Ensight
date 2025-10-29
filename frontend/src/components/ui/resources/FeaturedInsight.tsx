import Image from "next/image";

interface Insight {
  title: string;
  description: string;
  category: string;
  image?: string;
}

const FeaturedInsight = ({ insight }: { insight: Insight }) => {
  return (
    <div className="mt-6">
      <h2
        className="flex items-center mb-4 text-2xl font-semibold"
        style={{ color: "var(--color-blueblack-white)" }}
      >
        <span className="mr-2">💡</span> Featured Insight
      </h2>
      <div
        className="flex flex-col overflow-hidden rounded-lg shadow-md md:flex-row"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="md:w-1/2">
          <Image
            src={
              insight.image ||
              "https://via.placeholder.com/600x400?text=Featured+Insight"
            }
            alt={insight.title}
            className="object-cover w-full h-48 md:h-full"
            width={600}
            height={300}
          />
        </div>
        <div
          className="flex flex-col justify-center p-4 md:w-1/2"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          <span
            className="inline-block text-center w-30 text-xs font-semibold px-2 py-0.5 rounded mb-1 whitespace-nowrap"
            style={{
              backgroundColor: "#facc15",
              color: "var(--color-blueblack-white)",
            }}
          >
            {insight.category.toUpperCase()}
          </span>
          <h3
            className="mb-1 text-lg font-bold"
            style={{ color: "var(--color-blueblack-white)" }}
          >
            {insight.title}
          </h3>
          <p
            className="mb-3 text-sm"
            style={{ color: "var(--color-secondary)" }}
          >
            {insight.description}
          </p>
          <button
            className="text-sm px-3 py-1.5 rounded w-fit"
            style={{
              backgroundColor: "var(--color-primary-accent)",
              color: "var(--color-light)",
            }}
          >
            Read Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInsight;
