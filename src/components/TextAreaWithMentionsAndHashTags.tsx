import {
  ChangeEventHandler,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  FocusEvent,
} from 'react';
import { resizeTextAreaHeight } from '@/lib/resizeTextAreaHeight';
import { cn } from '@/lib/cn';
import { AriaTextFieldProps, mergeProps, useTextField } from 'react-aria';

interface TextAreaWithMentionsAndHashTagsProps extends Omit<AriaTextFieldProps, 'onFocus' | 'onBlur'> {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  placeholder: string;
  shouldFocusOnMount?: boolean;
  errorMessage?: ReactNode | (() => ReactNode);
  className?: string;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaWithMentionsAndHashTags({
  content,
  setContent,
  placeholder,
  shouldFocusOnMount = true,
  ...rest
}: TextAreaWithMentionsAndHashTagsProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { inputProps, labelProps, errorMessageProps } = useTextField(
    { ...rest, inputElementType: 'textarea', label: placeholder },
    textareaRef,
  );
  const { errorMessage } = rest;

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const { target } = event;
    setContent(target.value);
  };

  // Since the `TextArea` is in `absolute` position, the container won't auto-resize
  // according to the height of the `TextArea`, we can set it manually instead
  useEffect(() => {
    if (containerRef.current) containerRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
  }, [content]);

  useEffect(() => {
    // Focus the `TextArea` on mount if requested
    if (!shouldFocusOnMount) return;

    textareaRef.current?.focus();
    // Set the cursor position to the end of the `TextArea`'s value
    const start = textareaRef.current?.value.length || 0;
    textareaRef.current?.setSelectionRange(start, start);
  }, [shouldFocusOnMount]);

  return (
    <>
      <div className="relative bg-transparent" ref={containerRef}>
        <label {...labelProps} className="sr-only">
          {placeholder}
        </label>
        <textarea
          ref={textareaRef}
          {...mergeProps(inputProps, {
            value: content,
            onChange: handleTextareaChange,
            onInput: (e: FormEvent<HTMLTextAreaElement>) => {
              const textarea = e.target as HTMLTextAreaElement;
              resizeTextAreaHeight(textarea);
            },
            rows: 1,
            placeholder,
          })}
          className={cn(
            'w-full resize-none overflow-hidden break-words bg-transparent outline-none',
            'placeholder:text-muted-foreground',
            rest.errorMessage && 'rounded-sm ring-2 ring-red-900 ring-offset-4 placeholder:text-red-900',
            rest.className,
          )}
        />
      </div>
      {errorMessage !== undefined && (
        <p {...errorMessageProps} className="mt-4 font-semibold text-red-800">
          {typeof errorMessage === 'function' ? (errorMessage as () => ReactNode)() : errorMessage}
        </p>
      )}
    </>
  );
}
