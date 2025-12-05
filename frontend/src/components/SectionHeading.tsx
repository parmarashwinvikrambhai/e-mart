interface sectionProps {
  title1: string;
  title2: string;
  title3?: string;
}

function SectionHeading({title1,title2,title3}:sectionProps) {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-2 items-center">
          <h1 className="text-4xl uppercase flex gap-2">
            <span className="text-gray-400">{title1}</span>
            <span>{title2}</span>
          </h1>
          <div className="w-10 h-0.5 bg-black"></div>
        </div>
        <span className="capitalize text-center max-w-3xl">{title3}</span>
      </div>
    </>
  );
}

export default SectionHeading