type CheckboxProps = {
    label: any;
    defaultChecked?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLInputElement>;
}

export const Checkbox = ({ label, defaultChecked, disabled, onClick }: CheckboxProps) => {
    return (
        <label
            className='flex items-center gap-x-2 py-1 cursor-pointer select-none'
            data-group='checkbox'
            data-disabled={disabled}
        >
            <input
                type='checkbox'
                defaultChecked={defaultChecked ?? false}
                disabled={disabled}
                {...onClick && { onClick }}
            />
            <span>
                {label}
            </span>
        </label>
    );
}; 