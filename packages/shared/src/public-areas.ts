import type { ServiceArea } from "./types";

const harneyServices: ServiceArea["services"] = [
  { label: "Inspection Repairs", href: "/services/inspection-repairs", serviceType: "inspection-repairs" },
  { label: "Water, Mold & Moisture", href: "/services/water-damage", serviceType: "water-mold-moisture" },
  {
    label: "Window & Door Replacements",
    href: "/services/window-door-replacement",
    serviceType: "window-door-replacements",
  },
  { label: "Maintenance Plans", href: "/plans", serviceType: "maintenance-plans" },
  { label: "Property Preservation", href: "/services/property-preservation", serviceType: "property-preservation" },
  { label: "Energy & Weatherization", href: "/services/energy-weatherization", serviceType: "energy-weatherization" },
  { label: "Emergency Intake", href: "/services/emergency-response", serviceType: "emergency-response" },
];

export const baseAreas: ServiceArea[] = [
  area("burns", "Burns", ["97720"], "primary", "Harney County", [
    "Freeze risk",
    "High-desert wind",
    "Photo-first scoping",
  ]),
  area("hines", "Hines", ["97738"], "primary", "Harney County", [
    "Freeze risk",
    "High-desert wind",
    "Photo-first scoping",
  ]),
  area("lawen", "Lawen", ["97720"], "route-dependent", "Harney County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("fields", "Fields", ["97710"], "route-dependent", "South County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("crane", "Crane", ["97732"], "route-dependent", "Harney County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("diamond", "Diamond", ["97722"], "route-dependent", "South County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("riley", "Riley", ["97758"], "route-dependent", "Harney County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("drewsey", "Drewsey", ["97904"], "route-dependent", "Harney County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("princeton", "Princeton", ["97721"], "route-dependent", "South County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
  area("frenchglen", "Frenchglen", ["97736"], "route-dependent", "South County Route", [
    "Freeze risk",
    "Remote access",
    "Route planning",
    "Access notes",
  ]),
];

function area(
  id: string,
  city: string,
  zipCodes: string[],
  priority: ServiceArea["priority"],
  regionLabel: string,
  localizedRisks: string[],
): ServiceArea {
  return {
    id,
    city,
    zipCodes,
    silo: "harney-county",
    priority,
    regionLabel,
    localizedRisks,
    services: harneyServices,
  };
}
