import type { ChangeEvent } from "react";
import type { ReactNode } from "react";

type InputFieldProps = {
  icon: ReactNode;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
        {icon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

export default InputField;