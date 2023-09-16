type TextInputProps = {
    label: string;
    defaultValue?: string | number | readonly string[] | undefined;
    disabled?: boolean;
    required?: boolean;
    marginTop?: boolean;
    onInput?: React.FormEventHandler<HTMLInputElement>
}

export const TextInput = ({ label, defaultValue, required, disabled, marginTop, onInput }: TextInputProps) => {
    return (
        <label className={`${marginTop ? 'mt-4' : 'mt-0'} flex flex-col items-stretch gap-y-1 cursor-pointer select-none`}
            data-group='text'
            data-disabled={disabled}
        >
            <span className='self-start'>
                {label}
            </span>
            <input
                type='text'
                defaultValue={defaultValue ?? ''}
                spellCheck={false}
                required={required}
                disabled={disabled}
                {...onInput && { onInput }}
            />
        </label>
    );
};  