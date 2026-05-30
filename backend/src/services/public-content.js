import { publicPlans, serviceAreas, services } from "../data/public-data.js";
import { getPublicImageById, publicImages, serviceImageAssignments } from "../data/public-images.js";

const priorityRank = {
  primary: 0,
  secondary: 1,
  "route-dependent": 2,
};

function toPublicService(service) {
  const assignedImageId = serviceImageAssignments[service.serviceType];
  const image = assignedImageId ? getPublicImageById(assignedImageId) : null;

  return {
    id: service.id,
    title: service.title,
    summary: service.summary,
    href: service.href,
    ctaLabel: service.ctaLabel,
    serviceType: service.serviceType,
    ...(image ? { image } : {}),
    ...(service.tags ? { tags: service.tags } : {}),
    ...(service.displayOrder !== undefined ? { displayOrder: service.displayOrder } : {}),
    active: service.active,
  };
}

function toPublicImage(image) {
  return {
    id: image.id,
    src: image.src,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    alt: image.alt,
    ...(image.caption ? { caption: image.caption } : {}),
    ...(image.serviceCategory ? { serviceCategory: image.serviceCategory } : {}),
    ...(image.imageStage ? { imageStage: image.imageStage } : {}),
  };
}

function toPublicPlan(plan) {
  return {
    id: plan.id,
    name: plan.name,
    priceMonthly: plan.priceMonthly,
    ...(plan.squareFootageRange ? { squareFootageRange: plan.squareFootageRange } : {}),
    description: plan.description,
    features: plan.features,
    ...(plan.popular !== undefined ? { popular: plan.popular } : {}),
    audience: plan.audience,
    ctaLabel: plan.ctaLabel,
    active: plan.active,
  };
}

function toPublicServiceAreaLink(link) {
  return {
    label: link.label,
    href: link.href,
    serviceType: link.serviceType,
  };
}

function toPublicServiceArea(area) {
  return {
    id: area.id,
    city: area.city,
    zipCodes: area.zipCodes,
    silo: area.silo,
    priority: area.priority,
    regionLabel: area.regionLabel,
    localizedRisks: area.localizedRisks,
    services: area.services.map(toPublicServiceAreaLink),
  };
}

export function getServices() {
  return services
    .filter((service) => service.active)
    .toSorted((left, right) => (left.displayOrder ?? Number.MAX_SAFE_INTEGER) - (right.displayOrder ?? Number.MAX_SAFE_INTEGER))
    .map(toPublicService);
}

export function getPlans() {
  return publicPlans
    .filter((plan) => plan.active)
    .toSorted((left, right) => {
      if (left.audience !== right.audience) {
        return left.audience.localeCompare(right.audience);
      }

      return left.priceMonthly - right.priceMonthly;
    })
    .map(toPublicPlan);
}

export function getServiceAreas() {
  return serviceAreas
    .toSorted((left, right) => {
      const priorityDifference = priorityRank[left.priority] - priorityRank[right.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return left.city.localeCompare(right.city);
    })
    .map(toPublicServiceArea);
}

export function getImages() {
  return publicImages.map(toPublicImage);
}
