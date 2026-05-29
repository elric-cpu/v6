import Image from "next/image";
import Link from "next/link";
import { ServiceCard as ServiceCardType } from "@/types";

interface ServiceCardProps {
  service: ServiceCardType;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-benson-pale bg-benson-offwhite transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-benson-burgundy hover:shadow-md">
      {service.image && (
        <div className="aspect-[4/3] bg-benson-cream relative">
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
        <p className="mb-4 text-sm text-benson-slate">
          For Harney County route review, send photos, dimensions where relevant,
          location, access notes, priority, and timing.
        </p>
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
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-benson-maroon px-4 py-2 font-medium text-benson-offwhite shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-benson-maroon-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-benson-maroon focus-visible:ring-offset-2 active:translate-y-px"
        >
          {service.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
