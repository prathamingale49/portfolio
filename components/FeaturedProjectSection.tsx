import type { ProjectFeature } from "@/types/project";
import { getAssetUrl } from "@/lib/assets";

interface FeaturedProjectSectionProps {
  features: ProjectFeature[];
}

export function FeaturedProjectSection({ features }: FeaturedProjectSectionProps) {
  if (features.length === 0) {
    return null;
  }

  const [primary, ...secondary] = features;

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">Featured Details</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Circuit and Layout Focus</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="overflow-hidden rounded-lg border border-line-soft bg-panel">
          <div className="aspect-[16/10] border-b border-line-soft bg-[#0b1018]">
            <img
              src={getAssetUrl(primary.image)}
              alt={primary.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-5">
            {primary.tag ? (
              <p className="text-xs uppercase tracking-wide text-copper">{primary.tag}</p>
            ) : null}
            <h3 className="mt-2 text-lg font-semibold text-white">{primary.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{primary.description}</p>
          </div>
        </article>
        <div className="grid gap-4">
          {secondary.map((feature) => (
            <article key={feature.title} className="overflow-hidden rounded-lg border border-line-soft bg-panel">
              <div className="aspect-[16/8] border-b border-line-soft bg-[#0b1018]">
                <img
                  src={getAssetUrl(feature.image)}
                  alt={feature.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                {feature.tag ? (
                  <p className="text-xs uppercase tracking-wide text-copper">{feature.tag}</p>
                ) : null}
                <h3 className="mt-2 text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
