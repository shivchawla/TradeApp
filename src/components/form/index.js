import * as Yup from 'yup';

export const CountryScheme = Yup.object().shape({
	name: Yup.string(),
	code: Yup.string()
});

export { DepositForm } from './deposit';
export { FormTextField } from './formTextField';
export { FormCountryField } from './formCountryField';
export { FormDateField } from './formDateField';

