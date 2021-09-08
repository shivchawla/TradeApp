import React from 'react';

const ContactSchema = Yup.object().shape({
	addressLine1: Yup.string().required('Address is required'),
	addressLine2: Yup.string(),
	city: Yup.string().required('City is required'),
	state: Yup.string().required('State is required'),
	postalCode: Yup.string().required('Postal Code is required'),
	country: Yup.string().required('Country is required')
});

export const ContactForm = ({onSubmit, initialValues = {}, setCustomError,  ...props}) => {

	const formik = useFormik({
		validationSchema: ContactSchema,
		initialValues: { 
			addressLine1: '',
			addressLine2: '',
			city: 'Guatemala City',
			state: 'Guatemala',
			postalCode: '01001',
			country: 'Guatemala',
			...initialValues
		},
		validateOnChange: false,
      	validateOnBlur: false,
		onSubmit: onSubmit
	});


	return (
		<View style={style.formContainer}>

			<FormTextField field="addressLine1" placeholder="Address Line 1" handler={formik} />
			<FormTextField field="addressLine2" placeholder="Address Line 2" handler={formik} />
			<FormTextField field="city" placeholder="City" handler={formik} />
			<FormTextField field="state" placeholder="State" handler={formik} />
			<FormTextField field="postalCode" placeholder="Postal Code" handler={formik} />

			<FormCountryField field="country" placeholder="Country" handler={formik} />

			<ConfirmButton title="Next" onClick={onSubmit}/>
		</View>
	)
}
