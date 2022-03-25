import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

const TimeFilter = forwardRef((props, ref) => {
	const [type, setType] = useState("1");
	const [time, setTime] = useState(null);

	// expose AG Grid Filter Lifecycle callbacks
	useImperativeHandle(ref, () => {
		return {
			doesFilterPass(params) {
				return params.data.time_in >= time;
			},

			isFilterActive() {
				return type === '0';
			},

			// this example isn't using getModel() and setModel(),
			// so safe to just leave these empty. don't do this in your code!!!
			getModel() { },

			setModel() { },
		};
	});

	const handleTypeChange = (event) => {
		setType(event.target.value);
	};

	const handleTimeChange = (event) => {
		setType("0")
		setTime(event.target.value);
	};

	useEffect(() => {
		props.filterChangedCallback();
	}, [props, type, time]);

	return (
		<div
			style={{ display: 'inline-block' }}
		>
			{/* <div
				style={{
					padding: '10px',
					backgroundColor: '#d3d3d3',
					textAlign: 'center',
				}}
			>
				This is a very wide filter
			</div> */}
			<div className="time_filter" style={{ display: 'flex', alignItems: 'center' }}>
				<label
					style={{
						padding: '10px',
						display: 'flex',
						alignItems: 'center',
						borderRight: '1px solid #ddd'
						// backgroundColor: '#999999',
					}}
				>
					<input type="radio" name="radio_type" value="1" checked={type === "1"} onChange={handleTypeChange} />
					<p style={{ margin: '0', paddingLeft: '5px' }}>All</p>
				</label>
				<label
					style={{
						padding: '10px',
						display: 'flex',
						alignItems: 'center'
						// backgroundColor: '#999999',
					}}
				>
					<p style={{ margin: '0', paddingLeft: '5px' }}>
						<input type="radio" name="radio_type" value="0" checked={type === "0"} onChange={handleTypeChange} />
					</p>
					<p style={{ margin: '0', paddingLeft: '5px' }}>
						<input type="time" name="time" value={time} onChange={handleTimeChange} style={{ boxShadow: 'none', border: '1px solid #ddd', padding: '0 10px', height: '25px' }} /> Time
					</p>
				</label>
			</div>
		</div>
	);
});

export const FloatingTimeFilter = forwardRef((props, ref) => {
	const inputRef = useRef(null);
	const [currentValue, setCurrentValue] = useState(null);

	// const style = {
	// 	color: props.color,
	// 	width: '30px',
	// };

	// expose AG Grid Filter Lifecycle callbacks
	useImperativeHandle(ref, () => {
		return {
			onParentModelChanged(parentModel) {
				// When the filter is empty we will receive a null value here
				if (!parentModel) {
					inputRef.current.value = '';
					setCurrentValue(null);
				} else {
					inputRef.current.value = parentModel.filter + '';
					setCurrentValue(parentModel.filter);
				}
			},
		};
	});


	const onInputBoxChanged = (input) => {
		if (input.target.value === '') {
			// Remove the filter
			props.parentFilterInstance((instance) => {
				instance.onFloatingFilterChanged(null, null);
			});
			return;
		}

		setCurrentValue(input.target.value);
		props.parentFilterInstance((instance) => {
			instance.onFloatingFilterChanged('greaterThan', input.target.value);
		});
	};

	return (
		<input ref={inputRef} type="time" name="time" value={currentValue} onChange={onInputBoxChanged} />
	)
})

export default TimeFilter
