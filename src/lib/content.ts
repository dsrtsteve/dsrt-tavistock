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
    description: [
      {
        type: "paragraph",
        text: "Every rescue depends on skilled care from the moment the team reaches a casualty. All members train in Basic Life Support, including CPR and AED use. Many go on to complete weeks of additional training and assessment to qualify as Mountain Rescue England and Wales (MREW) Remote Rescue Medical Technicians, specialising in first aid in remote environments.",
      },
      {
        type: "paragraph",
        text: "The team has a number of qualified Remote Rescue Medical Technicians, alongside doctors, surgeons, nurses and paramedics. An RRMT qualification is valid for three years and prepares members to:",
      },
      {
        type: "list",
        items: [
          "Assess and treat immediate threats to life, including problems with the airway, breathing, circulation and consciousness, and provide spinal protection where needed.",
          "Take an AMPLE history and carry out a systematic secondary survey, recognising injuries to the head, chest, abdomen, spine and limbs, as well as fractures and burns.",
          "Respond to medical and environmental emergencies such as hypothermia, heat illness, drowning, lightning strikes, cardiac problems, seizures, asthma, diabetes, anaphylaxis and overdose.",
          "Administer a range of medicines, including some by injection.",
        ],
      },
      {
        type: "paragraph",
        text: "This training helps us stabilise and care for a casualty in challenging conditions, then hand them over to hospital in the best possible condition.",
      },
    ],
  },
  {
    slug: "search-dogs",
    title: "Search dogs",
    icon: "dog",
    short: "Extraordinary noses. Remarkable teamwork.",
    description: [
      {
        type: "paragraph",
        text: "DSRT Tavistock has four operational search dog teams on its call-out list. Becoming a handler takes exceptional commitment: handlers first serve as fully operational team members, then choose to take on the additional role.",
      },
      {
        type: "paragraph",
        text: "Alongside regular team training, handlers spend many extra hours each week training and keeping their dogs fit, including on Sundays. Candidates must have served at least 12 months on the call-out list and have the full support of the team’s management committee.",
      },
      {
        type: "paragraph",
        text: "Handlers train together once a month, travelling to locations around the country, including the Lake District, Northumberland, the Peak District and the Yorkshire Moors. Search dog teams can be requested at incidents anywhere in the country, not only on Dartmoor.",
      },
      {
        type: "paragraph",
        text: "Each dog belongs to its handler, who is responsible for the dog’s veterinary bills.",
      },
      {
        type: "link",
        text: "Find out more about the national organisation:",
        label: "Mountain Rescue Search Dogs England",
        href: "https://mountainrescuesearchdogsengland.org.uk/",
      },
    ],
  },
  {
    slug: "ropes-team",
    title: "Technical rescue",
    icon: "rope",
    short: "Reaching the hardest places.",
    description: [
      {
        type: "paragraph",
        text: "Mountain rescue can mean reaching people on climbing crags, tor tops and steep valley sides. Within DSRT Tavistock, members with a particular aptitude for technical ropework undertake specialist training to carry out and supervise rope rescues in line with Mountain Rescue England and Wales (MREW) Rope Rescue Operator course guidelines.",
      },
      {
        type: "paragraph",
        text: "This training equips the team to rescue casualties from crags and steep ground, whether they can move themselves or need to be evacuated by stretcher.",
      },
    ],
  },
  {
    slug: "swift-water-rescue",
    title: "Water rescue",
    icon: "water",
    short: "Ready when the conditions change.",
    description: [
      {
        type: "paragraph",
        text: "Water safety is part of the training for every DSRT Tavistock Hill Party member. All complete Mod 1 Water Awareness, learning the risks and protocols for working near water and basic land-based rescue techniques.",
      },
      {
        type: "paragraph",
        text: "The specialist Water Team completes further training in line with DEFRA requirements and internationally recognised standards, often alongside professional rescuers from other emergency services.",
      },
      {
        type: "heading",
        text: "Mod 2: Swift Water First Responder",
      },
      {
        type: "paragraph",
        text: "First Responders are trained to work safely near and in water using land-based and wading techniques. They can support Swiftwater Rescue Technicians at incidents with downstream safety cover and casualty handling, and carry out bank-based and shallow-water rescues. Their training also includes self-rescue, basic boat handling and basic rope work.",
      },
      {
        type: "paragraph",
        text: "During floods, First Responders may use shallow-water skills to help evacuate people from properties and provide safety cover. Their support allows specialist technicians to focus on more technical rescues when resources are stretched.",
      },
      {
        type: "heading",
        text: "Mod 3: Swift Water Rescue Technician",
      },
      {
        type: "paragraph",
        text: "Mod 3 is the benchmark training for swift-water and flood rescue teams. Swift Water Rescue Technicians carry out specialist rescues in moving water and flood conditions, to a consistent standard shared with other emergency services, including fire and rescue. This helps teams work together effectively during major incidents.",
      },
      {
        type: "paragraph",
        text: "DSRT Tavistock has a number of qualified Swift Water Rescue Technicians and can field a Mod 3 team when required.",
      },
    ],
  },
  {
    slug: "hasties",
    title: "Hasty running team",
    icon: "search",
    short: "Covering ground when time matters.",
    description: [
      {
        type: "paragraph",
        text: "Hasties are experienced team members who have served at least 12 months in a traditional role. They work in pairs or small groups, covering ground at around twice the pace of a walking team. Each member may need to take on several roles during a search, or carry urgent supplies to a casualty, such as oxygen, Entonox, medication, splints or additional medical equipment.",
      },
      {
        type: "heading",
        text: "Fitness and resilience",
      },
      {
        type: "paragraph",
        text: "Physical and mental fitness are essential. Readiness is shown through a proven running background and the ability to keep going at night, in poor weather and for an unknown length of time—not simply through race times or distances.",
      },
      {
        type: "heading",
        text: "Navigation and searching",
      },
      {
        type: "paragraph",
        text: "Hasties use handrails and catching features where possible, leaving more time to search. Timing and pacing are less useful while running and searching, so GPS supports navigation and helps the team reach grid references. Local knowledge and a good understanding of the moor are valuable. Teams use OS 1:25,000 maps and 1:40,000 Harvey and British Mountain Maps.",
      },
      {
        type: "heading",
        text: "Equipment",
      },
      {
        type: "paragraph",
        text: "A Hasty’s pack typically weighs 6–8 kg. Along with full waterproofs, spare warm clothing, food and drink, personal first aid supplies, a map, compass and lights, members carry equipment to help protect and care for a casualty.",
      },
      {
        type: "list",
        items: [
          "Personal and casualty clothing, including spare gloves, hats and warm layers.",
          "A head torch, search torch, map, compass, notepad, pen, casrep and foil emergency bag.",
          "A lightweight helmet for helicopter operations.",
          "As needed, team equipment such as a group shelter, comprehensive first aid kit, neck brace, strobe or GPS.",
        ],
      },
      {
        type: "heading",
        text: "Working together",
      },
      {
        type: "paragraph",
        text: "Hasties are experienced rescuers who rely on one another. Leadership is shared and flexible. When they reach a casualty, they may face a demanding situation while further help is still some distance away, so strong first aid and casualty-site management skills are essential. Many Hasties are medical professionals. A sense of humour also helps build team spirit through long, difficult call-outs.",
      },
    ],
  },
  {
    slug: "4x4-drivers",
    title: "Off-road response",
    icon: "vehicle",
    short: "Getting people and equipment closer.",
    description: [
      {
        type: "paragraph",
        text: "DSRT Tavistock covers wide areas of open moorland and farmland, where casualty sites may only be reached by off-road vehicle. The team has two Land Rover Defenders to reach incidents and bring personnel and equipment as close as possible.",
      },
      {
        type: "paragraph",
        text: "Around 16 team members are trained to Mountain Rescue England and Wales (MREW) off-road driving standards, including three of the country’s 15 instructors. Drivers complete the MREW Advanced Driver Training course to learn how to prepare and operate vehicles safely on and off the road.",
      },
      {
        type: "heading",
        text: "Vehicle preparation",
      },
      {
        type: "list",
        items: [
          "Safety procedures, including jacking, and vehicle knowledge.",
          "Differentials, four-wheel drive systems and hydraulic coupling.",
          "Transmission wind-up and how to prevent it.",
        ],
      },
      {
        type: "heading",
        text: "On and off-road driving",
      },
      {
        type: "list",
        items: [
          "When and how to engage four-wheel drive.",
          "Driving with a load and handling rough tracks.",
          "Safe driving on sand, mud, ice and snow.",
        ],
      },
      {
        type: "heading",
        text: "Returning to the road",
      },
      {
        type: "paragraph",
        text: "Drivers also learn to disengage four-wheel drive systems correctly and clean the vehicle before rejoining the road.",
      },
    ],
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
