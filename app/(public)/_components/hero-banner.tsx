import Image from "next/image";

const heroRows = [
  [
    {
      src: "/assets/images/home/frame-1.png",
      className: "flex-1 relative h-60",
    },
    {
      src: "/assets/images/home/frame-2.png",
      className: "flex-1 relative h-60",
    },
    {
      src: "/assets/images/home/frame-3.png",
      className: "w-60 shrink-0 relative h-60",
    },
  ],
  [
    {
      src: "/assets/images/home/frame-4.png",
      className: "w-60 shrink-0 relative h-60",
    },
    {
      src: "/assets/images/home/frame-5.png",
      className: "flex-1 relative h-60",
    },
    {
      src: "/assets/images/home/frame-6.png",
      className: "w-32 shrink-0 relative h-60",
    },
  ],
];

export const HeroBanner = () => {
  return (
    <section className="py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full grid gap-4">
          {heroRows.map((row, rowIdx) => (
            <div className="flex gap-3" key={rowIdx}>
              {row.map((img, imgIdx) => (
                <div className={img.className} key={imgIdx}>
                  <Image
                    src={img.src}
                    alt="card.title"
                    fill
                    className="object-cover rounded-3xl"
                    priority
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
