export const processOnboardingData = (user) => {
	return {
		contact: {
			email_address: user?.email,
			phone_number: user?.phone || "",
			street_address: (user?.contact?.addressLine1 + ' ' +  user?.contact?.addressLine2).trim(),
			city: user?.contact?.city,
			state: user?.contact?.state,
			postal_code: user?.contact?.postalCode,
			country: user?.contact?.country
		},
		identity: {
			given_name: (user?.identity?.firstName + '' + user?.identity?.middleName).trim(),
			family_name: user?.identity?.lastName,
			date_of_birth: user?.identity?.dateBirth,
			tax_id: user?.taxInfo?.taxId,
			tax_id_type: user?.taxInfo?.taxType,
			country_of_citizenship: user?.identity?.citizenCountry,
			country_of_birth: user?.identity?.birthCountry,
			country_of_tax_residence: user?.taxInfo?.taxCountry,
			funding_source: user?.taxInfo?.fundSource
		},
		disclosures: {
			is_control_person: user?.disclosures?.isControlPerson,
			is_affiliated_exchange_or_finra: user?.disclosures?.isAffiliated,
			is_politically_exposed: user?.disclosures?.isPolitical,
			immediate_family_exposed: user?.disclosures?.isFamilyExposed,
			employmentStatus: user?.employment?.employmentStatus,
			employerName: user?.employment?.employerName,
			employerAddress: Object.values(user?.employment?.employerAddress).join(', '),
			employmentPosition: user?.employment?.employmentPosition
		},
		agreements: [{
			agreement: "margin_agreement",
			signed_at: user?.margin_agreement?.signedAt,
			ip_address: user?.margin_agreement?.ipAddress,
		},
		{
			agreement: "account_agreement",
			signed_at: user?.account_agreement?.signedAt,
			ip_address: user?.account_agreement?.ipAddress,
		},
		{
			agreement: "customer_agreement",
			signed_at: user?.customer_agreement?.signedAt,,
			ip_address: user?.customer_agreement?.ipAddress,
		}],
		trusted_contact: {
			given_name: user?.trustedContact?.firstName,
    		family_name: user?.trustedContact?.lastName,
    		email_address: user?.trustedContact?.email,
		}
	};
}
