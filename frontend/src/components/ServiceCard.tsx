import Image from "next/image";
import Link from "next/link";
import { ServiceCard as ServiceCardType } from "@/types";

interface ServiceCardProps {
  service: ServiceCardType;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white border border-benson-pale rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {service.image && (
        <div className="aspect-video bg-benson-cream relative">
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-benson-charcoal mb-2">
          {service.title}
        </h3>
        <p className="text-benson-slate mb-4">{service.summary}</p>
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-benson-cream text-benson-charcoal px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={service.href}
          className="inline-block bg-benson-maroon hover:bg-benson-maroon-dark text-white px-4 py-2 rounded transition-colors"
        >
          {service.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
