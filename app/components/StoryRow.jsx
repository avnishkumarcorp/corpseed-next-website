"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StoryRow({ item }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      
      {/* Image */}
      <div
        className={`relative h-[260px] sm:h-[320px] lg:h-[360px] ${
          item.reverse ? "lg:col-span-5 lg:order-2" : "lg:col-span-5"
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`p-6 md:p-8 ${
          item.reverse ? "lg:col-span-7 lg:order-1" : "lg:col-span-7"
        }`}
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          {item.title}
        </h3>

        <p className="mt-3 text-gray-600 leading-relaxed">
          {item.desc}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 text-sm border border-gray-300 rounded-full text-gray-600 bg-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href={`/life-at-corpseed/${item.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}