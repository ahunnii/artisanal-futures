const DotPattern = () => {
  return (
    <svg
      className="-z-1 absolute inset-0"
      width={720}
      height={240}
      fill="none"
      viewBox="0 0 720 240"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x={0}
          y={0}
          width={31.5}
          height={31.5}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={1.5}
            cy={1.5}
            r={1.5}
            className="text-gray-100 dark:text-gray-700"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width={720} height={240} fill="url(#dot-pattern)" />
    </svg>
  );
};

export default DotPattern;
