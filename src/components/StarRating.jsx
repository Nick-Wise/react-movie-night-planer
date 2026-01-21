function StarRating({ value = 0, max = 5 }) {
  return (
    <div className="rating-stars">
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;

        if (value >= starNumber) {
          return <span key={index}>★</span>;        // full
        }

        if (value >= starNumber - 0.5) {
          return <span key={index}>⯨</span>;        // half (placeholder)
        }

        return <span key={index}>☆</span>;          // empty
      })}
    </div>
  );
}

export default StarRating;