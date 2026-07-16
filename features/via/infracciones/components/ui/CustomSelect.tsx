import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
    value: string | number;
    label: string | number;
}

interface CustomSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    name?: string;
    onOpenChange?: (open: boolean) => void;
}

export function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Selecciona una opción',
    disabled = false,
    error = false,
    name,
    onOpenChange,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        onOpenChange?.(open);
    }, [open, onOpenChange]);

    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpen(false);
                setActiveIndex(-1);
            }
            if (!open) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev < options.length - 1 ? prev + 1 : 0
                );
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : options.length - 1
                );
            }
            if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                onChange(options[activeIndex].value);
                setOpen(false);
                setActiveIndex(-1);
            }
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, options, activeIndex, onChange]);

    const triggerClasses = [
        'flex w-full items-center justify-between gap-2 px-3 py-2',
        'rounded-lg border bg-white text-sm transition-all cursor-pointer',
        open
            ? 'border-primary ring-2 ring-primary/15'
            : error
                ? 'border-red-400'
                : 'border-slate-200 hover:border-primary',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="relative" ref={wrapperRef}>
            <input type="hidden" name={name} value={value} />

            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((prev) => !prev)}
                className={triggerClasses}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={name ? `${name}: ${selectedLabel ?? placeholder}` : placeholder}
            >
                <span
                    className={`flex-1 text-left truncate ${!selectedLabel ? 'text-slate-400' : 'text-slate-900'
                        }`}
                >
                    {selectedLabel ?? placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    strokeWidth={1.5}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-label={placeholder}
                    className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-lg border border-slate-200 bg-white shadow-md overflow-y-auto max-h-[184px]"
                >
                    <li>
                        <button
                            type="button"
                            role="option"
                            aria-selected={value === ''}
                            onClick={() => {
                                onChange('');
                                setOpen(false);
                            }}
                            className="w-full px-3 py-2.5 text-left text-sm text-slate-400 hover:bg-primary-muted hover:text-primary transition-colors"
                        >
                            {placeholder}
                        </button>
                    </li>
                    {options.map((opt, i) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={value === opt.value}
                                ref={i === activeIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                    setActiveIndex(-1);
                                }}
                                className={[
                                    'w-full px-3 py-2.5 text-left text-sm leading-snug transition-colors',
                                    'whitespace-normal break-words',
                                    i > 0 ? 'border-t border-slate-100' : '',
                                    value === opt.value
                                        ? 'bg-primary-muted text-primary font-medium'
                                        : 'text-slate-700 hover:bg-primary-muted hover:text-primary',
                                    i === activeIndex ? 'bg-primary-muted' : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
