import { useState } from 'react';

export function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    const handleChange = (event, activeTab) => {
        const { name, value } = event.target;
        const updatedValues = activeTab ? {
            ...values,
            [activeTab]: {
                ...values[activeTab],
                [name]: value,
            },
        } : {
            ...values,
            [name]: value,
        };

        setValues(updatedValues);
    };

    return { values, handleChange };
}