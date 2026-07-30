export const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-1 py-2 text-[14.5px] font-semibold transition-colors after:absolute after:bottom-0.5 after:left-0 after:h-0.5 after:bg-brand after:transition-all after:duration-300 ${
    isActive
      ? "text-brand after:w-full"
      : "text-ink-soft after:w-0 hover:text-brand hover:after:w-full"
  }`;
