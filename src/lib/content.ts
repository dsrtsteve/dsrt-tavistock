export const charityNumber = "1201527";
export const donationUrl =
  "https://www.justgiving.com/charity/dartmooresearchandrescue";
export const sourceUrl = "https://dsrt-tavistock.org.uk";

export const callouts = [
  {
    id: 31,
    slug: "beardown-tor",
    date: "2026-09-16",
    displayDate: "16 September 2026",
    shortDate: "16.09.26",
    location: "Beardown Tor",
    title: "Assisting an unwell walker",
    category: "Medical assistance",
    summary:
      "A search near Beardown Tors after a walker became unwell. The team’s doctor later checked the walker at Beardown Farm.",
    detail:
      "Police requested help at 15:30. Volunteers deployed from Holming Beam while a rescue vehicle approached through Beardown Farm. After searches began, telephone contact confirmed the walker had recovered enough to return towards the farm with another walker. A team doctor met and assessed them there. The team stood down at 17:00.",
    source:
      "https://dsrt-tavistock.org.uk/2026/09/17/16-09-2026-unwell-walker-beardown-tor/",
  },
  {
    id: 30,
    slug: "leather-tor",
    date: "2026-08-23",
    displayDate: "23 August 2026",
    shortDate: "23.08.26",
    location: "Leather Tor",
    title: "Helping a fallen walker to safety",
    category: "Casualty evacuation",
    summary:
      "Volunteers worked alongside ambulance clinicians to help an injured walker from the rocks near Leather Tor to a waiting ambulance.",
    detail:
      "The team was called at 12:29 after a walker fell and injured their hip. The first rescuers arrived at 13:07, followed by a stretcher team. A team vehicle brought ambulance clinicians close to the casualty. Following assessment and treatment, volunteers carried the walker to the road. Rescue vehicles returned to base at 14:30.",
    source:
      "https://dsrt-tavistock.org.uk/2026/08/23/23-08-2026-fallen-walker-near-leather-tor/",
  },
  {
    id: 29,
    slug: "foggintor",
    date: "2026-08-18",
    displayDate: "18 August 2026",
    shortDate: "18.08.26",
    location: "Foggintor Quarry",
    title: "A helping hand at Foggintor",
    category: "Casualty evacuation",
    summary:
      "A foot team and rescue vehicle assisted a person who had been injured while scrambling near the quarry.",
    detail:
      "The ambulance service requested support after an injury left a person struggling to walk. Volunteers reached and assessed the casualty, then used a team vehicle to bring them to the waiting ambulance for onward care at Derriford Hospital.",
    source:
      "https://dsrt-tavistock.org.uk/2026/08/23/18-08-2026-injured-male-foggintor/",
  },
  {
    id: 28,
    slug: "yennadon",
    date: "2026-08-09",
    displayDate: "9 August 2026",
    shortDate: "09.08.26",
    location: "Yennadon Down",
    title: "Supporting an injured horse rider",
    category: "Casualty evacuation",
    summary:
      "A stretcher evacuation on Yennadon Down helped ambulance clinicians bring an injured rider off the moor.",
    detail:
      "Called at 12:05, the team assisted South Western Ambulance Service with a rider who had fallen above Burrator Reservoir. Volunteers helped immobilise and carry the casualty down to an ambulance. The team stood down at 13:10.",
    source:
      "https://dsrt-tavistock.org.uk/2026/08/10/09-08-2026-fallen-horserider-yennadon/",
  },
];

export const skills = [
  {
    slug: "medical-team",
    title: "Casualty care",
    icon: "medical",
    short: "Expert care, wherever it’s needed.",
    description:
      "Specialist casualty carers train for medical emergencies in remote places, supported by the team’s doctors and healthcare professionals.",
  },
  {
    slug: "search-dogs",
    title: "Search dogs",
    icon: "dog",
    short: "Extraordinary noses. Remarkable teamwork.",
    description:
      "Dogs and their handlers undertake years of training to become operational search partners, helping locate missing people across open ground.",
  },
  {
    slug: "ropes-team",
    title: "Technical rescue",
    icon: "rope",
    short: "Reaching the hardest places.",
    description:
      "Rope specialists rig systems for rescues on crags and steep terrain, helping move casualties safely in difficult conditions.",
  },
  {
    slug: "swift-water-rescue",
    title: "Water rescue",
    icon: "water",
    short: "Ready when the conditions change.",
    description:
      "Our water specialists complete additional professional training alongside the fire service to work in challenging water environments.",
  },
  {
    slug: "hasties",
    title: "Rapid search teams",
    icon: "search",
    short: "Covering ground when time matters.",
    description:
      "Experienced trail runners travel light to search likely routes quickly, working under the direction of search managers.",
  },
  {
    slug: "4x4-drivers",
    title: "Off-road response",
    icon: "vehicle",
    short: "Getting people and equipment closer.",
    description:
      "Trained off-road drivers use the team’s rescue vehicles to move volunteers and essential equipment across difficult terrain.",
  },
] as const;

export const navigation = [
  { href: "/about", label: "Our team" },
  { href: "/team-skills", label: "What we do" },
  { href: "/call-outs", label: "Call-outs" },
  { href: "/blog", label: "Journal" },
  { href: "/support-us", label: "Get involved" },
  { href: "/contact", label: "Contact" },
];
