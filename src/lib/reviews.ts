export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Ahmed Daahi",
    rating: 5,
    text: "The Mango Sunrise is absolutely incredible. Best fresh juice I've had in Jigjiga!",
    date: "2025-05-12",
  },
  {
    id: "r2",
    name: "Fatima Hassan",
    rating: 5,
    text: "Such a beautiful space and the smoothies are so creamy. My kids love the Berry Bliss.",
    date: "2025-05-08",
  },
  {
    id: "r3",
    name: "Omar Yusuf",
    rating: 4,
    text: "Great Jebena coffee and the sambusas are perfectly crispy. Will definitely come back.",
    date: "2025-04-28",
  },
  {
    id: "r4",
    name: "Sahra Ali",
    rating: 5,
    text: "Nadi Cafe feels like a hidden gem. Premium quality at fair prices. Highly recommend!",
    date: "2025-04-15",
  },
  {
    id: "r5",
    name: "Hassan Mohamed",
    rating: 5,
    text: "The Green Vitality juice gave me so much energy. Love that they use local ingredients.",
    date: "2025-04-02",
  },
];

export function getAverageRating(): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
