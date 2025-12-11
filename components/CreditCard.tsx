import 'react-credit-cards-2/dist/es/styles-compiled.css';

import Cards, { Focused } from 'react-credit-cards-2';
import React, { useState } from 'react';

import { Box } from '@chakra-ui/react';

const CreditCard = () => {
    const [state, setState] = useState<{
        number: string;
        expiry: string;
        cvc: string;
        name: string;
        focus: Focused | undefined;
    }>({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: undefined,
    });

    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;

        setState((prev) => ({ ...prev, [name]: value }));
    }

    const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
        setState((prev) => ({ ...prev, focus: evt.target.name as Focused }));
    }

    return (
        <Box>
            <Cards
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.name}
                focused={state.focus}
            />
            <form>
                <input
                    type="number"
                    name="number"
                    placeholder="Card Number"
                    value={state.number}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <input
                    type="number"
                    name="expiry"
                    placeholder="Expiry Date"
                    value={state.expiry}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <input
                    type="number"
                    name="cvc"
                    placeholder="CVV"
                    value={state.cvc}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={state.name}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
            </form>
        </Box>
    );
}

export default CreditCard;