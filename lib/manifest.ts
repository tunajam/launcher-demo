import { LauncherItem } from "./types";
import {
  Football,
  Basketball,
  Baseball,
  Hockey,
  SoccerBall,
  GraduationCap,
  FlagPennant,
  GlobeHemisphereWest,
  Article,
  ChartBar,
  User,
  Users,
  Calendar,
  ListNumbers,
  Newspaper,
  Trophy,
  TrendUp,
  MapPin,
} from "@phosphor-icons/react";

// Helper to create standard sub-pages for a team
function teamPages(prefix: string, category: string): LauncherItem[] {
  return [
    { id: `${prefix}-schedule`, name: "Schedule", description: "Game schedule & results", icon: Calendar, category, tags: ["schedule", "games"], keywords: [] },
    { id: `${prefix}-roster`, name: "Roster", description: "Current roster & depth chart", icon: Users, category, tags: ["roster", "players"], keywords: [] },
    { id: `${prefix}-stats`, name: "Stats", description: "Team & player statistics", icon: ChartBar, category, tags: ["stats", "statistics"], keywords: [] },
    { id: `${prefix}-standings`, name: "Standings", description: "Division standings", icon: ListNumbers, category, tags: ["standings", "rankings"], keywords: [] },
    { id: `${prefix}-news`, name: "News", description: "Latest team news", icon: Newspaper, category, tags: ["news", "updates"], keywords: [] },
  ];
}

export const manifest: LauncherItem[] = [
  // ── NFL ──
  {
    id: "nfl",
    name: "NFL",
    description: "National Football League",
    icon: Football,
    category: "NFL",
    tags: ["football", "nfl", "american-football"],
    prefixes: ["nfl:", "n:"],
    keywords: ["football", "national football league", "gridiron"],
    children: [
      { id: "nfl-panthers", name: "Carolina Panthers", description: "NFC South", icon: Football, category: "NFL", tags: ["carolina", "panthers", "nfc-south"], keywords: ["carolina panthers", "cam newton"], children: teamPages("nfl-panthers", "NFL") },
      { id: "nfl-chiefs", name: "Kansas City Chiefs", description: "AFC West", icon: Football, category: "NFL", tags: ["kansas-city", "chiefs", "afc-west"], keywords: ["kansas city chiefs", "mahomes"], children: teamPages("nfl-chiefs", "NFL") },
      { id: "nfl-bills", name: "Buffalo Bills", description: "AFC East", icon: Football, category: "NFL", tags: ["buffalo", "bills", "afc-east"], keywords: ["buffalo bills", "josh allen"], children: teamPages("nfl-bills", "NFL") },
      { id: "nfl-eagles", name: "Philadelphia Eagles", description: "NFC East", icon: Football, category: "NFL", tags: ["philadelphia", "eagles", "nfc-east"], keywords: ["philadelphia eagles", "jalen hurts"], children: teamPages("nfl-eagles", "NFL") },
      { id: "nfl-49ers", name: "San Francisco 49ers", description: "NFC West", icon: Football, category: "NFL", tags: ["san-francisco", "49ers", "nfc-west"], keywords: ["san francisco 49ers", "brock purdy"], children: teamPages("nfl-49ers", "NFL") },
      { id: "nfl-lions", name: "Detroit Lions", description: "NFC North", icon: Football, category: "NFL", tags: ["detroit", "lions", "nfc-north"], keywords: ["detroit lions"], children: teamPages("nfl-lions", "NFL") },
      { id: "nfl-ravens", name: "Baltimore Ravens", description: "AFC North", icon: Football, category: "NFL", tags: ["baltimore", "ravens", "afc-north"], keywords: ["baltimore ravens", "lamar jackson"], children: teamPages("nfl-ravens", "NFL") },
      { id: "nfl-cowboys", name: "Dallas Cowboys", description: "NFC East", icon: Football, category: "NFL", tags: ["dallas", "cowboys", "nfc-east"], keywords: ["dallas cowboys", "dak prescott"], children: teamPages("nfl-cowboys", "NFL") },
    ],
  },

  // ── NBA ──
  {
    id: "nba",
    name: "NBA",
    description: "National Basketball Association",
    icon: Basketball,
    category: "NBA",
    tags: ["basketball", "nba"],
    prefixes: ["nba:", "b:"],
    keywords: ["basketball", "national basketball association", "hoops"],
    children: [
      { id: "nba-blazers", name: "Portland Trail Blazers", description: "Northwest Division", icon: Basketball, category: "NBA", tags: ["blazers", "portland", "northwest"], keywords: ["portland trail blazers", "rip city"], children: teamPages("nba-blazers", "NBA") },
      { id: "nba-lakers", name: "Los Angeles Lakers", description: "Pacific Division", icon: Basketball, category: "NBA", tags: ["lakers", "los-angeles", "pacific"], keywords: ["los angeles lakers", "lebron"], children: teamPages("nba-lakers", "NBA") },
      { id: "nba-celtics", name: "Boston Celtics", description: "Atlantic Division", icon: Basketball, category: "NBA", tags: ["celtics", "boston", "atlantic"], keywords: ["boston celtics", "jayson tatum"], children: teamPages("nba-celtics", "NBA") },
      { id: "nba-nuggets", name: "Denver Nuggets", description: "Northwest Division", icon: Basketball, category: "NBA", tags: ["nuggets", "denver", "northwest"], keywords: ["denver nuggets", "jokic"], children: teamPages("nba-nuggets", "NBA") },
      { id: "nba-thunder", name: "Oklahoma City Thunder", description: "Northwest Division", icon: Basketball, category: "NBA", tags: ["thunder", "okc", "northwest"], keywords: ["oklahoma city thunder", "shai"], children: teamPages("nba-thunder", "NBA") },
      { id: "nba-warriors", name: "Golden State Warriors", description: "Pacific Division", icon: Basketball, category: "NBA", tags: ["warriors", "golden-state", "pacific"], keywords: ["golden state warriors", "steph curry"], children: teamPages("nba-warriors", "NBA") },
    ],
  },

  // ── MLB ──
  {
    id: "mlb",
    name: "MLB",
    description: "Major League Baseball",
    icon: Baseball,
    category: "MLB",
    tags: ["baseball", "mlb"],
    prefixes: ["mlb:", "m:"],
    keywords: ["baseball", "major league baseball"],
    children: [
      { id: "mlb-dodgers", name: "Los Angeles Dodgers", description: "NL West", icon: Baseball, category: "MLB", tags: ["dodgers", "los-angeles", "nl-west"], keywords: ["los angeles dodgers", "ohtani"], children: teamPages("mlb-dodgers", "MLB") },
      { id: "mlb-yankees", name: "New York Yankees", description: "AL East", icon: Baseball, category: "MLB", tags: ["yankees", "new-york", "al-east"], keywords: ["new york yankees", "judge"], children: teamPages("mlb-yankees", "MLB") },
      { id: "mlb-braves", name: "Atlanta Braves", description: "NL East", icon: Baseball, category: "MLB", tags: ["braves", "atlanta", "nl-east"], keywords: ["atlanta braves"], children: teamPages("mlb-braves", "MLB") },
      { id: "mlb-astros", name: "Houston Astros", description: "AL West", icon: Baseball, category: "MLB", tags: ["astros", "houston", "al-west"], keywords: ["houston astros"], children: teamPages("mlb-astros", "MLB") },
      { id: "mlb-mariners", name: "Seattle Mariners", description: "AL West", icon: Baseball, category: "MLB", tags: ["mariners", "seattle", "al-west"], keywords: ["seattle mariners"], children: teamPages("mlb-mariners", "MLB") },
    ],
  },

  // ── NHL ──
  {
    id: "nhl",
    name: "NHL",
    description: "National Hockey League",
    icon: Hockey,
    category: "NHL",
    tags: ["hockey", "nhl", "ice-hockey"],
    prefixes: ["nhl:", "h:"],
    keywords: ["hockey", "national hockey league", "ice"],
    children: [
      { id: "nhl-hurricanes", name: "Carolina Hurricanes", description: "Metropolitan Division", icon: Hockey, category: "NHL", tags: ["hurricanes", "carolina", "metropolitan"], keywords: ["carolina hurricanes", "canes"], children: teamPages("nhl-hurricanes", "NHL") },
      { id: "nhl-oilers", name: "Edmonton Oilers", description: "Pacific Division", icon: Hockey, category: "NHL", tags: ["oilers", "edmonton", "pacific"], keywords: ["edmonton oilers", "mcdavid"], children: teamPages("nhl-oilers", "NHL") },
      { id: "nhl-panthers", name: "Florida Panthers", description: "Atlantic Division", icon: Hockey, category: "NHL", tags: ["panthers", "florida", "atlantic"], keywords: ["florida panthers"], children: teamPages("nhl-panthers", "NHL") },
      { id: "nhl-avalanche", name: "Colorado Avalanche", description: "Central Division", icon: Hockey, category: "NHL", tags: ["avalanche", "colorado", "central"], keywords: ["colorado avalanche", "mackinnon"], children: teamPages("nhl-avalanche", "NHL") },
    ],
  },

  // ── MLS ──
  {
    id: "mls",
    name: "MLS",
    description: "Major League Soccer",
    icon: SoccerBall,
    category: "MLS",
    tags: ["soccer", "mls", "football"],
    prefixes: ["mls:", "s:"],
    keywords: ["soccer", "major league soccer", "football"],
    children: [
      { id: "mls-timbers", name: "Portland Timbers", description: "Western Conference", icon: SoccerBall, category: "MLS", tags: ["timbers", "portland", "western"], keywords: ["portland timbers", "rctid"], children: teamPages("mls-timbers", "MLS") },
      { id: "mls-thorns", name: "Portland Thorns", description: "NWSL", icon: SoccerBall, category: "MLS", tags: ["thorns", "portland", "nwsl"], keywords: ["portland thorns", "nwsl"], children: teamPages("mls-thorns", "MLS") },
      { id: "mls-inter-miami", name: "Inter Miami", description: "Eastern Conference", icon: SoccerBall, category: "MLS", tags: ["inter-miami", "miami", "eastern"], keywords: ["inter miami", "messi"], children: teamPages("mls-inter-miami", "MLS") },
      { id: "mls-lafc", name: "LAFC", description: "Western Conference", icon: SoccerBall, category: "MLS", tags: ["lafc", "los-angeles", "western"], keywords: ["lafc", "los angeles fc"], children: teamPages("mls-lafc", "MLS") },
    ],
  },

  // ── College ──
  {
    id: "college",
    name: "College Sports",
    description: "NCAA athletics",
    icon: GraduationCap,
    category: "College",
    tags: ["college", "ncaa", "university"],
    prefixes: ["college:", "c:"],
    keywords: ["college", "ncaa", "university", "collegiate"],
    children: [
      {
        id: "college-michigan",
        name: "Michigan Wolverines",
        description: "Big Ten Conference",
        icon: GraduationCap,
        category: "College",
        tags: ["michigan", "wolverines", "big-ten"],
        keywords: ["michigan wolverines", "go blue", "ann arbor"],
        children: [
          { id: "michigan-football", name: "Football", description: "Big Ten football", icon: Football, category: "College", tags: ["football", "big-ten"], keywords: ["michigan football"], children: teamPages("michigan-football", "College") },
          { id: "michigan-basketball", name: "Basketball", description: "Dusty May era", icon: Basketball, category: "College", tags: ["basketball", "big-ten"], keywords: ["michigan basketball", "dusty may"], children: teamPages("michigan-basketball", "College") },
          { id: "michigan-hockey", name: "Hockey", description: "Big Ten hockey", icon: Hockey, category: "College", tags: ["hockey", "big-ten"], keywords: ["michigan hockey"], children: teamPages("michigan-hockey", "College") },
          { id: "michigan-baseball", name: "Baseball", description: "Big Ten baseball", icon: Baseball, category: "College", tags: ["baseball", "big-ten"], keywords: ["michigan baseball"], children: teamPages("michigan-baseball", "College") },
        ],
      },
      {
        id: "college-unc",
        name: "North Carolina Tar Heels",
        description: "ACC",
        icon: GraduationCap,
        category: "College",
        tags: ["unc", "carolina", "tar-heels", "acc"],
        keywords: ["north carolina tar heels", "chapel hill", "unc basketball"],
        children: [
          { id: "unc-basketball", name: "Basketball", description: "ACC basketball", icon: Basketball, category: "College", tags: ["basketball", "acc"], keywords: ["unc basketball", "tar heels basketball", "hubert davis"], children: teamPages("unc-basketball", "College") },
          { id: "unc-football", name: "Football", description: "ACC football", icon: Football, category: "College", tags: ["football", "acc"], keywords: ["unc football"], children: teamPages("unc-football", "College") },
        ],
      },
      {
        id: "college-lsu",
        name: "LSU Tigers",
        description: "SEC",
        icon: GraduationCap,
        category: "College",
        tags: ["lsu", "tigers", "sec"],
        keywords: ["lsu tigers", "baton rouge", "geaux tigers"],
        children: [
          { id: "lsu-football", name: "Football", description: "SEC football", icon: Football, category: "College", tags: ["football", "sec"], keywords: ["lsu football", "brian kelly"], children: teamPages("lsu-football", "College") },
          { id: "lsu-baseball", name: "Baseball", description: "SEC baseball — national powerhouse", icon: Baseball, category: "College", tags: ["baseball", "sec"], keywords: ["lsu baseball", "omaha"], children: teamPages("lsu-baseball", "College") },
        ],
      },
    ],
  },

  // ── Golf ──
  {
    id: "golf",
    name: "Golf (PGA Tour)",
    description: "Professional golf",
    icon: FlagPennant,
    category: "Golf",
    tags: ["golf", "pga", "pga-tour"],
    prefixes: ["golf:", "g:"],
    keywords: ["golf", "pga tour", "professional golf"],
    children: [
      {
        id: "golf-bhatia",
        name: "Akshay Bhatia",
        description: "PGA Tour",
        icon: User,
        category: "Golf",
        tags: ["akshay-bhatia", "player", "pga"],
        keywords: ["akshay bhatia"],
        children: [
          { id: "golf-bhatia-stats", name: "Stats", description: "Season statistics", icon: ChartBar, category: "Golf", tags: ["stats"], keywords: [] },
          { id: "golf-bhatia-schedule", name: "Tournament Schedule", description: "Upcoming events", icon: Calendar, category: "Golf", tags: ["schedule"], keywords: [] },
          { id: "golf-bhatia-results", name: "Results", description: "Recent finishes", icon: Trophy, category: "Golf", tags: ["results"], keywords: [] },
        ],
      },
      {
        id: "golf-koepka",
        name: "Brooks Koepka",
        description: "LIV Golf",
        icon: User,
        category: "Golf",
        tags: ["brooks-koepka", "player", "liv"],
        keywords: ["brooks koepka", "liv golf"],
        children: [
          { id: "golf-koepka-stats", name: "Stats", icon: ChartBar, category: "Golf", tags: ["stats"], keywords: [] },
          { id: "golf-koepka-results", name: "Results", icon: Trophy, category: "Golf", tags: ["results"], keywords: [] },
        ],
      },
      { id: "golf-leaderboard", name: "Live Leaderboard", description: "Current tournament standings", icon: TrendUp, category: "Golf", tags: ["leaderboard", "live", "scores"], keywords: ["live scores", "tournament", "leaderboard"] },
      { id: "golf-rankings", name: "World Rankings", description: "Official World Golf Ranking", icon: ListNumbers, category: "Golf", tags: ["rankings", "owgr"], keywords: ["world rankings", "owgr"] },
      { id: "golf-schedule", name: "PGA Tour Schedule", description: "Full season schedule", icon: Calendar, category: "Golf", tags: ["schedule", "events"], keywords: ["pga tour schedule", "tournaments"] },
    ],
  },

  // ── External ──
  { id: "espn", name: "ESPN", description: "Sports news & scores", icon: GlobeHemisphereWest, category: "External", tags: ["espn", "news", "scores", "external"], url: "https://espn.com", keywords: ["espn", "sports news"] },
  { id: "the-athletic", name: "The Athletic", description: "In-depth sports journalism", icon: Article, category: "External", tags: ["athletic", "journalism", "external"], url: "https://theathletic.com", keywords: ["the athletic", "journalism"] },
  { id: "sports-reference", name: "Sports Reference", description: "Stats & historical data", icon: ChartBar, category: "External", tags: ["stats", "reference", "data", "external"], url: "https://sports-reference.com", keywords: ["sports reference", "statistics", "historical"] },
  { id: "transfer-portal", name: "Transfer Portal", description: "NCAA transfer tracker", icon: TrendUp, category: "External", tags: ["transfer", "ncaa", "portal", "external"], url: "https://247sports.com/transfer-portal", keywords: ["transfer portal", "ncaa transfers"] },
  { id: "pga-tour", name: "PGA Tour Live", description: "Live scoring & coverage", icon: FlagPennant, category: "External", tags: ["golf", "pga", "live", "external"], url: "https://pgatour.com", keywords: ["pga tour live", "golf scores"] },
];

// Flatten all items recursively for global search
export function getAllItems(items: LauncherItem[] = manifest): LauncherItem[] {
  const result: LauncherItem[] = [];

  function traverse(item: LauncherItem) {
    result.push(item);
    if (item.children) {
      item.children.forEach(traverse);
    }
  }

  items.forEach(traverse);
  return result;
}
