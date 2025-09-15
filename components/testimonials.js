"use client";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee.jsx";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure className="relative w-64 rounded-2xl bg-white/50 backdrop-blur-sm p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-purple-600">
            {name}
          </figcaption>
          <p className="text-xs text-zinc-600">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-zinc-600">{body}</blockquote>
    </figure>
  );
};

export default function Testimonials() {
  return (
    <section className="py-12 flex items-center bg-gradient-to-b from-purple-50 to-pink-100 rounded-half">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-purple-600">
          What People Are Saying
        </h2>
        <p className="text-zinc-600 text-center max-w-2xl mx-auto mb-12">
          Don&apos;t just take our word for it. Here&apos;s what real people are
          saying about our AI fashion platform.
        </p>
        <div className="space-y-8">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
