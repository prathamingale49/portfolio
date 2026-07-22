import type { ProjectFeature } from "@/types/project";
import { getAssetUrl } from "@/lib/assets";

interface FeaturedProjectSectionProps {
  features: ProjectFeature[];
}

export function FeaturedProjectSection({ features }: FeaturedProjectSectionProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">Featured Details</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Circuit and layout focus</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="overflow-hidden rounded border border-line-soft bg-panel">
            <div className="aspect-[16/10] border-b border-line-soft bg-[#0b1018]">
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
    </section>
  );
}
