import React, { useState } from 'react';

// import { Container } from './styles';
import { Input } from 'antd';

const InputPrice = ({ value = {}, onChange }) => {
	const [number, setNumber] = useState(0);

	const triggerChange = (changedValue) => {
		if (onChange) {
			onChange({
				number,
				...value,
				...changedValue,
			});
		}
	};

	const onNumberChange = (e) => {
		const newNumber = parseInt(e.target.value || 0, 10);

		console.log(newNumber, 'value -', value);

		if (Number.isNaN(number)) {
			return;
		}

		if (!('number' in value)) {
			setNumber(newNumber);
		}

		triggerChange({
			number: newNumber,
		});
	};

	return (
		<Input
			type="text"
			value={value.number || number}
			onChange={onNumberChange}
			style={{
				width: 100,
			}}
		/>
	);
};

export default InputPrice;
