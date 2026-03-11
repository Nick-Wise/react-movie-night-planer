type StarRatingProps = {
  value?: number | null;
  max?: number;
};

function StarRating({ value = 0, max = 5 }: StarRatingProps) {
  return (
    <div aria-label={`Rating: ${value} out of ${max}`} className="flex gap-1 text-lg text-amber-300">
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;
        const filled = (value ?? 0) >= starNumber;
        const halfFilled = !filled && (value ?? 0) >= starNumber - 0.5;

        return (
          <span key={starNumber} className={filled || halfFilled ? "opacity-100" : "opacity-35"}>
            {halfFilled ? "⯪" : filled ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
