import { notification } from "antd";

const vsmAuth = {
	success: "Logged in successful",
	validation: {
		email: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 8,
				message: "It must have at least eight characters",
			},
			// {
			// 	pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
			// 	message: "Invalid email address, please enter the valid email address",
			// },
		],
		password: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 8,
				message: "Password must have at least 8 characters",
			},
			{
				max: 20,
				message: "Maximum length for Password is 20 characters",
			},
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@_-])[a-zA-Z0-9@_-]{1,}$/,
				message:
					"Password must have one lowercase, one uppercase, one digit and one special character(_, -, @).",
			},
		],
		confirmpassword: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(rule, value) {
					if (!value || getFieldValue("new_password") === value) {
						return Promise.resolve();
					}
					return Promise.reject(
						"New Password and Confirm Password does not match."
					);
				},
			}),
		],
	},
};

const vsmCommon = {
	noRecord: "No Records Found.",
};

const vsmState = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "State name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmCity = {
	success: "Successfully Created",
	error: "City name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		state_id: [{ required: true, message: "It is not selected." }],
	},
};

const vsmArea = {
	success: "Successfully Created",
	error: "Area name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		state_id: [{ required: true, message: "It is not selected." }],
		location_id: [{ required: true, message: "It is not selected." }],
		ia_id: [{ required: true, message: "It is not selected." }],
		city_id: [{ required: true, message: "It is not selected." }],
		latitude: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^(-?\d+(\.\d+)?)$/, message: "It must be a floating point number" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const latitude = parseFloat(getFieldValue("latitude"))
					if (latitude === 0) {
						return Promise.reject("It cannot be ZERO");
					}
					return Promise.resolve();
				},
			}),
			{
				max: 50,
				message: "Max length is 50",
			},
		],
		longitude: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^(-?\d+(\.\d+)?)$/, message: "It must be a floating point number" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const longitude = parseFloat(getFieldValue("longitude"))
					if (longitude === 0) {
						return Promise.reject("It cannot be ZERO");
					}
					return Promise.resolve();
				},
			}),
			{
				max: 50,
				message: "Max length is 50",
			},
		],
	},
};

const vsmLocation = {
	success: "Successfully Created",
	error: "Location name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "It must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		short_name: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 10,
				message: "Maximum length is 10 characters.",
			},
		],
		primary_number: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters.",
			},
			// {
			// 	max: 20,
			// 	message: "Maximum Number is 20 character",
			// },
		],
		alternate_number1: [
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters.",
			},
			// {
			// 	max: 20,
			// 	message: "Maximum Number is 20 character",
			// },
		],
		alternate_number2: [
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
			// {
			// 	max: 20,
			// 	message: "Maximum Number is 20 character",
			// },
		],
		dms_costing: [
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const dms_costing = getFieldValue("dms_costing")
					if (dms_costing > 9999999) {
						return Promise.reject("Maximum value is 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		zone_id: [{ required: true, message: "It is not selected" }],
		apply_disc_on: [{ required: true, message: "It is not selected" }],
		address1: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		address2: [
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		state: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		city: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		zipcode: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 10,
				message: "Maximum length is 10 characters",
			},
			{
				pattern: /^[0-9\b]+$/,
				message: "Only Numbers allowed.",
			},
		],
		sales_contact: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
		],
		sales_phone: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
		],
		sales_email: [
			{ required: true, message: "It cannot be blank" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		service_contact: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
		],
		service_phone: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
		],
		service_email: [
			{ required: true, message: "It cannot be blank" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				min: 3,
				message: "Minimum length is 3 characters.",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		municipality_tax: [
			{ required: true, message: "It cannot be blank" },
			{
				pattern: /^[0-9\b]+$/,
				message: "Only Numbers allowed.",
			},
			{
				min: 1,
				message: "It cannot be <0 and > 99,99,999.",
			},
			{
				max: 7,
				message: "It cannot be <0 and > 99,99,999.",
			},
		],
	},
};

const vsmInquiryArea = {
	success: "Successfully Created",
	error: "Inquiry Area name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		location_id: [{ required: true, message: "It is not selected." }],
		color: [{ required: true, message: "It cannot be blank" }],
	},
};

const vsmPremises = {
	success: "Successfully Created",
	error: "Premises name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		location_id: [{ required: true, message: "It is not selected." }],
		type_id: [{ required: true, message: "It is not selected." }],
		address_line: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "It must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		address_line1: [
			{
				min: 3,
				message: "It must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		state_id: [{ required: true, message: "It is not selected" }],
		city_id: [{ required: true, message: "It is not selected" }],
		zipcode: [
			{ required: true, message: "It cannot be blank." },
			{
				pattern: /^[0-9\b]+$/,
				message: "Only Numbers allowed.",
			},
		],
		short_name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "It must have at least three characters",
			},
			{
				max: 3,
				message: "It must have at least three characters",
			},
		],
		primary_number: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
		],
		alternate_number1: [
			{
				min: 10,
				message: "Minimum length is 10 characters.",
			},
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
			// {
			// 	max: 20,
			// 	message: "Maximum Number is 20 character",
			// },
		],
	},
};

const vsmPremisesType = {
	success: "Successfully Created",
	error: "Premises Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmDSA = {
	success: "Successfully Created",
	error: "DSA already exists",
	validation: {
		location_id: [{ required: true, message: "It is not selected." }],
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "It must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		contact_no: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 10,
				message: "Minimum length for contact number is 10 characters",
			},
			{
				max: 20,
				message: "Maximum length for contact number is 20 characters",
			},
		],
		email: [
			// { required: true, message: "Email cannot be blank." },
			// {
			// 	pattern: /^[0-9]{1,100}$/,
			// 	message: "Maximum length is 20 character",
			// },
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		pan_card: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 10,
				message: "Maximum length for pan is 10 characters",
			},
		],
		// pan_card: [{ required: true, message: "Pan Card cannot be blank" }],
		created_by: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length for created by is 3 characters",
			},
			{
				max: 50,
				message: "Maximum length for created by is 50 characters",
			},
		],
		pan_upload: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("pan_image") ||
						getFieldValue("pan_image").fileList.length === 0
					) {
						return Promise.reject("Pan card image is not selected.");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmDepartment = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Department name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmDesignation = {
	success: "Successfully Created",
	error: "Designation name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		department_id: [
			{ required: true, message: "It is not selected." },
		],
	},
};

const vsmBank = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Bank name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		plowback_per: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be a valid number between 0 to 100" },
			// { pattern: /^([0-9]+)$/, message: "It must be a valid number between 0 to 100" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const plowback_per = getFieldValue("plowback_per")
					if (plowback_per > 100) {
						return Promise.reject("It must be a valid number between 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		payout_per: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be a valid number between 0 to 100" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const payout = getFieldValue("payout_per")
					if (payout > 100) {
						return Promise.reject("It must be a valid number between 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		our_bank: [{ required: true, message: "It is not selected" }],
	},
};

const vsmSegment = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Segment name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmBrand = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Brand name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 2,
				message: "Name must have at least two characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmSupplier = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Supplier name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmWhiteListIPs = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		title: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Title must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for title is 50 characters",
			},
		],
		location_id: [{ required: true, message: "It is not selected" }],
		ip_address: [
			{ required: true, message: "It cannot be blank" },
			{
				pattern: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
				message: "Invalid IP Address format",
			},
		],
	},
};

const vsmFuelOption = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Fuel Option already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmTransmissionType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Transmission Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmVehicleType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Vehicle Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmPurchaseType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Purchase Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmCharacteristics = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Characteristics already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmFamilyMember = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Family Member already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmBuyingFor = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Buying For already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmCompanyProfileCS = {
	success: "Successfully updated",
	edit: "Successfully Updated",
	// error: "Family Member already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		address_line_1: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Address Line 1 must have at least three characters",
			},
			{
				max: 100,
				message: "Maximum length for Address Line 1 is 100 characters",
			},
		],
		address_line_2: [
			{
				min: 3,
				message: "Address Line 2 must have at least three characters",
			},
			{
				max: 100,
				message: "Maximum length for Address Line 2 is 100 characters",
			},
		],
		city: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "The city must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for the city is 50 characters",
			},
		],
		state: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "The state must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for the state is 50 characters",
			},
		],
		zipcode: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "The Zipcode must have at least three characters",
			},
			{
				max: 10,
				message: "Maximum length for the Zipcode is 10 characters",
			},
		],
		contact: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "The Contact Person must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for the Contact Person is 50 characters",
			},
		],
		email: [
			{ required: true, message: "It cannot be blank." },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				max: 100,
				message: "Maximum length for the Email is 100 characters",
			},
		],
		primary_phone: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 10,
				message: "The Primary Phone must have at least 10 characters",
			},
			{
				max: 20,
				message: "Maximum length for the Primary Phone is 20 characters",
			},
		],
		secondary_phone: [
			{
				min: 10,
				message: "The Alternate Phone must have at least 10 characters",
			},
			{
				max: 20,
				message: "Maximum length for the Alternate Phone is 20 characters",
			},
		],
		designation: [{ required: true, message: "It cannot be blank." }, {
			min: 3,
			message: "The Designation must have at least 3 characters",
		},
		{
			max: 20,
			message: "Maximum length for the Designation is 20 characters",
		},],
	},
};

const vsmLogoUploadCS = {
	success: "Logo file is successfully uploaded",
	validation: {
		logo_file: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("logo_file") ||
						getFieldValue("logo_file").fileList.length === 0
					) {
						return Promise.reject("You must select a logo file.");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmHeroimageCS = {
	success: "Hero Image file is successfully uploaded",
	validation: {
		hero_image_file: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("hero_image_file") ||
						getFieldValue("hero_image_file").fileList.length === 0
					) {
						return Promise.reject("You must select a Hero Image file.");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmFavIconCS = {
	success: "Fav icon is successfully uploaded",
	validation: {
		favicon_file: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("favicon_file") ||
						getFieldValue("favicon_file").fileList.length === 0
					) {
						return Promise.reject("You must select a Fav Icon file.");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmEmailBannerCS = {
	success: "Email Banner file is successfully uploaded",
	validation: {
		email_banner_file: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("email_banner_file") ||
						getFieldValue("email_banner_file").fileList.length === 0
					) {
						return Promise.reject("You must select a Email Banner file.");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmDriveCar = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Drive Car already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmDailyRun = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Daily Run already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmDrivenMode = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Driven Mode already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmGST = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "GST already exists",
	validation: {
		GST: [
			{ required: true, message: "It cannot be blank." },
			// { pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be a number between 0 to 99.99" },
			{ pattern: /^(-?\d+(\.\d+)?)$/, message: "It must be a number between 0 to 99.99" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("GST") > 99.99) {
						return Promise.reject("It must be a number between 0 to 99.99");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmCC = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "CC already exists",
	validation: {
		CC: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
	},
};

const vsmNCBPer = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		per_value: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It allows digits and decimal only." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const per_value = parseInt(getFieldValue("per_value"))
					if (per_value < 0 || per_value > 100) {
						return Promise.reject("Valid range is 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmAddOns = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		charge_type: [
			{ required: true, message: "It is not selected." },
		]
	},
};

const vsmDepreciationRates = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		from_age: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const from_age = parseInt(getFieldValue("from_age"))
					if (from_age < 0 || from_age > 999) {
						return Promise.reject("Valid range is 0 to 999");
					}
					return Promise.resolve();
				},
			}),
		],
		to_age: [
			{ required: true, message: "It is not selected." },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const to_age = parseInt(getFieldValue("to_age"))
					const from_age = parseInt(getFieldValue("from_age"))
					if (to_age < 0 || to_age > 999) {
						return Promise.reject("Valid range is 0 to 999");
					}
					if (to_age < from_age) {
						return Promise.reject("It must be either same or higher than From Age");
					}
					return Promise.resolve();
				},
			}),
		],
		rate: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It allows digits and decimal only." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const rate = parseInt(getFieldValue("rate"))
					if (rate < 0 || rate > 100) {
						return Promise.reject("Valid range is 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		]
	},
};

const vsmColors = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Color already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		mfg_name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Mfg. Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for Mfg. name is 50 characters",
			},
		],
		model_id: [{ required: true, message: "It is not selected." }],
		brand_id: [{ required: true, message: "It is not selected." }],
	},
};

const vsmAccessoryType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Accessory Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmModel = {
	success: "Successfully Created",
	error: "City name already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 2,
				message: "Name must have at least two characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		mfg_name: [
			// { required: true, message: "It cannot be blank." },
			{
				min: 2,
				message: "Mfg. Name must have at least two characters",
			},
			{
				max: 50,
				message: "Maximum length for Mfg. name is 50 characters",
			},
		],
		brand_id: [{ required: true, message: "It is not selected." }],
		segment_id: [{ required: true, message: "It is not selected." }],
		booking_amount: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const booking_amount = parseInt(getFieldValue("booking_amount"))
					if (booking_amount > 9999999) {
						return Promise.reject("It must be valid integer in range 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		rto_individual: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("rto_individual") > 100) {
						return Promise.reject("It must be between 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		rto_company: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("rto_company") > 100) {
						return Promise.reject("It must be between 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		handling_charges: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const handling_charges = parseInt(getFieldValue("handling_charges"))
					if (handling_charges > 0 && handling_charges < 1) {
						return Promise.reject("It must be a positive value");
					}
					return Promise.resolve();
				},
			}),
		],
		pms: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pms = parseInt(getFieldValue("pms"))
					if (pms > 0 && pms < 1) {
						return Promise.reject("It must be a positive value");
					}
					return Promise.resolve();
				},
			}),
		],
		extended_warrenty: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const extended_warrenty = parseInt(getFieldValue("extended_warrenty"))
					if (extended_warrenty > 0 && extended_warrenty < 1) {
						return Promise.reject("It must be a positive value");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmCompanyPreference = {
	success: "Successfully Created",
	error: "Preferences already exists",
	validation: {
		brand_id: [{ required: true, message: "It is not selected." }],
		session_timeout: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be 1 to 24 hours" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const session_timeout = parseInt(getFieldValue("session_timeout"))
					if (session_timeout === 0) {
						return Promise.reject("It must be a non-zero positive integer number.")
					}
					else if (
						session_timeout > 0 && (session_timeout < 1 || session_timeout > 24)
					) {
						return Promise.reject("It must be 1 to 24 hours");
					}
					return Promise.resolve();
				},
			}),
		],
		cash_limit: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
		],
		crtm: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
		],
		handling_charges: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
		],
		fastag: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
		],
		municipality_tax: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
		],
		tcs: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It allows digits and float only" },
		],
		pms: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
		],
		extended_warrenty: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const extended_warrenty = parseInt(getFieldValue("extended_warrenty"))
					if (extended_warrenty === 0) {
						return Promise.reject("It must be a non-zero positive integer number.")
					}
					else if (extended_warrenty > 0 && extended_warrenty < 1) {
						return Promise.reject("It must be a positive value");
					}
					return Promise.resolve();
				},
			}),
		],
		purchase_email: [
			{ required: true, message: "It cannot be blank" },
			{ max: 100, message: "Maximum length is 100 characters" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Invalid email format",
			},
		],
		sales_email: [
			{ required: true, message: "It cannot be blank" },
			{ max: 100, message: "Maximum length is 100 characters" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Invalid email format",
			},
		],
		operation_email: [
			{ required: true, message: "It cannot be blank" },
			{ max: 100, message: "Maximum length is 100 characters" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Invalid email format",
			},
		],
		inquire_closure_days: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be 10 to 120 days" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const inquire_closure_days = parseInt(getFieldValue("inquire_closure_days"))
					if (inquire_closure_days === 0) {
						return Promise.reject("It must be a non-zero positive integer number.")
					}
					else if (
						inquire_closure_days > 0 && (inquire_closure_days < 10 || inquire_closure_days > 120)
					) {
						return Promise.reject("It must be 10 to 120 days");
					}
					return Promise.resolve();
				},
			}),
		],
		inquiry_extension_days: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be 10 to 60 days" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const inquiry_extension_days = parseInt(getFieldValue("inquiry_extension_days"))
					if (inquiry_extension_days === 0) {
						return Promise.reject("It must be a non-zero positive integer number.")
					}
					else if (
						inquiry_extension_days > 0 && (inquiry_extension_days < 10 || inquiry_extension_days > 60)
					) {
						return Promise.reject("It must be 10 to 60 days");
					}
					return Promise.resolve();
				},
			}),
		],
		exchange_period: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be between 1 to 15" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const exchange_period = parseInt(getFieldValue("exchange_period"))
					if (exchange_period === 0) {
						return Promise.reject("It must be a non-zero positive integer number between 1 to 15.")
					}
					else if (
						exchange_period > 0 && (exchange_period < 1 || exchange_period > 15)
					) {
						return Promise.reject("It must be between 1 to 15");
					}
					return Promise.resolve();
				},
			}),
		],
		mfg_cpd: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("mfg_cpd") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		cancellation_chrg_per: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("cancellation_chrg_per") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		max_cancellation_chrg: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const max_cancellation_chrg = parseInt(getFieldValue("max_cancellation_chrg"))
					if (max_cancellation_chrg > 9999) {
						return Promise.reject("It must be a value in range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
		max_acc_disc: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("max_acc_disc") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		fin_tds: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("fin_tds") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		fin_st: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("fin_st") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		ins_acc_rate: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("ins_acc_rate") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		ins_tp_cng_rate: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ins_tp_cng_rate = parseInt(getFieldValue("ins_tp_cng_rate"))
					if (ins_tp_cng_rate > 9999) {
						return Promise.reject("It must be a value in range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
		ins_ll_rate: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ins_ll_rate = parseInt(getFieldValue("ins_ll_rate"))
					if (ins_ll_rate > 9999) {
						return Promise.reject("It must be a value in range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmAccessory = {
	success: "Successfully Created",
	error: "Accessory already exists",
	validation: {
		model_id: [{ required: true, message: "It is not selected." }],
		at_id: [{ required: true, message: "It is not selected." }],
		pt_id: [{ required: true, message: "It is not selected." }],
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		part_number: [
			{
				min: 3,
				message: "Minimum length for Part Number is 3 characters",
			},
			{
				max: 50,
				message: "Maximum length for Part Number is 50 characters",
			},
		],
		mrp: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const mrp = getFieldValue("mrp");
					if (mrp) {
						if (mrp > 99999) {
							return Promise.reject("Max value should not exceed 99,999");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		margin: [
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const margin = getFieldValue("margin")
					if (margin) {
						if (margin > 99999) {
							return Promise.reject("Max value should not exceed 99,999");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		lock: [{ required: true, message: "It cannot be blank" }],
	},
};
const vsmVariants = {
	success: "Successfully Created",
	validation: {
		brand_id: [{ required: true, message: "It is not selected." }],
		model_id: [{ required: true, message: "It is not selected." }],
		cc_id: [{ required: true, message: "It is not selected." }],
		bc_id: [{ required: true, message: "It is not selected." }],
		tt_id: [{ required: true, message: "It is not selected." }],
		fo_id: [{ required: true, message: "It is not selected." }],
		cng_flag: [{ required: true, message: "It is not selected." }],
		name: [
			{ required: true, message: "It cannot be blank." },
			{ min: 3, message: "It must have at least three characters." },
			{ max: 50, message: "Maximum length for name is 50 characters." },
		],
		mfg_name: [
			{ required: true, message: "It cannot be blank." },
			{ min: 3, message: "Name must have at least three characters." },
			{ max: 50, message: "Maximum length for name is 50 characters." },
		],
		make_year: [{ required: true, message: "It is not selected." }],
		vin_year: [{ required: true, message: "It is not selected." }],
		basic_price: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const basic_price = getFieldValue("basic_price");
					if (basic_price > 99999999) {
						return Promise.reject("It cannot exceed 9,99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		passengers: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const passengers = getFieldValue("passengers");
					if (passengers > 99) {
						return Promise.reject("It cannot exceed 99");
					}
					return Promise.resolve();
				},
			}),
		],
		weight: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const weight = getFieldValue("weight");
					if (weight > 9999) {
						return Promise.reject("It cannot exceed 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
		discount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const discount = getFieldValue("discount");
					if (discount) {
						if (discount > 9999999) {
							return Promise.reject("It cannot exceed 99,99,999");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		discounted_price: [
			// { required: true, message: "It cannot be blank." },
		],
		transit_insurance: [
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const transit_insurance = getFieldValue("transit_insurance");
					if (transit_insurance) {
						if (transit_insurance > 9999999) {
							return Promise.reject("It cannot exceed 99,99,999");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		road_deli_charges: [
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const road_deli_charges = getFieldValue("road_deli_charges");
					if (road_deli_charges) {
						if (road_deli_charges > 9999999) {
							return Promise.reject("It cannot exceed 99,99,999");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		dealer_margin: [
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("dealer_margin")) {
						const dealer_margin = getFieldValue("dealer_margin");
						if (dealer_margin > 9999999) {
							return Promise.reject("It cannot exceed 99,99,999");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		handling_charges: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const handling_charges = getFieldValue("handling_charges");
					// if (handling_charges <= 0) {
					// 	return Promise.reject("It cannot be <= 0 and => 99,99,999.");
					// }
					if (handling_charges > 9999999) {
						return Promise.reject("It cannot be < 0 and > 99,99,999.");
					}
					return Promise.resolve();
				},
			}),
		],
		total_charges: [],
		ex_show_without_gst: [],
		gst_id: [{ required: true, message: "It is not selected." }],
		gst: [],
		rto_per: [{ required: true, message: "It is not selected." }],
		ex_show_price: [],
		pms: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pms = getFieldValue("pms");
					// if (pms < 0) {
					// 	return Promise.reject("It cannot be < 0 and => 99,99,999.");
					// }
					if (pms > 9999999) {
						return Promise.reject("It cannot be < 0 and > 99,99,999.");
					}
					return Promise.resolve();
				},
			}),
		],
		extended_warrenty: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const extended_warrenty = getFieldValue("extended_warrenty");
					// if (extended_warrenty <= 0) {
					// 	return Promise.reject("It cannot be <= 0 and => 99,99,999.");
					// }
					if (extended_warrenty > 9999999) {
						return Promise.reject("It cannot be < 0 and > 99,99,999.");
					}
					return Promise.resolve();
				},
			}),
		],
		csd_ex_show_price: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const csd_ex_show_price = getFieldValue("csd_ex_show_price");
					// if (csd_ex_show_price < 0) {
					// 	return Promise.reject("It cannot be < 0 and => 99,99,999.");
					// }
					if (csd_ex_show_price > 9999999) {
						return Promise.reject("It cannot be < 0 and > 99,99,999.");
					}
					return Promise.resolve();
				},
			}),
		],
		is_metalic: [],
		ins_amt: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ins_amt = parseInt(getFieldValue("ins_amt"));
					if (ins_amt === 0) {
						return Promise.reject("It must be an integer with range 1 to 99,999");
					}
					if (ins_amt > 0 && (ins_amt < 1 || ins_amt > 99999)) {
						return Promise.reject("It must be an integer with range 1 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmInquiryMode = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Inquiry Mode already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmInquiryMedia = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Inquiry Media already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmInquiryRating = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Inquiry Rating already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmInsuranceCompany = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Insurance Company already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		payout: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("payout") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmInsuranceCategory = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Insurance Category already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmEmploymentType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Employment Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmZone = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Zone already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmDealType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Deal Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		deal_category_id: [
			{ required: true, message: "It cannot be blank." }
		],
	},
};

const vsmDealCategory = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Deal Category already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmCustomerType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Customer Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmInquiryClosureType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Inquiry Closure Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmInquiryFollowupAction = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Inquiry Followup Action already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmRole = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Role already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmUsageType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Usage Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmTestDriveLocation = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Test Drive Location already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmPurpose = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Purpose Location already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmPassingType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Passing Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmApprovedCompany = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Approved Company already exists",
	validation: {
		dc_id: [{ required: true, message: "It is not selected." }],
		dt_id: [{ required: true, message: "It is not selected." }],
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		remarks: [
			{
				max: 150,
				message: "Maximum length for Remark is 150 characters",
			},
		],
	},
};

const vsmLevel = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Level already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmPayType = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Pay Type already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmManageInfo = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Manage Info already exists",
	validation: {
		title: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 200,
				message: "Maximum length for name is 50 characters",
			},
		],
		note: [
			{ required: true, message: "It cannot be blank." },
		]
	},
};

const vsmPaymentModes = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Payment Mode already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		bank_flag: [{ required: true, message: "It is not selected." }],
		cheque_flag: [{ required: true, message: "It is not selected." }],
		types: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("types").length < 0) {
						return Promise.reject("It cannot be blank");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmHoliday = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		type: [{ required: true, message: "It is not selected." }],
		date: [{ required: true, message: "It is not selected." }],
		description: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					const type = getFieldValue("type");
					if (
						(type === 10 || type === 40) &&
						getFieldValue("description") === ""
					) {
						return Promise.reject("It cannot be blank");
					}
					return Promise.resolve();
				},
			}),
		],
		date_join: [{ required: true, message: "It cannot be blank." }],
		date_resigned: [{ required: true, message: "It cannot be blank." }],
		date_leaving: [{ required: true, message: "It cannot be blank." }],
	},
};
const vsmUsers = {
	success: "Successfully Created",
	validation: {
		role_id: [{ required: true, message: "It is not selected." }],
		department_id: [{ required: true, message: "It is not selected." }],
		designation_id: [{ required: true, message: "It is not selected." }],
		location_id: [{ required: true, message: "It is not selected." }],
		premises_id: [{ required: true, message: "It is not selected." }],
		ip_address: [{ required: true, message: "It is not selected." }],
		level_id: [{ required: true, message: "It is not selected." }],
		pay_type_id: [{ required: true, message: "It is not selected." }],
		reporting_to: [{ required: true, message: "It is not selected." }],
		username: [
			{ required: true, message: "It cannot be blank." },
			{ min: 8, message: "Minimum 8 characters should be entered." },
			{ max: 20, message: "Maximum 20 characters only." },
			{
				pattern: /^(?=.*[a-z])(?=.*[0-9])(?=.*[@_-])[a-z0-9@_-]{1,}$/,
				message:
					"It must have one lowercase character, one digit and one special character.",
			},
		],
		password: [
			{ required: true, message: "It cannot be blank." },
			{ min: 8, message: "Minimum 8 characters should be entered." },
			{ max: 20, message: "Maximum 20 characters only." },
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@_-])[a-zA-Z0-9@_-]{1,}$/,
				message:
					"Password must have one lowercase, one uppercase, one digit and one special character(_, -, @).",
			},
		],
		name: [
			{ required: true, message: "It cannot be blank." },
			{ min: 3, message: "Minimum 3 characters should be entered." },
			{ max: 50, message: "Maximum 50 characters only." },
		],
		address: [
			{ required: true, message: "It cannot be blank." },
			{ min: 10, message: "Minimum 10 characters should be entered." },
			{ max: 400, message: "Maximum 400 characters only." },
		],
		email: [
			{ required: true, message: "It cannot be blank." },
			{ max: 100, message: "Maximum 100 characters only." },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Invalid email address, please enter the valid email address",
			},
		],
		primary_number: [
			{ required: true, message: "It cannot be blank." },
			{
				pattern: /^[0-9]{10,20}$/,
				message: "Minimum 10 and Maximum 20 characters only.",
			},
		],
		alternate_number: [
			{
				pattern: /^[0-9]{10,20}$/,
				message: "Minimum 10 and Maximum 20 characters only.",
			},
		],
		salary: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("salary") < 1) {
						return Promise.reject("It must be a positive integer number");
					} else if (getFieldValue("salary") > 999999999) {
						return Promise.reject("It cannot exceed 999,999,999");
					}
					return Promise.resolve();
				},
			}),
		],
		date_join: [{ required: true, message: "It cannot be blank." }],
		birth_date: [{ required: true, message: "It cannot be blank." }],
		date_resigned: [{ required: true, message: "It cannot be blank." }],
		date_leaving: [{ required: true, message: "It cannot be blank." }],
	},
};

const vsmSMS = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "SMS already exists",
	validation: {
		purpose: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 10,
				message: "Purpose must have at least 10 characters",
			},
			{
				max: 400,
				message: "Maximum length for Purpose is 400 characters",
			},
		],
		body: [{ required: true, message: "It cannot be blank" }],
	},
};

const vsmEmail = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Email already exists",
	validation: {
		purpose: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 10,
				message: "Purpose must have at least 10 characters",
			},
			{
				max: 400,
				message: "Maximum length for Purpose is 400 characters",
			},
		],
		subject: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 10,
				message: "Subject must have at least 10 characters",
			},
			{
				max: 400,
				message: "Maximum length for Subject is 400 characters",
			},
		],
		body: [{ required: true, message: "It cannot be blank" }],
	},
};

const vsmLoanSource = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "Loan Source already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least 3 characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
};

const vsmImportTransaction = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		supplier_id: [{ required: true, message: "It is not selected" }],
		in_transit_sheet: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("in_transit_sheet") ||
						getFieldValue("in_transit_sheet").fileList.length === 0
					) {
						return Promise.reject("The sheet doesn’t exist.");
					}
					return Promise.resolve();
				},
			}),
		],
	}
}

const vsmInTransit = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		supplier_id: [{ required: true, message: "It is not selected" }],
		invoice_no: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 50,
				message: "Maximum length for Invoice Number is 50 characters",
			},
		],
		invoice_date: [{ required: true, message: "It is not selected" }],
		vrn: [
			{ required: true, message: "It cannot be blank" },
			{ max: 50, message: "Maximum length for VRN is 50 characters" },
		],
		location_id: [{ required: true, message: "It is not selected" }],
		premises_id: [{ required: true, message: "It is not selected" }],
		brand_id: [{ required: true, message: "It is not selected" }],
		model_id: [{ required: true, message: "It is not selected" }],
		variant_id: [{ required: true, message: "It is not selected" }],
		color_id: [{ required: true, message: "It is not selected" }],
		vin: [
			{ required: true, message: "It cannot be blank" },
			{ max: 50, message: "Maximum length for VIN is 50 characters" },
		],
		chassis_no: [
			{ required: true, message: "It cannot be blank" },
			{ max: 50, message: "Maximum length for Chassis Number is 50 characters" },
		],
		engine_no: [
			{ required: true, message: "It cannot be blank" },
			{ max: 50, message: "Maximum length for Engine Number is 50 characters" },
		],
		basic_amount: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const basic_amount = getFieldValue("basic_amount")
					if (basic_amount < 1) {
						return Promise.reject("It must be a non-zero positive integer number");
					} else if (basic_amount > 99999999) {
						return Promise.reject("It cannot exceed 9,99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		discount: [
			({ getFieldValue }) => ({
				validator(rule, value) {
					const basic_amount = getFieldValue("basic_amount")
					if (value) {
						if (parseInt(value) < parseInt(basic_amount)) {
							return Promise.resolve();
						}
						return Promise.reject("Discount must be less than the basic amount");
					}
					return Promise.resolve();
				},
			}),
		],
		tax_amount: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const tax_amount = getFieldValue("tax_amount")
					if (tax_amount < 1) {
						return Promise.reject("It must be a non-zero positive integer number");
					} else if (tax_amount > 99999999) {
						return Promise.reject("It cannot exceed 9,99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		invoice_funding_by: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 50,
				message: "Maximum length for Invoice Funding By is 50 characters",
			},
		],
		mfg_year: [{ required: true, message: "It is not selected" }],
		vin_year: [{ required: true, message: "It is not selected" }],
		vt_id: [{ required: true, message: "It is not selected" }],
		purchase_year: [
			{ required: true, message: "It is not selected" },
		],
		is_metalic: [
			{ required: true, message: "It is not selected" },
		]
	},
};

const vsmInWard = {
	stock_id_required: "You must select atleast one stock entry",
	validation: {
		location_id: [{ required: true, message: "It cannot be blank" }],
		premises_id: [{ required: true, message: "It cannot be blank" }],
	}
}

const vsmInquiryMediaSubCategory = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "It is already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Minimum 3 characters should be entered.",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
		media: [
			{ required: true, message: "It is not selected." },
		]
	},
};

const vsmSalesProfile = {
	success: "Successfully Deactivate",
	validation: {
		sales_consultant: [
			{ required: true, message: "It is not selected." },
		],
		model_id: [
			{ required: true, message: "It is not selected." },
		],
		deal_with: [
			{ required: true, message: "It is not selected." },
		],
		note: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for notes is 800 characters",
			},
		]
	},
}

const vsmScheme = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "It is already exists",
	validation: {
		from_date: [
			{ required: true, message: "It cannot be blank." },
		],
		to_date: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const from_dt = getFieldValue("from_date")
					const to_dt = getFieldValue("to_date")
					if (from_dt > to_dt) {
						return Promise.reject("To Date must be greater than From Date");
					}
					return Promise.resolve();
				},
			})
		],
		brand_id: [
			{ required: true, message: "It is not selected." },
		],
		model_id: [
			{ required: true, message: "It is not selected." },
		],
		variant_id: [
			{ required: true, message: "It is not selected." },
		],
		prev_year_discount: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const prev_year_discount = getFieldValue("prev_year_discount")
					if (prev_year_discount > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		cur_year_discount: [
			{ required: true, message: "It cannot be blank." },
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const cur_year_discount = getFieldValue("cur_year_discount")
					if (cur_year_discount > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		level0_discount: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("level1_discount") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		level1_discount: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("level1_discount") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		level2_discount: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("level2_discount") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		level3_discount: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("level3_discount") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		level4_discount: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("level4_discount") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		level5_discount: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("level5_discount") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
		insurance_tap: [
			{ pattern: /^([0-9]+)$/, message: "It allows only positive digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("insurance_tap") > 9999999) {
						return Promise.reject("It must be a number between 0 to 9999999");
					}
					return Promise.resolve();
				},
			}),
		],
	},
}

const vsmKitty = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		location_id: [{ required: true, message: "It is not selected" }],
		user_id: [{ required: true, message: "It is not selected" }],
		start_date: [{ required: true, message: "It is not selected" }],
		end_date: [
			{ required: true, message: "It is not selected" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const start_date = getFieldValue("start_date")
					const end_date = getFieldValue("end_date")
					if (end_date && start_date > end_date) {
						return Promise.reject("It must be a valid future date");
					}
					return Promise.resolve();
				},
			})
		],
		credits: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 1 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const credits = parseInt(getFieldValue("credits"));
					if (credits === 0) {
						return Promise.reject("It must be a valid integer, range is 1 to 99,99,999")
					}
					else if (credits > 1 && credits > 9999999) {
						return Promise.reject("It must be a valid integer, range is 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
	}
}

const vsmPackage = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "It is already exists",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		description: [
			{
				max: 800,
				message: "Maximum length is 800 characters",
			}
		],
		from_date: [
			{ required: true, message: "It cannot be blank." },
		],
		to_date: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const from_dt = getFieldValue("from_date")
					const to_dt = getFieldValue("to_date")
					if (from_dt > to_dt) {
						return Promise.reject("It must be later than From Date");
					}
					return Promise.resolve();
				},
			})
		],
	}
}

const vsmPackageEntry = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	error: "It is already exists",
	validation: {
		brand_id: [{ required: true, message: "It is not selected" }],
		model_id: [{ required: true, message: "It is not selected" }],
		variant_id: [{ required: true, message: "It is not selected" }],
		color_flag: [{ required: true, message: "It is not selected" }],
		colors: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					const color_flag = getFieldValue("color_flag")
					const colors = getFieldValue("colors")
					return color_flag === 1 && (!colors || colors.length === 0) ? Promise.reject("It is not selected") : Promise.resolve();
				}
			})
		],
		ex_showroom: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ex_showroom = parseInt(getFieldValue("ex_showroom"));
					if (ex_showroom > 0 && ex_showroom > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		csd_ex_showroom: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const csd_ex_showroom = parseInt(getFieldValue("csd_ex_showroom"));
					if (csd_ex_showroom > 0 && csd_ex_showroom > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		rto_amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const rto_amount = parseInt(getFieldValue("rto_amount"));
					if (rto_amount > 0 && rto_amount > 999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		handling_amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const handling_amount = parseInt(getFieldValue("handling_amount"));
					if (handling_amount > 0 && handling_amount > 999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		pms_amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pms_amount = parseInt(getFieldValue("pms_amount"));
					if (pms_amount > 0 && pms_amount > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		corporate_benefit_allowed: [{ required: true, message: "It is not selected" }],
		corporate_benefit_flag: [{ required: true, message: "It is not selected" }],
		corporate_benefit: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const corporate_benefit = parseInt(getFieldValue("corporate_benefit"));
					if (corporate_benefit > 0 && corporate_benefit > 999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		fin_flag: [{ required: true, message: "It is not selected" }],
		ins_flag: [{ required: true, message: "It is not selected" }],
		ins_fix_handling_amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ins_fix_handling_amount = parseInt(getFieldValue("ins_fix_handling_amount"));
					if (ins_fix_handling_amount > 0 && ins_fix_handling_amount > 999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		ew_fix_amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ew_fix_amount = parseInt(getFieldValue("ew_fix_amount"));
					if (ew_fix_amount > 0 && ew_fix_amount > 999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		accessory_flag: [{ required: true, message: "It is not selected" }],
		accessory_amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const accessory_ids = getFieldValue("accessory_ids")
					const accessory_amount = parseInt(getFieldValue("accessory_amount"));
					if (accessory_ids && accessory_ids.length > 0 && !accessory_amount) {
						return Promise.reject("It cannot be blank")
					}
					else if (accessory_amount > 0 && accessory_amount > 999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		accessory_disc: [
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be between 0 to 100. Two decimals are allowed" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("accessory_disc") > 100) {
						return Promise.reject("It must be between 0 to 100. Two decimals are allowed");
					}
					return Promise.resolve();
				},
			}),
		],
		scheme_disc_flag: [{ required: true, message: "It is not selected" }],
		scheme_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const scheme_disc = parseInt(getFieldValue("scheme_disc"));
					if (scheme_disc > 0 && scheme_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		prev_year_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const prev_year_disc = parseInt(getFieldValue("prev_year_disc"));
					if (prev_year_disc > 0 && prev_year_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		level1_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const level1_disc = parseInt(getFieldValue("level1_disc"));
					if (level1_disc > 0 && level1_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		level2_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const level2_disc = parseInt(getFieldValue("level2_disc"));
					if (level2_disc > 0 && level2_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		level3_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const level3_disc = parseInt(getFieldValue("level3_disc"));
					if (level3_disc > 0 && level3_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		level4_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const level4_disc = parseInt(getFieldValue("level4_disc"));
					if (level4_disc > 0 && level4_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		level5_disc: [
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const level5_disc = parseInt(getFieldValue("level5_disc"));
					if (level5_disc > 0 && level5_disc > 9999999) {
						return Promise.reject("It must be a valid integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
	}
}

const vsmImportInquiry = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		supplier_id: [{ required: true, message: "It is not selected" }],
		in_transit_sheet: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (
						!getFieldValue("in_transit_sheet") ||
						getFieldValue("in_transit_sheet").fileList.length === 0
					) {
						return Promise.reject("The sheet doesn’t exist.");
					}
					return Promise.resolve();
				},
			}),
		],
	}
}

const vsmRecordInquiry = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		date: [{ required: true, message: "It is not selected" }],
		time_in: [{ required: true, message: "It is not selected" }],
		td_flag: [{ required: true, message: "It is not selected" }],
		mode_id: [{ required: true, message: "It is not selected" }],
		sc_note: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 400,
				message: "Maximum length is 400 characters",
			},
		],
		location_id: [{ required: true, message: "It is not selected" }],
		area_id: [{ required: true, message: "It is not selected" }],
		ratings_id: [{ required: true, message: "It is not selected" }],
		title_id: [{ required: true, message: "It is not selected" }],
		full_name: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		gender_id: [{ required: true, message: "It is not selected" }],
		contact1: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		contact2: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		phone1: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 10,
				message: "Minimum length is 10 characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		phone2: [
			{
				min: 10,
				message: "Minimum length is 10 characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		email: [
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		address1: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		address2: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		zipcode: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a 6 digit code" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const level4_disc = parseInt(getFieldValue("zipcode"));
					if (level4_disc > 0 && level4_disc > 999999) {
						return Promise.reject("It must be a 6 digit code");
					}
					return Promise.resolve();
				},
			})
		],
		state_id: [{ required: true, message: "It is not selected" }],
		city_id: [{ required: true, message: "It is not selected" }],
		et_id: [{ required: true, message: "It is not selected" }],
		company_name: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		designation: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		cust_type_id: [{ required: true, message: "It is not selected" }],
		purpose_id: [{ required: true, message: "It is not selected" }],
		exchange_flag: [{ required: true, message: "It is not selected" }],
		cc_brand_id: [{ required: true, message: "It is not selected" }],
		cc_model_id: [{ required: true, message: "It is not selected" }],
		cc_model_year: [{ required: true, message: "It cannot be blank" }],
		cc_km_run: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a positive integer number." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const cc_km_run = parseInt(getFieldValue("cc_km_run"));
					if (cc_km_run === 0) {
						return Promise.reject("It must be a non-zero positive integer number.")
					}
					else if (cc_km_run > 0 && cc_km_run < 1) {
						return Promise.reject("It must be a positive value");
					}
					return Promise.resolve();
				},
			}),
		],
		cc_fuel_id: [{ required: true, message: "It is not selected" }],
		cc_tt_id: [{ required: true, message: "It is not selected" }],
		resale_id: [{ required: true, message: "It is not selected" }],
		brand_id: [{ required: true, message: "It is not selected" }],
		model_id: [{ required: true, message: "It is not selected" }],
		color_id: [{ required: true, message: "It is not selected" }],
		budget: [
			{ pattern: /^([0-9]+)$/, message: "It must be a number between 0 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const budget = parseInt(getFieldValue("budget"))
					if (budget > 0 && budget > 9999999) {
						return Promise.reject("It must be a number between 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		finance_flag: [{ required: true, message: "It is not selected" }],
		purchase_days: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a number between 1 to 365" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const purchase_days = parseInt(getFieldValue("purchase_days"))
					if (purchase_days === 0) {
						return Promise.reject("It must be a number between 1 to 365")
					}
					else if (purchase_days > 0 && (purchase_days < 1 || purchase_days > 365)) {
						return Promise.reject("It must be a number between 1 to 365");
					}
					return Promise.resolve();
				},
			}),
		],
		other_brand_id: [{ required: true, message: "It is not selected" }],
		other_model_id: [{ required: true, message: "It is not selected" }],
		closure_type_flag: [{ required: true, message: "It is not selected" }],
		closure_type_id: [{ required: true, message: "It is not selected" }],
		closure_date: [{ required: true, message: "It is not selected" }],
		closure_remarks: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 800,
				message: "Maximum length is 800 characters",
			},
		],
		co_no: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 30,
				message: "Maximum length is 30 characters",
			},
		],
		referral_id: [
			{
				max: 30,
				message: "Maximum length is 30 characters",
			},
		],
		ref_customer_name: [
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		pan: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 30,
				message: "Maximum length is 30 characters",
			},
		],
		ex_showroom: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 1 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ex_showroom = parseInt(getFieldValue("ex_showroom"))
					if (ex_showroom === 0) {
						return Promise.reject("It must be a value in range 1 to 99,99,999")
					}
					else if (ex_showroom > 0 && ex_showroom > 9999999) {
						return Promise.reject("It must be a value in range 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		tcs: [{ required: true, message: "It cannot be blank" }],
		rto: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const rto = parseInt(getFieldValue("rto"))
					if (rto > 999999) {
						return Promise.reject("It must be a value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		insurance: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const insurance = parseInt(getFieldValue("insurance"))
					if (insurance > 999999) {
						return Promise.reject("It must be a value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		hc_amt: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const hc_amt = parseInt(getFieldValue("hc_amt"))
					if (hc_amt > 99999) {
						return Promise.reject("It must be a value in range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		pms: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pms = parseInt(getFieldValue("pms"))
					if (pms > 99999) {
						return Promise.reject("It must be a value in range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		muni_tax: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const muni_tax = parseInt(getFieldValue("muni_tax"))
					if (muni_tax > 999999) {
						return Promise.reject("It must be a value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		acc_amt: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const acc_amt = parseInt(getFieldValue("acc_amt"))
					if (acc_amt > 999999) {
						return Promise.reject("It must be a value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		fastag: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const fastag = parseInt(getFieldValue("fastag"))
					if (fastag > 9999) {
						return Promise.reject("It must be a value in range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
		discount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const discount = parseInt(getFieldValue("discount"))
					if (discount > 999999) {
						return Promise.reject("It must be a value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		commitment: [
			{
				max: 800,
				message: "Maximum length is 800 characters",
			},
		],
		amount: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 1 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const amount = parseInt(getFieldValue("amount"))
					if (amount === 0) {
						return Promise.reject("It must be a value in range 1 to 99,99,999")
					}
					else if (amount > 0 && amount > 9999999) {
						return Promise.reject("It must be a value in range 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		payment_remark: [
			{
				max: 800,
				message: "Maximum length is 800 characters",
			},
		],
		exe_sign: [{ required: true, message: "It can not be blank" }],
		cust_sign: [{ required: true, message: "It can not be blank" }],
		// pan_image: [{ required: true, message: "Please select PAN card image to upload. Valid formate are JPEG & JPG." }],
	}
}

const vsmConfirmBooking = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		receipt_date: [{ required: true, message: "It is not selected" }],
		payment_mode: [{ required: true, message: "It is not selected" }],
		amount: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer, range is 1 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const amount = parseInt(getFieldValue("amount"))
					if (amount === 0) {
						return Promise.reject("It must be an integer, range is 1 to 99,99,999")
					}
					else if (amount > 0 && amount > 9999999) {
						return Promise.reject("It must be an integer, range is 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		bank_id: [{ required: true, message: "It is not selected" }],
		chequet_no: [{ required: true, message: "It cannot be blank" }],
		deposited_bank: [{ required: true, message: "It is not selected" }],
		reco_date: [
			{ required: true, message: "It is not selected" },
		],
		depo_date: [
			{ required: true, message: "It is not selected" },
		],
		reco_date_noVal: [{ required: false }],
		depo_date_noVal: [{ required: false, message: "" }],
		status: [{ required: true, message: "It is not selected" }],
		reason: [{ required: true, message: "It is not selected" }],
		remarks: [{ max: 800, message: "Maximum length is 800 characters" }],
		ref_image: [{ required: true, message: "Please select Ref image to upload" }],
	}
}

const vsmCustomerInfo = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		title_id: [{ required: true, message: "It is not selected" }],
		name: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		gender_id: [{ required: true, message: "It is not selected" }],
		phone1: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 10,
				message: "Minimum length is 10 characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		phone2: [
			{
				min: 10,
				message: "Minimum length is 10 characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		email: [
			{ required: true, message: "It cannot be blank" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		addressline1: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		addressline2: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		state_id: [{ required: true, message: "It is not selected" }],
		city_id: [{ required: true, message: "It is not selected" }],
		area_id: [{ required: true, message: "It is not selected" }],
		zipcode: [{ required: true, message: "It cannot be blank" }],
		employment_type_id: [{ required: true, message: "It is not selected" }],
		company_name: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		designation: [
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		customer_type_id: [{ required: true, message: "It is not selected" }],
		gst_no: [
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
		],
		pan_image: [{ required: true, message: "It cannot be blank" }],
	}
}

const vsmZFormModelInfo = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		brand_id: [{ required: true, message: "It is not selected" }],
		model_id: [{ required: true, message: "It is not selected" }],
		color_id: [{ required: true, message: "It is not selected" }],
		delivery_date: [{ required: true, message: "It is not selected" }],
	}
}

const vsmLedgerInput = {
	// success: "Successfully Created",
	// edit: "Successfully Updated",
	validation: {
		scheme_disc: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const scheme_disc = parseInt(getFieldValue("scheme_disc"))
					if (scheme_disc > 9999999) {
						return Promise.reject("It cannot exceed 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
	}
}

const vsmCorporateBenefit = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		is_corporate: [{ required: true, message: "It is not selected" }],
		allow_disc_flag: [{ required: true, message: "It is not selected" }],
		dc_id: [
			// { required: true, message: "It is not selected" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const corporate_flag = getFieldValue("is_corporate")
					const dc_id = getFieldValue("dc_id")
					return corporate_flag === 1 && (dc_id === null || dc_id === undefined) ? Promise.reject("It is not selected") : Promise.resolve();
				}
			})
		],
		ac_id: [
			// { required: true, message: "It is not selected" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const corporate_flag = getFieldValue("is_corporate")
					const ac_id = getFieldValue("ac_id")
					return corporate_flag === 1 && (ac_id === null || ac_id === undefined) ? Promise.reject("It is not selected") : Promise.resolve();
				}
			})
		],
		dt_id: [
			// { required: true, message: "It is not selected" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const corporate_flag = getFieldValue("is_corporate")
					const dt_id = getFieldValue("dt_id")
					return corporate_flag === 1 && (dt_id === null || dt_id === undefined) ? Promise.reject("It is not selected") : Promise.resolve();
				}
			})
		],
		remarks: [
			{ required: true, message: "It can not be blank" },
			{
				max: 800,
				message: "Maximum length is 800 characters",
			},
		],
		corporate_proof: [
			// { required: true, message: "It is not selected" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const corporate_flag = getFieldValue("is_corporate")
					const corporate_proof = getFieldValue("corporate_proof")
					return corporate_flag === 1 && (corporate_proof === null || corporate_proof === undefined) ? Promise.reject("It is not selected") : Promise.resolve();
				}
			})
		],
		corporate_benefit: [
			// ({ getFieldValue }) => ({
			// 	validator(value, rule) {
			// 		const corporate_flag = getFieldValue("is_corporate")
			// 		const corporate_benefit = getFieldValue("corporate_benefit")
			// 		return corporate_flag === 0 && (corporate_benefit === null) ? Promise.reject("It is not selected") : Promise.resolve();
			// 	}
			// }),
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const corporate_benefit = parseInt(getFieldValue("corporate_benefit"))
					if (corporate_benefit < 1) {
						return Promise.reject("Range is 1 to 99,99,999");
					} else if (corporate_benefit > 9999999) {
						return Promise.reject("Range is 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		approved_amount: [
			// { required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const approved_amount = parseInt(getFieldValue("approved_amount"))
					if (approved_amount < 0) {
						return Promise.reject("Range is 0 to 99,99,999");
					} else if (approved_amount > 9999999) {
						return Promise.reject("Range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		// remarks: [
		// 	{
		// 		max: 800,
		// 		message: "Maximum length is 800 characters",
		// 	},
		// ],
		dealer_share: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const dealer_share = parseInt(getFieldValue("dealer_share"))
					if (dealer_share < 0) {
						return Promise.reject("Range is 0 to 99,99,999");
					} else if (dealer_share > 9999999) {
						return Promise.reject("Range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		mfg_share: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const mfg_share = parseInt(getFieldValue("mfg_share"))
					if (mfg_share < 0) {
						return Promise.reject("Range is 0 to 99,99,999");
					} else if (mfg_share > 9999999) {
						return Promise.reject("Range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		]
	}
}

const vsmRTOOffer = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		vehicle_reg_no: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 20,
				message: "Maximum length is 20 characters",
			},
		],
		vehicle_temp_no: [{
			max: 20,
			message: "Maximum length is 20 characters",
		},],
		vehicle_reg_date: [{ required: true, message: "It is not selected" }],
		rto_status: [{ required: true, message: "It is not selected" }]
	}
}

const vsmAccessoryOffer = {
	validation: {
		disc_per: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^(([0-9]+\.[0-9]{1,2})|[0-9]+)$/, message: "It must be a number between 0 to 100" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("GST") > 100) {
						return Promise.reject("It must be a number between 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		]
	}
}

const vsmFinanceLedger = {
	validation: {
		ls_id: [{ required: true, message: "It cannot be blank" }],
		need_finance: [{ required: true, message: "It cannot be blank" }],
		remarks_sc: [{
			max: 800,
			message: "Maximum length is 800 characters",
		},]
	}
}

const vsmQuotation = {
	validation: {
		bank_id: [{ required: true, message: "It is not selected" }],
		loan_amount: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("loan_amount") > getFieldValue("ex_showroom")) {
						return Promise.reject("It must be an integer range is  1 to Ex-Showroom price");
					}
					return Promise.resolve();
				},
			}),
		],
		tenure: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("tenure") < 1 || getFieldValue("tenure") > 84) {
						return Promise.reject("It must be an integer, range is 1 to 84");
					}
					return Promise.resolve();
				},
			}),
		],
		emi: [
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const min = (getFieldValue("loan_amount") * 1.7) / 100
					if (getFieldValue("emi") < min) {
						return Promise.reject("Minimum EMI must be 1.7% of the Loan Amount");
					}
					return Promise.resolve();
				},
			}),
		],
		rev_load: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("rev_load") > 99999) {
						return Promise.reject("It must be an integer, range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		dsa_comm: [
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("dsa_comm") > 99999) {
						return Promise.reject("It must be an integer, range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		remarks_fin_exe: [
			{
				max: 800,
				message: "Maximum length for notes is 800 characters",
			},
		]
	}
}

const vsmQuotationApproval = {
	validation: {
		policy_no: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		due_date: [{ required: true, message: "It is not selected" }],
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmQuotationLostCase = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
		lcr_id: [{ required: true, message: "It is not selected" }],
	},
}

const vsmQuotationRevert = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmQuotationArchive = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmQuotationRestore = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmQuotationDiscountApproval = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
		passback_approved: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const passback_approved = parseInt(getFieldValue("passback_approved"))
					if (passback_approved < 0) {
						return Promise.reject("Range is 0 to 99,999");
					} else if (passback_approved > 99999) {
						return Promise.reject("Range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		]
	},
}

const vsmResetZForm = {
	validation: {
		zform_id: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
		],
	}
}

const vsmChangeName = {
	validation: {
		changed_name: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		promised_delivery_date: [
			{ required: true, message: "It cannot be blank" },
		],
	}
}

const vsmInsuranceFollowup = {
	validation: {
		closure_type_id: [
			{ required: true, message: "It is not selected" },
		],
		fl_mode_id: [
			{ required: true, message: "It is not selected" },
		],

		fl_date: [
			{ required: true, message: "It is not selected" },
		],
		fl_time: [
			{ required: true, message: "It is not selected" },
		],
		nf_mode_id: [
			{ required: true, message: "It is not selected" },
		],

		nf_date: [
			{ required: true, message: "It is not selected" },
		],
		nf_time: [
			{ required: true, message: "It is not selected" },
		],
		notes: [
			{
				max: 800,
				message: "Max length is 800 characters",
			},
		]
	}
}

const vsmInsuranceOffer = {
	validation: {
		full_name: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 3,
				message: "Minimum length is 3 characters",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		gender_id: [{ required: true, message: "It is not selected" }],
		phone: [
			{ required: true, message: "It cannot be blank" },
			{
				min: 10,
				message: "Minimum length is 10 characters",
			},
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		email: [
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		brand_id: [
			{ required: true, message: "It is not selected" },
		],
		model_id: [
			{ required: true, message: "It is not selected" },
		],
		variant: [
			{ required: true, message: "It can not be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		color: [
			{ required: true, message: "It can not be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		cc_id: [
			{ required: true, message: "It is not selected" },
		],
		purchase_date: [
			{ required: true, message: "It is not selected" },
		],
		mfg_year: [
			{ required: true, message: "It is not selected" },
		],
		pass_cat_id: [{ required: true, message: "It is not selected" }],
		pass_sub_cat_id: [{ required: true, message: "It is not selected" }],
		zone_id: [{ required: true, message: "It is not selected" }],
		rto_place_id: [{ required: true, message: "It is not selected" }],
		tp_period_requested: [{ required: true, message: "It is not selected" }],
		cat_id: [{ required: true, message: "It is not selected" }],
		tc_id: [{ required: true, message: "It is not selected" }],
		fe_id: [{ required: true, message: "It is not selected" }],
		budget: [
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("budget") > 9999999) {
						return Promise.reject("It must be an integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		remarks: [
			{
				max: 800,
				message: "Maximum length of remarks is 800 characters",
			},
		]
	}
}

const vsmInsurancePayment = {
	validation: {
		receipt_date: [{ required: true, message: "It is not selected" }],
		payment_mode: [{ required: true, message: "It is not selected" }],
		amount: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer, range is 1 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const amount = parseInt(getFieldValue("amount"))
					if (amount === 0) {
						return Promise.reject("It must be an integer, range is 1 to 99,99,999")
					}
					else if (amount > 0 && amount > 9999999) {
						return Promise.reject("It must be an integer, range is 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		bank_id: [{ required: true, message: "It is not selected" }],
		cheque_no: [{ required: true, message: "It cannot be blank" }],
		deposited_bank: [{ required: true, message: "It is not selected" }],
		reco_date: [
			{ required: true, message: "It is not selected" },
		],
		reco_date_noVal: [{ required: false }],
		status: [{ required: true, message: "It is not selected" }],
		reason: [{ required: true, message: "It is not selected" }],
		remarks: [{ max: 800, message: "Maximum length is 800 characters" }],
		ref_image: [{ required: true, message: "Please select Ref image to upload" }],
	}
}

const vsmAllocateInsurance = {
	validation: {
		from_date: [
			{ required: true, message: "It cannot be blank." },
		],
		to_date: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const from_dt = getFieldValue("from_date")
					const to_dt = getFieldValue("to_date")
					if (from_dt > to_dt) {
						return Promise.reject("To Date must be greater than From Date");
					}
					return Promise.resolve();
				},
			})
		],
		location_id: [
			{ required: true, message: "It is not selected." },
		],
		user_id: [
			{ required: true, message: "It is not selected." },
		],
	}
}

const vsmInsuranceRates = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		cc_id: [{ required: true, message: "It is not selected" }],
		zone_id: [{ required: true, message: "It is not selected" }],
		category: [{ required: true, message: "It is not selected" }],
		sub_category: [{ required: true, message: "It is not selected" }],
		start_date: [{ required: true, message: "It is not selected" }],
		end_date: [{ required: true, message: "It is not selected" }],
		min_age: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(rule, value) {
					let fields = getFieldValue("details")
					let error_msg = '' // For calculating error only if it occurs 2 times
					let current_field = rule.field.split("."); // For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["min_age"] > 999 || fields[index]["min_age"] < 0) {
							return Promise.reject("Valid range is 0 to 999");
						}
					}
					fields && fields.forEach((x, i) => {
						if (x !== null && fields[index] !== null) {
							if (x.zone_id !== undefined && fields[index]["zone_id"] !== undefined && x.cc_id && fields[index]["cc_id"] !== undefined) {
								if (index !== i && x.zone_id === fields[index]["zone_id"] && x.cc_id === fields[index]["cc_id"]) {
									// Checking if zone and cc are same
									if (fields[index]["min_age"] !== undefined && x.min_age !== undefined && fields[index]["min_age"] !== undefined && x.max_age !== undefined) {
										if (parseInt(fields[index]["min_age"]) >= parseInt(x.min_age) && parseInt(fields[index]["min_age"]) <= parseInt(x.max_age)) {
											// Checking if min age is in between min age and max age in array
											error_msg = "Age range should not overlap with existing entry"
										}
									}
								}
							}
						}
					})

					if (error_msg) {
						return Promise.reject(error_msg);
					}
					else {
						return Promise.resolve();
					}
				},
			}),
		],
		max_age: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(rule, value) {

					let fields = getFieldValue("details")
					let error_msg = '' // For calculating error only if it occurs 2 times
					let current_field = rule.field.split(".");// For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["max_age"] > 999 || fields[index]["max_age"] < 0) {
							return Promise.reject("Valid range is 0 to 999");
						}
					}
					fields && fields.forEach((x, i) => {
						if (x !== null && fields[index] !== null) {
							if (x.zone_id !== undefined && fields[index]["zone_id"] !== undefined && x.cc_id !== undefined && fields[index]["cc_id"] !== undefined) {
								if (index !== i && x.zone_id === fields[index]["zone_id"] && x.cc_id === fields[index]["cc_id"]) {
									// Checking if zone and cc are same
									if (fields[index]["max_age"] !== undefined && x.min_age !== undefined && x.max_age !== undefined) {
										if (parseInt(fields[index]["max_age"]) >= parseInt(x.min_age) && parseInt(fields[index]["max_age"]) <= parseInt(x.max_age)) {
											// Checking if min age is in between min age and max age in array
											error_msg = "Age range should not overlap with existing entry"
										}
									}
								}
								else {
									// Checking if max age is higher or equal to for current object
									if (fields[index]["max_age"] !== undefined && fields[index]["min_age"] !== undefined) {
										if (parseInt(fields[index]["max_age"]) < parseInt(fields[index]["min_age"])) {
											error_msg = "It must be either same or higher than minimum Age"
										}
									}
								}
							}
						}
					})

					if (error_msg) {
						return Promise.reject(error_msg);
					}
					else {
						return Promise.resolve();
					}
				},
			}),
		],
		rate: [{ required: true, message: "Please enter Rate" },
		{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
		({ getFieldValue }) => ({
			validator(rule, value) {
				let fields = getFieldValue("details");
				let current_field = rule.field.split(".");// For Getting Current Field Object
				let index = parseInt(current_field[1]); // Index of current object
				if (fields[index] !== null) {
					if (fields[index]["rate"] > 100) {
						return Promise.reject("Value range is 0 to 100");
					}
				}
				return Promise.resolve();
			},
		}),
		],

	}
}

const vsmInsuranceProducts = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		name: [{ required: true, message: "It cannot be blank" }],
		brand_id: [{ required: true, message: "It is not selected." }],
		model_id: [{ required: true, message: "It is not selected." }],
		passing_type_id: [{ required: true, message: "It is not selected." }],
		segment_name: [{ required: true, message: "It cannot be blank." }],
		company_id: [{ required: true, message: "It is not selected." }],
		zone_id: [{ required: true, message: "It is not selected." }],
		cat_id: [{ required: true, message: "It is not selected." }],
		fixed_amt: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const fix_amount = parseInt(getFieldValue("fixed_amt"))
					if (fix_amount < 0) {
						return Promise.reject("Range is 0 to 99,999");
					} else if (fix_amount > 99999) {
						return Promise.reject("Range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		anti_theft_per: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const anti_theft = parseInt(getFieldValue("anti_theft_per"))
					if (anti_theft < 0) {
						return Promise.reject("Range is 0 to 99");
					} else if (anti_theft > 99) {
						return Promise.reject("Range is 0 to 99");
					}
					return Promise.resolve();
				},
			}),
		],
		cpa: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const cpa = parseInt(getFieldValue("cpa"))
					if (cpa < 0) {
						return Promise.reject("Range is 0 to 99,999");
					} else if (cpa > 99999) {
						return Promise.reject("Range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		pad: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pad = parseInt(getFieldValue("pad"))
					if (pad < 0) {
						return Promise.reject("Range is 0 to 99,999");
					} else if (pad > 99999) {
						return Promise.reject("Range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		pap: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pap = parseInt(getFieldValue("pap"))
					if (pap < 0) {
						return Promise.reject("Range is 0 to 99,999");
					} else if (pap > 99999) {
						return Promise.reject("Range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
	}
}

const vsmInsuranceCopyProducts = {
	success: "Successfully Copied",
	validation: {
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 3,
				message: "Name must have at least three characters",
			},
			{
				max: 50,
				message: "Maximum length for name is 50 characters",
			},
		],
	},
}

const vsmInsuranceSelectAddOns = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		cc_id: [{ required: true, message: "It is not selected" }],
		zone_id: [{ required: true, message: "It is not selected" }],
		category: [{ required: true, message: "It is not selected" }],
		sub_category: [{ required: true, message: "It is not selected" }],
		start_date: [{ required: true, message: "It is not selected" }],
		end_date: [{ required: true, message: "It is not selected" }],
	}
}

const vsmInsuranceTPRates = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		cc_id: [{ required: true, message: "It is not selected" }],
		zone_id: [{ required: true, message: "It is not selected" }],
		category: [{ required: true, message: "It is not selected" }],
		sub_category: [{ required: true, message: "It is not selected" }],
		start_date: [{ required: true, message: "It is not selected" }],
		end_date: [{ required: true, message: "It is not selected" }],
		years: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be integer." },
			({ getFieldValue }) => ({
				validator(rule, value) {
					let fields = getFieldValue("details")
					let current_field = rule.field.split("."); // For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["years"] > 10 || fields[index]["years"] < 0) {
							return Promise.reject("Valid range is 1 to 10");
						}
					}
					return Promise.resolve();
				},
			}),
		],
		min_weight: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(rule, value) {
					let fields = getFieldValue("details")
					let error_msg = '' // For calculating error only if it occurs 2 times
					let current_field = rule.field.split("."); // For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["min_weight"] > 99999 || fields[index]["min_weight"] < 0) {
							return Promise.reject("Valid range is 0 to 99999");
						}
					}
					fields && fields.forEach((x, i) => {
						if (x !== null && fields[index] !== null) {
							if (x.zone_id !== undefined && fields[index]["zone_id"] !== undefined && x.cc_id && fields[index]["cc_id"] !== undefined && x.years && fields[index]["years"] !== undefined) {
								if (index !== i && x.zone_id === fields[index]["zone_id"] && x.cc_id === fields[index]["cc_id"] && parseInt(x.years) === parseInt(fields[index]["years"])) {
									// Checking if zone and cc are same
									if (fields[index]["min_weight"] !== undefined && x.min_weight !== undefined && fields[index]["min_weight"] !== undefined && x.max_weight !== undefined) {
										if (parseInt(fields[index]["min_weight"]) >= parseInt(x.min_weight) && parseInt(fields[index]["min_weight"]) <= parseInt(x.max_weight)) {
											// Checking if min age is in between min age and max age in array
											error_msg = "Weight range should not overlap with existing entry"
										}
									}
								}
							}
						}
					})

					if (error_msg) {
						return Promise.reject(error_msg);
					}
					else {
						return Promise.resolve();
					}
				},
			}),
		],
		max_weight: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(rule, value) {

					let fields = getFieldValue("details")
					let error_msg = '' // For calculating error only if it occurs 2 times
					let current_field = rule.field.split(".");// For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["max_weight"] > 99999 || fields[index]["max_weight"] < 0) {
							return Promise.reject("Valid range is 0 to 99999");
						}
					}
					fields && fields.forEach((x, i) => {
						if (x !== null && fields[index] !== null) {
							if (x.zone_id !== undefined && fields[index]["zone_id"] !== undefined && x.cc_id !== undefined && fields[index]["cc_id"] !== undefined && x.years !== undefined && fields[index]["years"] !== undefined) {
								if (index !== i && x.zone_id === fields[index]["zone_id"] && x.cc_id === fields[index]["cc_id"] && parseInt(x.years) === parseInt(fields[index]["years"])) {
									// Checking if zone and cc are same
									if (fields[index]["max_weight"] !== undefined && x.min_weight !== undefined && x.max_weight !== undefined) {
										if (parseInt(fields[index]["max_weight"]) >= parseInt(x.min_weight) && parseInt(fields[index]["max_weight"]) <= parseInt(x.max_age)) {
											// Checking if min age is in between min age and max age in array
											error_msg = "Weight range should not overlap with existing entry"
										}
									}
								}
								else {
									// Checking if max age is higher or equal to for current object
									if (fields[index]["max_weight"] !== undefined && fields[index]["min_weight"] !== undefined) {
										if (parseInt(fields[index]["max_weight"]) < parseInt(fields[index]["min_weight"])) {
											error_msg = "It must be either same or higher than minimum Age"
										}
									}
								}
							}
						}
					})

					if (error_msg) {
						return Promise.reject(error_msg);
					}
					else {
						return Promise.resolve();
					}
				},
			}),
		],
		min_passengers: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(rule, value) {
					let fields = getFieldValue("details")
					let error_msg = '' // For calculating error only if it occurs 2 times
					let current_field = rule.field.split("."); // For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["min_passengers"] > 99999 || fields[index]["min_passengers"] < 0) {
							return Promise.reject("Valid range is 0 to 99999");
						}
					}
					fields && fields.forEach((x, i) => {
						if (x !== null && fields[index] !== null) {
							if (x.zone_id !== undefined && fields[index]["zone_id"] !== undefined && x.cc_id && fields[index]["cc_id"] !== undefined && x.years && fields[index]["years"] !== undefined) {
								if (index !== i && x.zone_id === fields[index]["zone_id"] && x.cc_id === fields[index]["cc_id"] && parseInt(x.years) === parseInt(fields[index]["years"])) {
									// Checking if zone and cc are same
									if (fields[index]["min_passengers"] !== undefined && x.min_passengers !== undefined && fields[index]["min_passengers"] !== undefined && x.max_passengers !== undefined) {
										if (parseInt(fields[index]["min_passengers"]) >= parseInt(x.min_passengers) && parseInt(fields[index]["min_passengers"]) <= parseInt(x.max_passengers)) {
											// Checking if min age is in between min age and max age in array
											error_msg = "Weight range should not overlap with existing entry"
										}
									}
								}
							}
						}
					})

					if (error_msg) {
						return Promise.reject(error_msg);
					}
					else {
						return Promise.resolve();
					}
				},
			}),
		],
		max_passengers: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(rule, value) {

					let fields = getFieldValue("details")
					let error_msg = '' // For calculating error only if it occurs 2 times
					let current_field = rule.field.split(".");// For Getting Current Field Object
					let index = parseInt(current_field[1]); // Index of current object
					if (fields[index] !== null) {
						if (fields[index]["max_passengers"] > 99999 || fields[index]["max_passengers"] < 0) {
							return Promise.reject("Valid range is 0 to 99999");
						}
					}
					fields && fields.forEach((x, i) => {
						if (x !== null && fields[index] !== null) {
							if (x.zone_id !== undefined && fields[index]["zone_id"] !== undefined && x.cc_id !== undefined && fields[index]["cc_id"] !== undefined && x.years !== undefined && fields[index]["years"] !== undefined) {
								if (index !== i && x.zone_id === fields[index]["zone_id"] && x.cc_id === fields[index]["cc_id"] && parseInt(x.years) === parseInt(fields[index]["years"])) {
									// Checking if zone and cc are same
									if (fields[index]["max_passengers"] !== undefined && x.min_passengers !== undefined && x.max_passengers !== undefined) {
										if (parseInt(fields[index]["max_passengers"]) >= parseInt(x.min_passengers) && parseInt(fields[index]["max_passengers"]) <= parseInt(x.max_passengers)) {
											// Checking if min age is in between min age and max age in array
											error_msg = "Weight range should not overlap with existing entry"
										}
									}
								}
								else {
									// Checking if max age is higher or equal to for current object
									if (fields[index]["max_passengers"] !== undefined && fields[index]["min_passengers"] !== undefined) {
										if (parseInt(fields[index]["max_passengers"]) < parseInt(fields[index]["min_passengers"])) {
											error_msg = "It must be either same or higher than minimum Age"
										}
									}
								}
							}
						}
					})

					if (error_msg) {
						return Promise.reject(error_msg);
					}
					else {
						return Promise.resolve();
					}
				},
			}),
		],
		rate: [{ required: true, message: "Please enter Rate" },
		{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
		({ getFieldValue }) => ({
			validator(rule, value) {
				let fields = getFieldValue("details");
				let current_field = rule.field.split(".");// For Getting Current Field Object
				let index = parseInt(current_field[1]); // Index of current object
				if (fields[index] !== null) {
					if (fields[index]["rate"] > 100) {
						return Promise.reject("Value range is 0 to 100");
					}
				}
				return Promise.resolve();
			},
		}),
		],

	}
}

const vsmBankAccount = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		bank_id: [{ required: true, message: "It is not selected" }],
		location_id: [{ required: true, message: "It is not selected" }],
		acc_no: [
			{ required: true, message: "It is not selected" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			{
				max: 4,
				message: "It must be last four digits of bank account number",
			},
		],
	}
}

const vsmSchemeDiscountReq = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		remarks: [
			{ required: true, message: "It can not be blank" },
			{
				max: 800,
				message: "Max length is 800 characters",
			},
		],
	}
}

const vsmSentInvoice = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		inv_no: [
			{ required: true, message: "It can not be blank" },
			{
				max: 20,
				message: "Max length is 20 characters",
			},
		],
		inv_date: [
			{ required: true, message: "It is not selected" },
		],
	}
}

const vsmRevertOfferNote = {
	validation: {
		note: [
			{ required: true, message: "It can not be blank" },
			{
				max: 800,
				message: "Max length is 800 characters",
			},
		]
	}
}

const vsmApplyInsurance = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		pass_cat_id: [
			{ required: true, message: "It is not selected" },
		],
		rto_place_id: [
			{ required: true, message: "It is not selected" },
		],
		tp_period_requested: [
			{ required: true, message: "It is not selected" },
		],
		cat_id: [
			// { required: true, message: "It is not selected" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const insurance_flag = getFieldValue("need_insurance")
					const cat_id = getFieldValue("cat_id")
					return insurance_flag === 1 && (cat_id === null || cat_id === undefined) ? Promise.reject("It is not selected") : Promise.resolve();
				}
			})
		],
		non_ele_acc_cost: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const non_ele_acc_cost = parseInt(getFieldValue("non_ele_acc_cost"))
					if (non_ele_acc_cost < 0) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					} else if (non_ele_acc_cost > 999999) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		acc_cost: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const acc_cost = parseInt(getFieldValue("acc_cost"))
					if (acc_cost < 0) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					} else if (acc_cost > 999999) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		budget: [
			{ pattern: /^([0-9]+)$/, message: "It must be positive integer." },
			({ getFieldValue }) => ({
				validator(value, rule) {
					if (getFieldValue("budget") > 9999999) {
						return Promise.reject("It must be an integer, range is 0 to 99,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		remarks_sc: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					const insurance_flag = getFieldValue("need_insurance")
					const remarks_sc = getFieldValue("remarks_sc")
					return insurance_flag === 0 && (remarks_sc === null || remarks_sc === undefined) ? Promise.reject("It can not be blank") : Promise.resolve();
				}
			}),
			{
				max: 800,
				message: "Maximum length is 800 characters",
			},
		],
		remarks_ie: [
			({ getFieldValue }) => ({
				validator(value, rule) {
					const insurance_flag = getFieldValue("need_insurance")
					const remarks_ie = getFieldValue("remarks_ie")
					return insurance_flag === 0 && (remarks_ie === null || remarks_ie === undefined) ? Promise.reject("It can not be blank") : Promise.resolve();
				}
			}),
			{
				max: 800,
				message: "Maximum length is 800 characters",
			},
		]
	}
}

const vsmUploadDocument = {
	validation: {
		name: [
			{ required: true, message: "Document name cannot be blank" },
			{
				max: 50,
				message: "Maximum length of document name is 50 characters",
			},
		],
		remarks: [
			{
				max: 800,
				message: "Maximum length of remarks is 800 characters",
			},
		]
	}
}

const vsmInsuranceCustomer = {
	validation: {
		full_name: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		gender_id: [
			{ required: true, message: "It is not selected" },
		],
		zone_id: [
			{ required: true, message: "It is not selected" },
		],
		phone1: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		phone2: [
			{
				max: 50,
				message: "Maximum length is 50 characters",
			},
		],
		email: [
			{ required: true, message: "It cannot be blank" },
			{
				pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
				message: "Please use valid email",
			},
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		remarks: [
			{
				max: 800,
				message: "Maximum length of remarks is 800 characters",
			},
		],
		address1: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		address2: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		address3: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 100,
				message: "Maximum length is 100 characters",
			},
		],
		zipcode: [
			{ required: true, message: "It cannot be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a 10 digit code" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const zipcode = parseInt(getFieldValue("zipcode"));
					if (zipcode > 0 && zipcode > 99999999999) {
						return Promise.reject("It must be a 10 digit code");
					}
					return Promise.resolve();
				},
			})
		],
		state_id: [
			{ required: true, message: "It is not selected" },
		],
		city_id: [
			{ required: true, message: "It is not selected" },
		],
		area_id: [
			{ required: true, message: "It is not selected" },
		],
		nom_name: [
			{ required: true, message: "It cannot be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		nom_birthdate: [
			{ required: true, message: "It cannot be blank" },
		],
		nom_rel_id: [
			{ required: true, message: "It cannot be blank" },
		]
	}
}

const vsmInsuranceVehicle = {
	validation: {
		brand_id: [
			{ required: true, message: "It is not selected" },
		],
		model_id: [
			{ required: true, message: "It is not selected" },
		],
		variant: [
			{ required: true, message: "It can not be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		color: [
			{ required: true, message: "It can not be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		cc_id: [
			{ required: true, message: "It is not selected" },
		],
		passengers: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const passengers = parseInt(getFieldValue("passengers"));
					if (passengers > 0 && passengers > 999) {
						return Promise.reject("Valid range is 1 to 999");
					}
					return Promise.resolve();
				},
			})
		],
		weight: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be an integer value" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const weight = parseInt(getFieldValue("weight"));
					if (weight > 0 && weight > 9999) {
						return Promise.reject("Valid range is 1 to 9999");
					}
					return Promise.resolve();
				},
			})
		],
		cng_flag: [
			{ required: true, message: "It is not selected" },
		],
		purchase_date: [
			{ required: true, message: "It is not selected" },
		],
		mfg_year: [
			{ required: true, message: "It is not selected" },
		],
		vin_year: [
			{ required: true, message: "It is not selected" },
		],
		chassis_no: [
			{ required: true, message: "It can not be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		engine_no: [
			{ required: true, message: "It can not be blank" },
			{
				max: 50,
				message: "Maximum length is 50 characters",
			}
		],
		ex_showroom: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 1 to 99,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ex_showroom = parseInt(getFieldValue("ex_showroom"));
					if (ex_showroom > 0 && ex_showroom > 9999999) {
						return Promise.reject("It must be a valid integer, range is 1 to 99,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		acc_cost: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 1 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const acc_cost = parseInt(getFieldValue("acc_cost"));
					if (acc_cost > 0 && acc_cost > 999999) {
						return Promise.reject("It must be a valid integer, range is 1 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		non_ele_acc_cost: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It must be a valid integer, range is 1 to 9,99,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const non_ele_acc_cost = parseInt(getFieldValue("non_ele_acc_cost"));
					if (non_ele_acc_cost > 0 && non_ele_acc_cost > 999999) {
						return Promise.reject("It must be a valid integer, range is 1 to 9,99,999");
					}
					return Promise.resolve();
				},
			})
		],
		pass_cat_id: [
			{ required: true, message: "It is not selected" },
		],
		pass_sub_cat_id: [
			{ required: true, message: "It is not selected" },
		],
		zone_id: [
			{ required: true, message: "It is not selected" },
		],
		rto_place_id: [
			{ required: true, message: "It is not selected" },
		],
		remarks: [
			{
				max: 800,
				message: "Maximum length is 800 characters",
			}
		]
	}
}

const vsmInsuranceQuotation = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		prod_id: [{ required: true, message: "It is not selected." }],
		company_id: [{ required: true, message: "It is not selected." }],
		ncb_per: [{ required: true, message: "It is not selected." }],
		zone_id: [{ required: true, message: "It is not selected." }],
		tp_period: [{ required: true, message: "It is not selected." }],
		cat_id: [{ required: true, message: "It is not selected." }],
		gst_per: [{ required: true, message: "It is not selected." }],
		od_disc_load_flag: [{ required: true, message: "It is not selected." }],
		od_per: [
			{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const od_per = parseInt(getFieldValue("od_per"))
					if (od_per < 0) {
						return Promise.reject("It must be numeric range 0 to 100");
					} else if (od_per > 100) {
						return Promise.reject("It must be numeric range 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		dep_rate_exs: [
			{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const dep_rate_exs = parseInt(getFieldValue("dep_rate_exs"))
					if (dep_rate_exs < 0) {
						return Promise.reject("It must be numeric range 0 to 100");
					} else if (dep_rate_exs > 100) {
						return Promise.reject("It must be numeric range 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		tp_cng_insurance: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const tp_cng_insurance = parseInt(getFieldValue("tp_cng_insurance"))
					if (tp_cng_insurance < 0) {
						return Promise.reject("It must be an integer of range 0 to 9,999");
					} else if (tp_cng_insurance > 9999) {
						return Promise.reject("It must be an integer of range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
		ll_rate: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ll_rate = parseInt(getFieldValue("ll_rate"))
					if (ll_rate < 0) {
						return Promise.reject("It must be an integer of range 0 to 9,999");
					} else if (ll_rate > 9999) {
						return Promise.reject("It must be an integer of range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		],
		passback_req: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const passback_req = parseInt(getFieldValue("passback_req"))
					if (passback_req < 0) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					} else if (passback_req > 99999) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		CPA: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const CPA = parseInt(getFieldValue("CPA"))
					if (CPA < 0) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					} else if (CPA > 99999) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		pad: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pad = parseInt(getFieldValue("pad"))
					if (pad < 0) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					} else if (pad > 99999) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		pap: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const pap = parseInt(getFieldValue("pap"))
					if (pap < 0) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					} else if (pap > 99999) {
						return Promise.reject("It must be an integer of range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		non_ele_cost: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const non_ele_cost = parseInt(getFieldValue("non_ele_cost"))
					if (non_ele_cost < 0) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					} else if (non_ele_cost > 999999) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		dep_rate_nea: [
			{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const dep_rate_nea = parseInt(getFieldValue("dep_rate_nea"))
					if (dep_rate_nea < 0) {
						return Promise.reject("It must be numeric range 0 to 100");
					} else if (dep_rate_nea > 100) {
						return Promise.reject("It must be numeric range 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		dep_rate_ea: [
			{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const dep_rate_nea = parseInt(getFieldValue("dep_rate_nea"))
					if (dep_rate_nea < 0) {
						return Promise.reject("It must be numeric range 0 to 100");
					} else if (dep_rate_nea > 100) {
						return Promise.reject("It must be numeric range 0 to 100");
					}
					return Promise.resolve();
				},
			}),
		],
		idv_cng: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const idv_cng = parseInt(getFieldValue("idv_cng"))
					if (idv_cng < 0) {
						return Promise.reject("It must be an integrate, range 0 to 99,999");
					} else if (idv_cng > 99999) {
						return Promise.reject("It must be an integrate, range 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		ele_acc_cost: [
			{ pattern: /^(([0-9]+\.[0-9]{1,3})|[0-9]+)$/, message: "Value range is 0 to 100 and decimal only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const ele_acc_cost = parseInt(getFieldValue("ele_acc_cost"))
					if (ele_acc_cost < 0) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					} else if (ele_acc_cost > 999999) {
						return Promise.reject("It must be an integer value in range 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		anti_theft_per: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const anti_theft = parseInt(getFieldValue("anti_theft_per"))
					if (anti_theft < 0) {
						return Promise.reject("Range is 0 to 99");
					} else if (anti_theft > 99) {
						return Promise.reject("Range is 0 to 99");
					}
					return Promise.resolve();
				},
			}),
		],
		cpa: [
			{ pattern: /^([0-9]+)$/, message: "It must be an integer" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const cpa = parseInt(getFieldValue("cpa"))
					if (cpa < 0) {
						return Promise.reject("Range is 0 to 99,999");
					} else if (cpa > 99999) {
						return Promise.reject("Range is 0 to 99,999");
					}
					return Promise.resolve();
				},
			}),
		],
	}
}

const vsmChangeTelecaller = {
	validation: {
		user_id: [
			{ required: true, message: "It is not selected" },
		],
	}
}

const vsmRTOCharges = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		cc_id: [
			{ required: true, message: "It is not selected" }
		],
		hypothecation_charge: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const hypothecation_charge = parseInt(getFieldValue("hypothecation_charge"))
					if (hypothecation_charge < 0) {
						return Promise.reject("Range is 0 to 9,99,999");
					} else if (hypothecation_charge > 999999) {
						return Promise.reject("Range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
		other_charges: [
			{ required: true, message: "It can not be blank" },
			{ pattern: /^([0-9]+)$/, message: "It allows digits only" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const other_charges = parseInt(getFieldValue("other_charges"))
					if (other_charges < 0) {
						return Promise.reject("Range is 0 to 9,99,999");
					} else if (other_charges > 999999) {
						return Promise.reject("Range is 0 to 9,99,999");
					}
					return Promise.resolve();
				},
			}),
		],
	},
};

const vsmCompanySettings = {
	success: "Successfully Created",
	edit: "Successfully Updated",
	validation: {
		crtm: [
			{ pattern: /^([0-9]+)$/, message: "It must be a value in range 0 to 9,999" },
			({ getFieldValue }) => ({
				validator(value, rule) {
					const crtm = parseInt(getFieldValue("crtm"))
					if (crtm > 9999) {
						return Promise.reject("It must be a value in range 0 to 9,999");
					}
					return Promise.resolve();
				},
			}),
		]
	}
}

const vsmProfile = {
	success: "Password changed successfully.",
	validation: {
		old_password: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 8,
				message: "Password must have at least 8 characters",
			},
			{
				max: 20,
				message: "Maximum length for Password is 20 characters",
			},
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@_-])[a-zA-Z0-9@_-]{1,}$/,
				message:
					"Password must have one lowercase, one uppercase, one digit and one special character(_, -, @).",
			},
		],
		new_password: [
			{ required: true, message: "It cannot be blank." },
			{
				min: 8,
				message: "Password must have at least 8 characters",
			},
			{
				max: 20,
				message: "Maximum length for Password is 20 characters",
			},
			{
				pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@_-])[a-zA-Z0-9@_-]{1,}$/,
				message:
					"Password must have one lowercase, one uppercase, one digit and one special character(_, -, @).",
			},
		],
		confirm_password: [
			{ required: true, message: "It cannot be blank." },
			({ getFieldValue }) => ({
				validator(rule, value) {
					if (!value || getFieldValue("new_password") === value) {
						return Promise.resolve();
					}
					return Promise.reject(
						"New Password and Confirm Password does not match."
					);
				},
			}),
		],
	}
}

const vsmPayoutRevert = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmPayoutMarkAsReceived = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmPayoutMarkAsRejected = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmPayoutMarkAsApproved = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmPayoutMarkAsClaimed = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmInsurancePayoutMarkAsApproved = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmInsurancePayoutMarkAsClaimed = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmInsurancePayoutMarkAsReceived = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmInsurancePayoutMarkAsRejected = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmInsurancePayoutRevert = {
	validation: {
		remark: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 800,
				message: "Maximum length for remarks is 800 characters",
			},
		],
	},
}

const vsmRTOPlaces = {
	validation: {
		code: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 10,
				message: "Maximum length for remarks is 10 characters",
			},
		],
		name: [
			{ required: true, message: "It cannot be blank." },
			{
				max: 50,
				message: "Maximum length for remarks is 50 characters",
			},
		],
		zone_id: [{ required: true, message: "It is not selected" }],
	},
}

const vsmNotify = {
	success: (data) => {
		notification.success({ placement: "bottomRight", duration: 3, ...data });
	},
	error: (data) => {
		notification.error({ placement: "bottomRight", duration: 3, ...data });
	},
};

export {
	vsmNotify,
	vsmAuth,
	vsmCommon,
	vsmState,
	vsmCity,
	vsmArea,
	vsmLocation,
	vsmInquiryArea,
	vsmPremises,
	vsmPremisesType,
	vsmDSA,
	vsmDepartment,
	vsmDesignation,
	vsmBank,
	vsmSegment,
	vsmSupplier,
	vsmBrand,
	vsmWhiteListIPs,
	vsmFuelOption,
	vsmTransmissionType,
	vsmVehicleType,
	vsmPurchaseType,
	vsmCharacteristics,
	vsmFamilyMember,
	vsmCompanyProfileCS,
	vsmHeroimageCS,
	vsmFavIconCS,
	vsmLogoUploadCS,
	vsmEmailBannerCS,
	vsmBuyingFor,
	vsmDriveCar,
	vsmDailyRun,
	vsmDrivenMode,
	vsmGST,
	vsmCC,
	vsmColors,
	vsmAccessoryType,
	vsmModel,
	vsmCompanyPreference,
	vsmAccessory,
	vsmInquiryMode,
	vsmInquiryMedia,
	vsmInquiryRating,
	vsmInsuranceCompany,
	vsmInsuranceCategory,
	vsmEmploymentType,
	vsmZone,
	vsmDealType,
	vsmDealCategory,
	vsmCustomerType,
	vsmInquiryClosureType,
	vsmVariants,
	vsmInquiryFollowupAction,
	vsmRole,
	vsmUsageType,
	vsmTestDriveLocation,
	vsmPurpose,
	vsmPassingType,
	vsmApprovedCompany,
	vsmLevel,
	vsmPayType,
	vsmHoliday,
	vsmSMS,
	vsmEmail,
	vsmLoanSource,
	vsmUsers,
	vsmImportTransaction,
	vsmInTransit,
	vsmInWard,
	vsmInquiryMediaSubCategory,
	vsmSalesProfile,
	vsmScheme,
	vsmImportInquiry,
	vsmRecordInquiry,
	vsmKitty,
	vsmConfirmBooking,
	vsmCustomerInfo,
	vsmZFormModelInfo,
	vsmPackage,
	vsmPackageEntry,
	vsmLedgerInput,
	vsmCorporateBenefit,
	vsmRTOOffer,
	vsmAccessoryOffer,
	vsmFinanceLedger,
	vsmQuotation,
	vsmQuotationApproval,
	vsmQuotationLostCase,
	vsmQuotationRevert,
	vsmQuotationArchive,
	vsmQuotationRestore,
	vsmQuotationDiscountApproval,
	vsmResetZForm,
	vsmChangeName,
	vsmNCBPer,
	vsmAddOns,
	vsmDepreciationRates,
	vsmInsuranceRates,
	vsmInsuranceProducts,
	vsmInsuranceCopyProducts,
	vsmInsuranceTPRates,
	vsmBankAccount,
	vsmSchemeDiscountReq,
	vsmSentInvoice,
	vsmRevertOfferNote,
	vsmApplyInsurance,
	vsmInsuranceSelectAddOns,
	vsmUploadDocument,
	vsmInsuranceCustomer,
	vsmInsuranceVehicle,
	vsmInsuranceQuotation,
	vsmInsuranceFollowup,
	vsmInsuranceOffer,
	vsmAllocateInsurance,
	vsmInsurancePayment,
	vsmChangeTelecaller,
	vsmRTOCharges,
	vsmCompanySettings,
	vsmPaymentModes,
	vsmManageInfo,
	vsmProfile,
	vsmPayoutRevert,
	vsmPayoutMarkAsReceived,
	vsmPayoutMarkAsRejected,
	vsmPayoutMarkAsApproved,
	vsmPayoutMarkAsClaimed,
	vsmInsurancePayoutMarkAsApproved,
	vsmInsurancePayoutMarkAsClaimed,
	vsmInsurancePayoutMarkAsReceived,
	vsmInsurancePayoutMarkAsRejected,
	vsmInsurancePayoutRevert,
	vsmRTOPlaces,
};
