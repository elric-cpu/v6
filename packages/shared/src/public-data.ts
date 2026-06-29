import { baseAreas } from "./public-areas";
import { publicImages, serviceImageAssignments } from "./public-images";
import { basePlans } from "./public-plans";
import { baseServices } from "./public-services";
import type { MaintenancePlan, ServiceArea, ServiceCard, SiteImage } from "./types";

function getPublicImageById(imageId: string): SiteImage | null {
  return publicImages.find((siteImage) => siteImage.id === imageId) ?? null;
}

function withAssignedImage(serviceCard: ServiceCard): ServiceCard {
  const imageId = serviceImageAssignments[serviceCard.serviceType];
  const assignedImage = imageId ? getPublicImageById(imageId) : null;

  return assignedImage ? { ...serviceCard, image: assignedImage } : serviceCard;
}

export function getStaticServices(): ServiceCard[] {
  return baseServices
    .filter((serviceCard) => serviceCard.active)
    .slice()
    .sort((left, right) => (left.displayOrder ?? 999) - (right.displayOrder ?? 999))
    .map(withAssignedImage);
}

export function getStaticPlans(): MaintenancePlan[] {
  return basePlans
    .filter((planOption) => planOption.active)
    .slice()
    .sort((left, right) => left.priceMonthly - right.priceMonthly);
}

export function getStaticServiceAreas(): ServiceArea[] {
  return baseAreas.slice().sort((left, right) => {
    const priority = priorityRank(left.priority) - priorityRank(right.priority);
    return priority === 0 ? left.city.localeCompare(right.city) : priority;
  });
}

export function getStaticImages(): SiteImage[] {
  return publicImages.slice();
}

function priorityRank(priority: ServiceArea["priority"]): number {
  return priority === "primary" ? 0 : priority === "secondary" ? 1 : 2;
}
