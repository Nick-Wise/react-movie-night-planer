type StateMessageProps = {
  title: string;
  description: string;
  tone?: "default" | "danger";
};

function StateMessage({ title, description, tone = "default" }: StateMessageProps) {
  const toneClasses =
    tone === "danger"
      ? "border-danger/40 bg-danger/10 text-danger"
      : "border-border bg-bg-surface text-text-secondary";

  return (
    <div className={`rounded-[1.75rem] border p-6 ${toneClasses}`}>
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}

export default StateMessage;
