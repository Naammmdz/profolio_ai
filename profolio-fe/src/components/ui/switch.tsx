import { Switch as BaseSwitch } from '@base-ui/react/switch';
import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
}

export function Switch({ checked, onChange, disabled, id }: SwitchProps) {
    return (
        <BaseSwitch.Root
            id={id}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                width: '36px',
                height: '20px',
                borderRadius: '9999px',
                backgroundColor: checked ? 'var(--primary)' : '#d1d5db',
                border: 'none',
                padding: 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                flexShrink: 0,
                outline: 'none',
                position: 'relative',
            }}
        >
            <BaseSwitch.Thumb
                style={{
                    display: 'block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    transform: checked ? 'translateX(19px)' : 'translateX(3px)',
                    transition: 'transform 0.2s ease',
                }}
            />
        </BaseSwitch.Root>
    );
}
